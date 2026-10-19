import {
  authenticateVoter,
  saveVoterProfile,
  verifyFirebaseIdentity,
} from "./votes.mjs";

const initialized = new WeakMap();
const competitionUrl =
  "https://copafacil-web.firebaseio.com/events/-ciddy/matchs.json";
const idPattern = /^[A-Za-z0-9_-]{1,128}$/;

async function initialize(db) {
  if (!initialized.has(db)) {
    initialized.set(
      db,
      db
        .batch([
          db.prepare(
            "CREATE TABLE IF NOT EXISTS voter_profiles (uid TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL, display_name TEXT NOT NULL, nickname TEXT COLLATE NOCASE UNIQUE, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
          ),
          db.prepare(
            "CREATE TABLE IF NOT EXISTS pool_players (voter_uid TEXT PRIMARY KEY NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
          ),
          db.prepare(
            "CREATE TABLE IF NOT EXISTS pool_predictions (voter_uid TEXT NOT NULL, round_id TEXT NOT NULL, match_id TEXT NOT NULL, home_score INTEGER NOT NULL CHECK (home_score BETWEEN 0 AND 99), away_score INTEGER NOT NULL CHECK (away_score BETWEEN 0 AND 99), updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (voter_uid, round_id, match_id))",
          ),
          db.prepare(
            "CREATE INDEX IF NOT EXISTS pool_predictions_round ON pool_predictions (round_id)",
          ),
        ])
        .catch((error) => {
          initialized.delete(db);
          throw error;
        }),
    );
  }
  await initialized.get(db);
}

function response(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

function validId(value) {
  return typeof value === "string" && idPattern.test(value);
}

export async function loadCompetitionMatches() {
  const result = await fetch(competitionUrl, {
    headers: { Accept: "application/json" },
  });
  if (!result.ok) throw new Error("Calendário da competição indisponível");
  const body = await result.json();
  return Object.entries(body || {}).map(([id, match]) => ({ id, ...match }));
}

function nextRound(matches, now) {
  const next = matches
    .filter(
      (match) =>
        validId(match.m_set) &&
        Number(match.d_i) > now &&
        Number(match.st) !== 3 &&
        !match.finished,
    )
    .sort((a, b) => Number(a.d_i) - Number(b.d_i))[0];
  if (!next) return null;
  const roundMatches = matches.filter((match) => match.m_set === next.m_set);
  return {
    id: next.m_set,
    lockAt: Math.min(...roundMatches.map((match) => Number(match.d_i))),
    matches: roundMatches,
  };
}

function outcome(home, away) {
  return Math.sign(home - away);
}

function pointsFor(prediction, match) {
  const home = Number(match.dt?.qt_g1);
  const away = Number(match.dt?.qt_g2);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return 0;
  if (prediction.home_score === home && prediction.away_score === away) return 5;
  if (prediction.home_score - prediction.away_score === home - away) return 2;
  if (outcome(prediction.home_score, prediction.away_score) === outcome(home, away))
    return 1;
  return 0;
}

async function ranking(db, matches) {
  const query = await db
    .prepare(
      "SELECT v.nickname, r.match_id, r.home_score, r.away_score FROM pool_players p JOIN voter_profiles v ON v.uid = p.voter_uid LEFT JOIN pool_predictions r ON r.voter_uid = p.voter_uid WHERE v.nickname IS NOT NULL ORDER BY v.nickname",
    )
    .all();
  const matchById = new Map(matches.map((match) => [match.id, match]));
  const players = new Map();
  for (const prediction of query.results) {
    if (!players.has(prediction.nickname)) {
      players.set(prediction.nickname, {
        nickname: prediction.nickname,
        points: 0,
        exact: 0,
        hits: 0,
        predictions: 0,
      });
    }
    if (!prediction.match_id) continue;
    const match = matchById.get(prediction.match_id);
    if (!match || (Number(match.st) !== 3 && !match.finished)) continue;
    const points = pointsFor(prediction, match);
    const player = players.get(prediction.nickname);
    player.points += points;
    player.exact += Number(points === 5);
    player.hits += Number(points > 0);
    player.predictions += 1;
  }
  return [...players.values()]
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.exact - a.exact ||
        b.hits - a.hits ||
        a.nickname.localeCompare(b.nickname, "pt-BR"),
    )
    .map((player, index) => ({ position: index + 1, ...player }));
}

