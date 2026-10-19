const initialized = new WeakMap();
const jwksCache = { expires: 0, keys: [] };
const idPattern = /^[A-Za-z0-9_-]{1,128}$/;
const competitionUrl =
  "https://copafacil-web.firebaseio.com/events/-ciddy/matchs";
export const firebaseConfig = {
  apiKey: "AIzaSyAxm8BysDScxWV0aToqrz3KqPBNYNdMeBM",
  authDomain: "laligaviw.firebaseapp.com",
  projectId: "laligaviw",
  storageBucket: "laligaviw.firebasestorage.app",
  messagingSenderId: "60493007804",
  appId: "1:60493007804:web:77fc0452392f8bee4a39b9",
  measurementId: "G-1MX8P4WHKE",
};

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
            "CREATE TABLE IF NOT EXISTS vote_ballots (voter_uid TEXT NOT NULL, match_id TEXT NOT NULL, kind TEXT NOT NULL, favorite_team_id TEXT, best_player_id TEXT, worst_player_id TEXT, team1_best_player_id TEXT, team1_worst_player_id TEXT, team2_best_player_id TEXT, team2_worst_player_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (voter_uid, match_id, kind))",
          ),
          db.prepare(
            "CREATE TABLE IF NOT EXISTS player_ratings (voter_uid TEXT NOT NULL, match_id TEXT NOT NULL, player_id TEXT NOT NULL, rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 10), PRIMARY KEY (voter_uid, match_id, player_id))",
          ),
          db.prepare(
            "CREATE INDEX IF NOT EXISTS vote_ballots_match_kind ON vote_ballots (match_id, kind)",
          ),
          db.prepare(
            "CREATE INDEX IF NOT EXISTS player_ratings_match ON player_ratings (match_id)",
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

const decode = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(normalized), (character) =>
    character.charCodeAt(0),
  );
  return bytes;
};

async function firebaseKeys(now = Date.now()) {
  if (jwksCache.expires > now && jwksCache.keys.length) return jwksCache.keys;
  const response = await fetch(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  );
  if (!response.ok) throw new Error("Não foi possível validar a conta Google");
  const body = await response.json();
  const maxAge =
    Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1]) ||
    3600;
  jwksCache.keys = body.keys || [];
  jwksCache.expires = now + maxAge * 1000;
  return jwksCache.keys;
}

export async function verifyFirebaseIdentity(
  token,
  projectId,
  now = Date.now(),
) {
  const parts = token?.split(".");
  if (parts?.length !== 3) throw new Error("Credencial Google inválida");
  const header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(decode(parts[1])));
  const key = (await firebaseKeys(now)).find(
    (candidate) => candidate.kid === header.kid && candidate.kty === "RSA",
  );
  if (!key) throw new Error("Chave da credencial Google não encontrada");
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    key,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    decode(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (
    !valid ||
    payload.iss !== `https://securetoken.google.com/${projectId}` ||
    payload.aud !== projectId ||
    payload.exp * 1000 <= now ||
    payload.iat * 1000 > now ||
    payload.auth_time * 1000 > now ||
    !payload.sub ||
    payload.sub.length > 128 ||
    payload.firebase?.sign_in_provider !== "google.com"
  ) {
    throw new Error("Credencial do Firebase expirada ou inválida");
  }
  if (
    payload.email_verified !== true ||
    typeof payload.email !== "string" ||
    !payload.email
  )
    throw new Error("A conta Google precisa ter um e-mail verificado");
  return {
    uid: payload.sub,
    email: payload.email,
    name:
      typeof payload.name === "string" && payload.name.trim()
        ? payload.name.trim()
        : payload.email.split("@")[0],
  };
}

