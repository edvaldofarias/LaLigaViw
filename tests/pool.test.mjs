import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { poolResponse } from "../server/pool.mjs";
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
const environment = () => ({
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

async function setNickname(env, token, nickname) {
  const result = await userResponse(
    new Request("https://example.com/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: "https://example.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname }),
    }),
    env,
    verifier,
  );
  assert.equal(result.status, 200);
}

test("saves editable next-round predictions and ranks exact scores", async () => {
  const env = environment();
  const matches = [
    {
      id: "match-1",
      m_set: "round-1",
      d_i: 2_000,
      st: 0,
      dt: {},
    },
    {
      id: "match-2",
      m_set: "round-1",
      d_i: 2_100,
      st: 0,
      dt: {},
    },
  ];
  const load = async () => matches;
  await setNickname(env, "person-1", "Craque");
  const save = await poolResponse(
    request("/api/pool/entry", "person-1", {
      roundId: "round-1",
      predictions: [
        { matchId: "match-1", homeScore: 2, awayScore: 1 },
        { matchId: "match-2", homeScore: 1, awayScore: 1 },
      ],
    }),
    env,
    verifier,
    load,
    1_000,
  );
  assert.equal(save.status, 200);

  const edit = await poolResponse(
    request("/api/pool/entry", "person-1", {
      roundId: "round-1",
      predictions: [{ matchId: "match-1", homeScore: 3, awayScore: 1 }],
    }),
    env,
    verifier,
    load,
    1_500,
  );
  assert.equal(edit.status, 200);
  const entry = await poolResponse(
    request("/api/pool/entry?roundId=round-1", "person-1"),
    env,
    verifier,
    load,
    1_500,
  );
  assert.deepEqual((await entry.json()).predictions, [
    { matchId: "match-1", homeScore: 3, awayScore: 1 },
    { matchId: "match-2", homeScore: 1, awayScore: 1 },
  ]);

  matches[0].st = 3;
  matches[0].dt = { qt_g1: 3, qt_g2: 1 };
  matches[1].st = 3;
  matches[1].dt = { qt_g1: 2, qt_g2: 2 };
  const ranking = await poolResponse(
    request("/api/pool/ranking"),
    env,
    verifier,
    load,
    3_000,
  );
  assert.deepEqual((await ranking.json()).ranking, [
    {
      position: 1,
      nickname: "Craque",
      points: 7,
      exact: 1,
      hits: 2,
      predictions: 2,
    },
  ]);
});

test("locks the round and protects unique public nicknames", async () => {
  const env = environment();
  const matches = [
    { id: "match-1", m_set: "round-1", d_i: 2_000, st: 0, dt: {} },
  ];
  const load = async () => matches;
  await setNickname(env, "person-1", "Camisa 10");
  const ballot = {
    roundId: "round-1",
    predictions: [{ matchId: "match-1", homeScore: 1, awayScore: 0 }],
  };
  assert.equal(
    (
      await poolResponse(
        request("/api/pool/entry", "person-1", ballot),
        env,
        verifier,
        load,
        1_000,
      )
    ).status,
    200,
  );
  const duplicateNickname = await userResponse(
    new Request("https://example.com/api/user/profile", {
      method: "PUT",
      headers: {
        Authorization: "Bearer person-2",
        Origin: "https://example.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: "Camisa 10" }),
    }),
    env,
    verifier,
  );
  assert.equal(duplicateNickname.status, 409);
  assert.equal(
    (
      await poolResponse(
        request("/api/pool/entry", "person-1", ballot),
        env,
        verifier,
        load,
        2_000,
      )
    ).status,
    400,
  );
});