export async function poolResponse(
  request,
  env,
  verifier = verifyFirebaseIdentity,
  matchesLoader = loadCompetitionMatches,
  now = Date.now(),
) {
  if (!env.DB)
    return response({ error: "O bolão ainda não foi configurado" }, 503);
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (
    request.method === "POST" &&
    ((origin && origin !== url.origin) ||
      request.headers.get("Sec-Fetch-Site") === "cross-site")
  )
    return response({ error: "Origem não permitida" }, 403);
  try {
    await initialize(env.DB);
    const matches = await matchesLoader();
    if (url.pathname === "/api/pool/ranking") {
      if (request.method !== "GET")
        return response({ error: "Método não permitido" }, 405);
      return response({ ranking: await ranking(env.DB, matches) });
    }
    const identity = await authenticateVoter(request, verifier);
    if (url.pathname !== "/api/pool/entry")
      return response({ error: "Rota não encontrada" }, 404);
    const roundId =
      request.method === "GET"
        ? url.searchParams.get("roundId")
        : (await request.clone().json()).roundId;
    if (!validId(roundId)) return response({ error: "Rodada inválida" }, 400);
    if (request.method === "GET") {
      const predictions = await env.DB
        .prepare(
          "SELECT match_id AS matchId, home_score AS homeScore, away_score AS awayScore FROM pool_predictions WHERE voter_uid = ? AND round_id = ?",
        )
        .bind(identity.uid, roundId)
        .all();
      return response({
        predictions: predictions.results,
      });
    }
    if (request.method !== "POST")
      return response({ error: "Método não permitido" }, 405);
    const body = await request.json();
    const round = nextRound(matches, now);
    if (!round || round.id !== body.roundId)
      return response({ error: "Somente a próxima rodada aceita palpites" }, 400);
    if (now >= round.lockAt)
      return response({ error: "Os palpites desta rodada estão encerrados" }, 409);
    const allowedMatches = new Set(round.matches.map((match) => match.id));
    const predictions = Array.isArray(body.predictions) ? body.predictions : [];
    if (
      predictions.length < 1 ||
      predictions.length > round.matches.length ||
      predictions.some(
        (prediction) =>
          !validId(prediction.matchId) ||
          !allowedMatches.has(prediction.matchId) ||
          !Number.isInteger(prediction.homeScore) ||
          !Number.isInteger(prediction.awayScore) ||
          prediction.homeScore < 0 ||
          prediction.homeScore > 99 ||
          prediction.awayScore < 0 ||
          prediction.awayScore > 99,
      ) ||
      new Set(predictions.map((prediction) => prediction.matchId)).size !==
        predictions.length
    )
      return response({ error: "Informe pelo menos um placar válido" }, 400);
    await saveVoterProfile(env.DB, identity);
    const profile = await env.DB
      .prepare("SELECT nickname FROM voter_profiles WHERE uid = ?")
      .bind(identity.uid)
      .first();
    if (!profile?.nickname)
      return response(
        { error: "Adicione um apelido na aba Usuário antes de palpitar" },
        400,
      );
    await env.DB.batch([
      env.DB
        .prepare("INSERT OR IGNORE INTO pool_players (voter_uid) VALUES (?)")
        .bind(identity.uid),
      ...predictions.map((prediction) =>
        env.DB
          .prepare(
            "INSERT INTO pool_predictions (voter_uid, round_id, match_id, home_score, away_score) VALUES (?, ?, ?, ?, ?) ON CONFLICT(voter_uid, round_id, match_id) DO UPDATE SET home_score = excluded.home_score, away_score = excluded.away_score, updated_at = CURRENT_TIMESTAMP",
          )
          .bind(
            identity.uid,
            body.roundId,
            prediction.matchId,
            prediction.homeScore,
            prediction.awayScore,
          ),
      ),
    ]);
    return response(
      {
        saved: predictions.length,
        lockAt: new Date(round.lockAt).toISOString(),
      },
      200,
    );
  } catch (error) {
    const message = String(error?.message || error);
    if (/Google|Firebase|credencial|Entre com/i.test(message))
      return response({ error: message }, 401);
    console.error("Falha no bolão", error);
    return response({ error: "Não foi possível processar o bolão" }, 500);
  }
}