function validId(value) {
  return typeof value === "string" && idPattern.test(value);
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

export async function authenticateVoter(
  request,
  verifier = verifyFirebaseIdentity,
) {
  const token = request.headers.get("Authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new Error("Entre com o Google para continuar");
  const identity = await verifier(token, firebaseConfig.projectId);
  if (
    !identity ||
    !validId(identity.uid) ||
    typeof identity.email !== "string" ||
    typeof identity.name !== "string"
  )
    throw new Error("Identidade Google inválida");
  return identity;
}

export async function saveVoterProfile(db, identity) {
  await db.batch([
    db
      .prepare(
        "INSERT INTO voter_profiles (uid, email, display_name) VALUES (?, ?, ?) ON CONFLICT(uid) DO UPDATE SET email = excluded.email, display_name = excluded.display_name, updated_at = CURRENT_TIMESTAMP",
      )
      .bind(identity.uid, identity.email, identity.name),
  ]);
}

export async function loadCompetitionMatch(matchId) {
  const result = await fetch(
    `${competitionUrl}/${encodeURIComponent(matchId)}.json`,
    { headers: { Accept: "application/json" } },
  );
  if (!result.ok) throw new Error("Partida indisponível");
  return result.json();
}

function teamHighlightPoints(match) {
  const team1Goals = Number(match.dt?.qt_g1);
  const team2Goals = Number(match.dt?.qt_g2);
  if (team1Goals === team2Goals)
    return {
      team1: { best: 8, worst: 2 },
      team2: { best: 8, worst: 2 },
    };
  return team1Goals > team2Goals
    ? {
        team1: { best: 10, worst: 4 },
        team2: { best: 6, worst: 1 },
      }
    : {
        team1: { best: 6, worst: 1 },
        team2: { best: 10, worst: 4 },
      };
}

async function results(db, matchId, match) {
  const points = teamHighlightPoints(match);
  const [team1Best, team1Worst, team2Best, team2Worst, playerPoints, total] =
    await Promise.all([
    db
      .prepare(
        "SELECT team1_best_player_id AS id, COUNT(*) AS votes FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation' GROUP BY team1_best_player_id ORDER BY votes DESC",
      )
      .bind(matchId)
      .all(),
    db
      .prepare(
        "SELECT team1_worst_player_id AS id, COUNT(*) AS votes FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation' GROUP BY team1_worst_player_id ORDER BY votes DESC",
      )
      .bind(matchId)
      .all(),
    db
      .prepare(
        "SELECT team2_best_player_id AS id, COUNT(*) AS votes FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation' GROUP BY team2_best_player_id ORDER BY votes DESC",
      )
      .bind(matchId)
      .all(),
    db
      .prepare(
        "SELECT team2_worst_player_id AS id, COUNT(*) AS votes FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation' GROUP BY team2_worst_player_id ORDER BY votes DESC",
      )
      .bind(matchId)
      .all(),
    db
      .prepare(
        "SELECT id, SUM(points) AS points FROM (SELECT team1_best_player_id AS id, ? AS points FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation' UNION ALL SELECT team1_worst_player_id AS id, ? AS points FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation' UNION ALL SELECT team2_best_player_id AS id, ? AS points FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation' UNION ALL SELECT team2_worst_player_id AS id, ? AS points FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation') WHERE id IS NOT NULL GROUP BY id ORDER BY points DESC",
      )
      .bind(
        points.team1.best,
        matchId,
        points.team1.worst,
        matchId,
        points.team2.best,
        matchId,
        points.team2.worst,
        matchId,
      )
      .all(),
    db
      .prepare(
        "SELECT COUNT(*) AS count FROM vote_ballots WHERE match_id = ? AND kind = 'evaluation'",
      )
      .bind(matchId)
      .first(),
  ]);
  return {
    kind: "evaluation",
    total: total.count,
    team1Best: team1Best.results,
    team1Worst: team1Worst.results,
    team2Best: team2Best.results,
    team2Worst: team2Worst.results,
    playerPoints: playerPoints.results,
  };
}

export async function votesResponse(
  request,
  env,
  verifier = verifyFirebaseIdentity,
  matchLoader = loadCompetitionMatch,
) {
  const url = new URL(request.url);
  if (url.pathname === "/api/votes/config") {
    return request.method === "GET"
      ? response({ firebaseConfig })
      : response({ error: "Método não permitido" }, 405);
  }
  if (!env.DB) {
    return response(
      { error: "A votação ainda não foi configurada pelo administrador" },
      503,
    );
  }
  const matchId = decodeURIComponent(
    url.pathname.match(/^\/api\/votes\/([^/]+)$/)?.[1] || "",
  );
  const kind = url.searchParams.get("kind");
  if (!validId(matchId) || kind !== "evaluation") {
    return response({ error: "Votação inválida" }, 400);
  }
  const origin = request.headers.get("Origin");
  if (
    request.method === "POST" &&
    ((origin && origin !== url.origin) ||
      request.headers.get("Sec-Fetch-Site") === "cross-site")
  ) {
    return response({ error: "Origem não permitida" }, 403);
  }
  try {
    await initialize(env.DB);
    const match = await matchLoader(matchId);
    if (!match || (Number(match.st) !== 3 && !match.finished))
      return response(
        { error: "A votação abre somente após o encerramento da partida" },
        409,
      );
    if (
      !Number.isFinite(match.dt?.qt_g1) ||
      !Number.isFinite(match.dt?.qt_g2)
    )
      return response(
        { error: "A votação aguarda a publicação do placar final" },
        409,
      );
    const identity = await authenticateVoter(request, verifier);
    if (request.method === "GET") {
      const ballot = await env.DB
        .prepare(
          "SELECT 1 AS found FROM vote_ballots WHERE voter_uid = ? AND match_id = ? AND kind = ?",
        )
        .bind(identity.uid, matchId, kind)
        .first();
      if (!ballot)
        return response(
          { error: "Vote nesta etapa para liberar os resultados" },
          403,
        );
      return response(await results(env.DB, matchId, match));
    }
    if (request.method !== "POST")
      return response({ error: "Método não permitido" }, 405);
    const body = await request.json();
    const highlights = [
      body.team1BestPlayerId,
      body.team1WorstPlayerId,
      body.team2BestPlayerId,
      body.team2WorstPlayerId,
    ];
    if (
      highlights.some((playerId) => !validId(playerId)) ||
      body.team1BestPlayerId === body.team1WorstPlayerId ||
      body.team2BestPlayerId === body.team2WorstPlayerId
    )
      return response(
        { error: "Escolha o melhor e o pior de cada equipe" },
        400,
      );
    const statements = [
      env.DB
        .prepare(
          "INSERT INTO vote_ballots (voter_uid, match_id, kind, team1_best_player_id, team1_worst_player_id, team2_best_player_id, team2_worst_player_id) VALUES (?, ?, 'evaluation', ?, ?, ?, ?)",
        )
        .bind(
          identity.uid,
          matchId,
          body.team1BestPlayerId,
          body.team1WorstPlayerId,
          body.team2BestPlayerId,
          body.team2WorstPlayerId,
        ),
    ];
    await saveVoterProfile(env.DB, identity);
    await env.DB.batch(statements);
    return response(await results(env.DB, matchId, match), 201);
  } catch (error) {
    const message = String(error?.message || error);
    if (/UNIQUE|PRIMARY KEY|constraint/i.test(message))
      return response({ error: "Seu voto nesta etapa já foi registrado" }, 409);
    if (/Google|credencial|Entre com/i.test(message))
      return response({ error: message }, 401);
    console.error("Falha na votação", error);
    return response({ error: "Não foi possível processar a votação" }, 500);
  }
}
