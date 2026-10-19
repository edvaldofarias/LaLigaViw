import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { userResponse } from "../server/users.mjs";

function database() {
  const sql = new DatabaseSync(":memory:");
  const statement = (text, args = []) => ({
    text,
    args,
    bind(...values) {
      return statement(text, values);
    },
    async all() {
      return { results: sql.prepare(text).all(...args) };
    },
    async first() {
      return sql.prepare(text).get(...args);
    },
  });
  return {
    prepare: statement,
    async batch(statements) {
      sql.exec("BEGIN");
      try {
        const results = statements.map((item) => ({
          results: sql.prepare(item.text).all(...item.args),
        }));
        sql.exec("COMMIT");
        return results;
      } catch (error) {
        sql.exec("ROLLBACK");
        throw error;
      }
    },
  };
}

const verifier = async (token) => ({
  uid: token,
  email: `${token}@example.com`,
  name: `User ${token}`,
});
const request = (token, method = "GET", body) =>
  new Request("https://example.com/api/user/profile", {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Origin: "https://example.com",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

test("manages the public nickname in the private Google profile", async () => {
  const env = { DB: database() };
  const created = await userResponse(request("person-1"), env, verifier);
  assert.deepEqual(await created.json(), {
    profile: {
      name: "User person-1",
      email: "person-1@example.com",
      nickname: null,
    },
  });
  const updated = await userResponse(
    request("person-1", "PUT", { nickname: "Camisa 10" }),
    env,
    verifier,
  );
  assert.deepEqual((await updated.json()).profile, {
    name: "User person-1",
    email: "person-1@example.com",
    nickname: "Camisa 10",
  });
  const duplicate = await userResponse(
    request("person-2", "PUT", { nickname: "camisa 10" }),
    env,
    verifier,
  );
  assert.equal(duplicate.status, 409);
});

test("deletes every application record owned by the user", async () => {
  const env = { DB: database() };
  await userResponse(
    request("person-1", "PUT", { nickname: "Artilheiro" }),
    env,
    verifier,
  );
  await env.DB.batch([
    env.DB
      .prepare(
        "INSERT INTO vote_ballots (voter_uid, match_id, kind) VALUES (?, ?, ?)",
      )
      .bind("person-1", "match-1", "favorite"),
    env.DB
      .prepare(
        "INSERT INTO player_ratings (voter_uid, match_id, player_id, rating) VALUES (?, ?, ?, ?)",
      )
      .bind("person-1", "match-1", "player-1", 8),
    env.DB
      .prepare("INSERT INTO pool_players (voter_uid) VALUES (?)")
      .bind("person-1"),
    env.DB
      .prepare(
        "INSERT INTO pool_predictions (voter_uid, round_id, match_id, home_score, away_score) VALUES (?, ?, ?, ?, ?)",
      )
      .bind("person-1", "round-1", "match-1", 2, 1),
  ]);
  const deleted = await userResponse(
    request("person-1", "DELETE"),
    env,
    verifier,
  );
  assert.deepEqual(await deleted.json(), { deleted: true });
  for (const [table, column] of [
    ["voter_profiles", "uid"],
    ["vote_ballots", "voter_uid"],
    ["player_ratings", "voter_uid"],
    ["pool_players", "voter_uid"],
    ["pool_predictions", "voter_uid"],
  ]) {
    const row = await env.DB
      .prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = ?`)
      .bind("person-1")
      .first();
    assert.equal(row.count, 0);
  }
});
