import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {coachAssignments,coachFor,coachStatistics} from '../dist/coaches.mjs';
const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8'));
test('first-round coaches count the exact teams commanded and preserve goals',()=>{
 const stats=coachStatistics(data);
 assert.deepEqual(stats.map(c=>[c.id,c.played,c.wins,c.draws,c.losses,c.gf,c.ga,c.points]),[
 ['patrick',3,0,2,1,10,11,2],['enio',3,1,2,0,11,10,5],['renan',2,2,0,0,7,1,6],['guto',2,0,0,2,1,7,0]]);
 for(const a of coachAssignments)assert.ok([data.matchs[a.matchId].team1,data.matchs[a.matchId].team2].includes(a.teamId));
});
test('new assignments do not leak into past games or count scheduled and missing-score games',()=>{
 const original=coachAssignments[0],m=data.matchs[original.matchId];
 const more=[...coachAssignments,original,{...original,matchId:'future',coachId:'guto'},{...original,matchId:'missing'}];
 const d={...data,matchs:{...data.matchs,future:{...m,st:0,finished:false},missing:{...m,dt:{}}}};
 assert.deepEqual(coachStatistics(d,more).map(c=>c.played),[3,3,2,2]);
 assert.equal(coachFor(original.matchId,original.teamId,more).name,'Patrick');
 assert.equal(coachFor('not-assigned',original.teamId),null);
});
