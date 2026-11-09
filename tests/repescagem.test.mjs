import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FIRST_PHASE,
  REPESCAGEM_PHASE,
  firstPhaseSeeding,
  repescagemSeeds,
  defineRepescagem,
  drawAdvantage,
} from '../dist/repescagem.mjs';
import { normalizeCompetition } from '../dist/match-data.mjs';
import { buildForecast } from '../dist/forecast.mjs';

const now = Date.parse('2026-11-09T12:00:00Z');
const ids = Array.from({ length: 12 }, (_, i) => `t${i + 1}`);

function fixture() {
  const teams = Object.fromEntries(
    ids.map((id, i) => [id, { name: `Time ${i + 1}`, dt: { [FIRST_PHASE]: { col: i } } }]),
  );
  const matchs = {};
  // Primeira Fase completa: seis jogos encerrados na mesma rodada.
  for (let i = 0; i < 6; i++) {
    matchs[`f${i}`] = {
      fs: FIRST_PHASE, m_set: 'r1', d_i: now - 86400000, finished: now - 86000000, st: 3,
      team1: ids[i * 2], team2: ids[i * 2 + 1], dt: { qt_g1: 3, qt_g2: 1 },
    };
  }
  const titles = ['5° x 12° (Q1)', '6° x 11° (Q1)', '7º x 10° (Q2)', '8º x 9º (Q2)'];
  titles.forEach((title, i) => {
    matchs[`rep${i}`] = { fs: REPESCAGEM_PHASE, m_set: 'rep', d_i: now + 86400000 + i * 3600000, title };
  });
  return { teams, matchs };
}

test('os títulos dos confrontos revelam os seeds', () => {
  assert.deepEqual(repescagemSeeds('5° x 12° (Q1)'), [5, 12]);
  assert.deepEqual(repescagemSeeds('7º x 10° (Q2)'), [7, 10]);
  assert.equal(repescagemSeeds(''), null);
  assert.equal(repescagemSeeds(undefined), null);
});

test('a classificação final da Primeira Fase segue a colocação oficial', () => {
  const seeding = firstPhaseSeeding(fixture());
  assert.deepEqual(seeding.map(row => row.id), ids);
});

test('confrontos pendentes recebem as equipes pela classificação final', () => {
  const matchs = defineRepescagem(fixture());
  assert.deepEqual([matchs.rep0.team1, matchs.rep0.team2], ['t5', 't12']);
  assert.deepEqual([matchs.rep1.team1, matchs.rep1.team2], ['t6', 't11']);
  assert.deepEqual([matchs.rep2.team1, matchs.rep2.team2], ['t7', 't10']);
  assert.deepEqual([matchs.rep3.team1, matchs.rep3.team2], ['t8', 't9']);
});

test('nunca substitui lados definidos oficialmente nem completa fase em andamento', () => {
  const data = fixture();
  data.matchs.rep0 = { ...data.matchs.rep0, team1: 'oficial1', team2: 'oficial2' };
  const matchs = defineRepescagem(data);
  assert.deepEqual([matchs.rep0.team1, matchs.rep0.team2], ['oficial1', 'oficial2']);
  assert.equal(matchs.rep1.team1, 't6');

  const open = fixture();
  delete open.matchs.f0.finished;
  open.matchs.f0.st = 1;
  assert.equal(defineRepescagem(open), open.matchs);
});

test('o empate favorece a melhor campanha e a normalização preenche os confrontos', () => {
  const data = normalizeCompetition(fixture());
  const match = data.matchs.rep0;
  assert.equal(match.team1, 't5');
  assert.equal(drawAdvantage(data, match), 'team1');
  assert.equal(drawAdvantage(data, { ...match, team1: 't12', team2: 't5' }), 'team2');
  assert.equal(drawAdvantage(data, data.matchs.f0), null);
});

test('as odds de classificação somam o empate ao time de melhor campanha', () => {
  const forecast = buildForecast(normalizeCompetition(fixture()), now);
  assert.equal(forecast.predictions.length, 4);
  for (const p of forecast.predictions) {
    assert.equal(p.status, 'ready');
    assert.equal(p.knockout.drawAdvantage, 'team1');
    const [home, draw, away] = p.probabilities;
    assert.ok(Math.abs(p.knockout.probabilities[0] - (home + draw)) < 1e-12);
    assert.ok(Math.abs(p.knockout.probabilities[1] - away) < 1e-12);
    assert.ok(Math.abs(p.knockout.probabilities.reduce((a, b) => a + b, 0) - 1) < 1e-12);
    p.knockout.odds.forEach((odd, i) => assert.equal(odd, 1 / p.knockout.probabilities[i]));
  }
});
