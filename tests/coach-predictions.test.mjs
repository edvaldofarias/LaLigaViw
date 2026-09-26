import test from 'node:test';import assert from 'node:assert/strict';
import {predictMatchCoaches} from '../dist/coach-predictions.mjs';
import {coachStatistics} from '../dist/coaches.mjs';
const old=(team1,team2,title)=>({fs:'phase',m_set:'r1',d_i:100,st:3,team1,team2,title,dt:{qt_g1:1,qt_g2:0}});
const next={id:'next',fs:'phase',m_set:'r2',d_i:300,st:0,team1:'a',team2:'b',title:'Q2'};
const data={matchs:{one:old('a','b','Quadra 1'),next,later:{...next,id:'later',m_set:'r3',d_i:500}}};
const assignments=[{matchId:'one',teamId:'a',coachId:'enio'},{matchId:'one',teamId:'b',coachId:'renan'}];
test('predicts from team history and the opposite court only for the next round without changing statistics',()=>{
 const before=JSON.stringify(data),stats=coachStatistics(data,assignments);
 assert.deepEqual(predictMatchCoaches(next,data,assignments,200).sides.map(s=>s.coach?.id),['enio','renan']);
 assert.equal(predictMatchCoaches({...data.matchs.one,id:'one'},data,assignments,200),null);
 assert.equal(predictMatchCoaches(data.matchs.later,data,assignments,200),null);
 assert.equal(JSON.stringify(data),before);assert.deepEqual(coachStatistics(data,assignments),stats);
 const same={...next,title:'Q1'};assert.ok(predictMatchCoaches(same,{matchs:{...data.matchs,next:same}},assignments,200).sides.every(s=>!s.coach));
});
test('a coach who has trained both sides must choose, and confirmation resolves the conflict',()=>{
 const rows=[...assignments,{matchId:'one',teamId:'b',coachId:'enio'}];
 const prediction=predictMatchCoaches(next,data,rows,200);
 assert.deepEqual(prediction.shared.map(c=>c.id),['enio']);assert.ok(prediction.sides.every(s=>!s.coach));
 rows.push({matchId:'next',teamId:'a',coachId:'enio'});
 const confirmed=predictMatchCoaches(next,data,rows,200);
 assert.equal(confirmed.sides[0].confirmed.id,'enio');assert.equal(confirmed.sides[1].coach.id,'renan');
});
test('missing previous-round assignments, unknown courts and unfinished prior rounds remain undecided',()=>{
 for(const changes of [{title:''},{st:0}]){
  const d={matchs:{...data.matchs,one:{...data.matchs.one,...changes}}};
  assert.ok(predictMatchCoaches(next,d,assignments,200).sides.every(s=>!s.coach));
 }
 const d={matchs:{...data.matchs,gap:{...old('c','d','Q2'),m_set:'gap',d_i:150}}};
 assert.ok(predictMatchCoaches(next,d,assignments,200).sides.every(s=>!s.coach));
});

test('the remaining court coach takes a team without history only when the opponent is resolved',()=>{
 const fixture={...next,team1:'new-team'};
 const d={matchs:{...data.matchs,next:fixture}};
 assert.deepEqual(predictMatchCoaches(fixture,d,assignments,200).sides.map(s=>s.coach?.id),['enio','renan']);
 const reversed={...fixture,team1:'b',team2:'new-team'};
 assert.deepEqual(predictMatchCoaches(reversed,{matchs:{...d.matchs,next:reversed}},assignments,200).sides.map(s=>s.coach?.id),['renan','enio']);
 const neither={...fixture,team2:'another-new-team'};
 assert.ok(predictMatchCoaches(neither,{matchs:{...d.matchs,next:neither}},assignments,200).sides.every(s=>!s.coach));
 const ambiguous=[...assignments,{matchId:'one',teamId:'a',coachId:'guto'}];
 const prediction=predictMatchCoaches(fixture,d,ambiguous,200);
 assert.equal(prediction.sides[0].coach,null);assert.equal(prediction.sides[1].coach.id,'renan');
 assert.equal(predictMatchCoaches(fixture,d,assignments.slice(1),200).sides[0].coach,null);
});
