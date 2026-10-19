import {
  authenticateVoter,
  saveVoterProfile,
  verifyFirebaseIdentity,
} from "./votes.mjs";

const initialized = new WeakMap();

async function initialize(db) {
  if (!initialized.has(db)) {
    initialized.set(
      db,
      db
        .batch([
          db.prepare(
            "CREATE TABLE IF NOT EXISTS voter_profiles (uid TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL, display_name TEXT NOT NULL, nickname TEXT COLLATE NOCASE, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
          ),
          db.prepare(
            "CREATE TABLE IF NOT EXISTS vote_ballots (voter_uid TEXT NOT NULL, match_id TEXT NOT NULL, kind TEXT NOT NULL, favorite_team_id TEXT, best_player_id TEXT, worst_player_id TEXT, team1_best_player_id TEXT, team1_worst_player_id TEXT, team2_best_player_id TEXT, team2_worst_player_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (voter_uid, match_id, kind))",
          ),
          db.prepare(
            "CREATE TABLE IF NOT EXISTS player_ratings (voter_uid TEXT NOT NULL, match_id TEXT NOT NULL, player_id TEXT NOT NULL, rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 10), PRIMARY KEY (voter_uid, match_id, player_id))",
          ),
          db.prepare(
            "CREATE TABLE IF NOT EXISTS pool_players (voter_uid TEXT PRIMARY KEY NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)",
          ),
          db.prepare(
            "CREATE TABLE IF NOT EXISTS pool_predictions (voter_uid TEXT NOT NULL, round_id TEXT NOT NULL, match_id TEXT NOT NULL, home_score INTEGER NOT NULL CHECK (home_score BETWEEN 0 AND 99), away_score INTEGER NOT NULL CHECK (away_score BETWEEN 0 AND 99), updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (voter_uid, round_id, match_id))",
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

function validNickname(value) {
  return (
    typeof value === "string" &&
    value.trim().length >= 3 &&
    value.trim().length <= 24 &&
    /^[\p{L}\p{N} ._-]+$/u.test(value.trim())
  );
}

export async function userResponse(
  request,
  env,
  verifier = verifyFirebaseIdentity,
) {
  if (!env.DB) return response({ error: "Perfil indisponível" }, 503);
  const url = new URL(request.url);
  if (url.pathname !== "/api/user/profile")
    return response({ error: "Rota não encontrada" }, 404);
  const origin = request.headers.get("Origin");
  if (
    ["PUT", "DELETE"].includes(request.method) &&
    ((origin && origin !== url.origin) ||
      request.headers.get("Sec-Fetch-Site") === "cross-site")
  )
    return response({ error: "Origem não permitida" }, 403);
  try {
    await initialize(env.DB);
    const identity = await authenticateVoter(request, verifier);
    if (request.method === "DELETE") {
      await env.DB.batch([
        env.DB
          .prepare("DELETE FROM player_ratings WHERE voter_uid = ?")
          .bind(identity.uid),
        env.DB
          .prepare("DELETE FROM vote_ballots WHERE voter_uid = ?")
          .bind(identity.uid),
        env.DB
          .prepare("DELETE FROM pool_predictions WHERE voter_uid = ?")
          .bind(identity.uid),
        env.DB
          .prepare("DELETE FROM pool_players WHERE voter_uid = ?")
          .bind(identity.uid),
        env.DB
          .prepare("DELETE FROM voter_profiles WHERE uid = ?")
          .bind(identity.uid),
      ]);
      return response({ deleted: true });
    }
    await saveVoterProfile(env.DB, identity);
    if (request.method === "PUT") {
      const body = await request.json();
      if (!validNickname(body.nickname))
        return response(
          {
            error:
              "Use um apelido de 3 a 24 caracteres, com letras, números, espaço, ponto, hífen ou sublinhado",
          },
          400,
        );
      await env.DB.batch([
        env.DB
          .prepare(
            "UPDATE voter_profiles SET nickname = ?, updated_at = CURRENT_TIMESTAMP WHERE uid = ?",
          )
          .bind(body.nickname.trim(), identity.uid),
      ]);
    } else if (request.method !== "GET") {
      return response({ error: "Método não permitido" }, 405);
    }
    const profile = await env.DB
      .prepare(
        "SELECT display_name AS name, email, nickname FROM voter_profiles WHERE uid = ?",
      )
      .bind(identity.uid)
      .first();
    return response({ profile });
  } catch (error) {
    const message = String(error?.message || error);
    if (/Google|Firebase|credencial|Entre com|Identidade/i.test(message))
      return response({ error: message }, 401);
    console.error("Falha no perfil", error);
    return response({ error: "Não foi possível processar o perfil" }, 500);
  }
}
