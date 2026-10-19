import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { votesResponse } from "../server/votes.mjs";

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
const env = () => ({
  DB: database(),
});
const request = (path, token = "person-1", body) =>
  new Request(`https://example.com${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Origin: "https://example.com",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
const finishedMatch = async () => ({
  st: 3,
  dt: { qt_g1: 2, qt_g2: 1 },
});
const drawnMatch = async () => ({
  st: 3,
  dt: { qt_g1: 1, qt_g2: 1 },
});
const scheduledMatch = async () => ({ st: 0 });
const ballot = {
  team1BestPlayerId: "player-a",
  team1WorstPlayerId: "player-b",
  team2BestPlayerId: "player-c",
  team2WorstPlayerId: "player-d",
};

test("keeps one locked post-match vote and reveals results only after voting", async () => {
  const environment = env();
  const path = "/api/votes/match-1?kind=evaluation";
  const first = await votesResponse(
    request(path, "person-1", ballot),
    environment,
    verifier,
    finishedMatch,
  );
  assert.equal(first.status, 201);
  assert.equal((await first.json()).total, 1);

  const duplicate = await votesResponse(
    request(path, "person-1", ballot),
    environment,
    verifier,
    finishedMatch,
  );
  assert.equal(duplicate.status, 409);

  const outsider = await votesResponse(
    request(path, "person-2"),
    environment,
    verifier,
    finishedMatch,
  );
  assert.equal(outsider.status, 403);

  const voter = await votesResponse(
    request(path, "person-1"),
    environment,
    verifier,
    finishedMatch,
  );
  assert.equal(voter.status, 200);
  assert.equal((await voter.json()).total, 1);

  const status = await votesResponse(
    request("/api/votes/status", "person-1"),
    environment,
    verifier,
  );
  assert.deepEqual(await status.json(), {
    votes: [{ matchId: "match-1", ...ballot }],
  });
});

test("awards points according to winning and losing teams", async () => {
  const environment = env();
  const path = "/api/votes/match-2?kind=evaluation";
  const first = await votesResponse(
    request(path, "person-1", ballot),
    environment,
    verifier,
    finishedMatch,
  );
  assert.equal(first.status, 201);
  const second = await votesResponse(
    request(path, "person-2", {
      team1BestPlayerId: "player-a",
      team1WorstPlayerId: "player-b",
      team2BestPlayerId: "player-d",
      team2WorstPlayerId: "player-c",
    }),
    environment,
    verifier,
    finishedMatch,
  );
  assert.equal(second.status, 201);
  const result = await second.json();
  assert.equal(result.total, 2);
  assert.deepEqual(
    Object.fromEntries(result.playerPoints.map((item) => [item.id, item.points])),
    { "player-a": 20, "player-b": 8, "player-c": 7, "player-d": 7 },
  );
});

test("uses intermediate highlight points for a draw", async () => {
  const result = await votesResponse(
    request("/api/votes/drawn-match?kind=evaluation", "person-1", ballot),
    env(),
    verifier,
    drawnMatch,
  );
  assert.equal(result.status, 201);
  assert.deepEqual(
    Object.fromEntries(
      (await result.json()).playerPoints.map((item) => [item.id, item.points]),
    ),
    { "player-a": 8, "player-c": 8, "player-b": 2, "player-d": 2 },
  );
});

test("requires server configuration and rejects invalid ballots", async () => {
  const config = await votesResponse(request("/api/votes/config"), {}, verifier);
  assert.equal(config.status, 200);
  assert.equal((await config.json()).firebaseConfig.projectId, "laligaviw");

  const missing = await votesResponse(
    request("/api/votes/match-3?kind=favorite"),
    {},
    verifier,
  );
  assert.equal(missing.status, 503);

  const invalid = await votesResponse(
    request("/api/votes/match-3?kind=evaluation", "person-1", {
      team1BestPlayerId: "same-player",
      team1WorstPlayerId: "same-player",
      team2BestPlayerId: "player-c",
      team2WorstPlayerId: "player-d",
    }),
    env(),
    verifier,
    finishedMatch,
  );
  assert.equal(invalid.status, 400);

  const early = await votesResponse(
    request(
      "/api/votes/match-3?kind=evaluation",
      "person-1",
      ballot,
    ),
    env(),
    verifier,
    scheduledMatch,
  );
  assert.equal(early.status, 409);
});

test("stores verified identity for administrators without exposing it publicly", async () => {
  const environment = env();
  const result = await votesResponse(
    request("/api/votes/match-4?kind=evaluation", "person-4", ballot),
    environment,
    verifier,
    finishedMatch,
  );
  assert.equal(result.status, 201);
  const profile = await environment.DB
    .prepare(
      "SELECT uid, email, display_name AS displayName FROM voter_profiles WHERE uid = ?",
    )
    .bind("person-4")
    .first();
  assert.deepEqual({ ...profile }, {
    uid: "person-4",
    email: "person-4@example.com",
    displayName: "User person-4",
  });
  assert.equal(JSON.stringify(await result.json()).includes("person-4"), false);
});
