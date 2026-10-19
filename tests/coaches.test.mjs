import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {coachAssignments,coachFor,coachStatistics} from '../dist/coaches.mjs';
const data=JSON.parse(readFileSync(new URL('./fixtures/round-1.json',import.meta.url),'utf8'));
test('first-round coaches count the exact teams commanded and preserve goals',()=>{
 const stats=coachStatistics(data);
 assert.deepEqual(stats.map(c=>[c.id,c.played,c.wins,c.draws,c.losses,c.gf,c.ga,c.points]),[
 ['patrick',3,0,2,1,10,11,2],['enio',3,1,2,0,11,10,5],['renan',2,2,0,0,7,1,6],['guto',2,0,0,2,1,7,0],['joao',0,0,0,0,0,0,0]]);
 for(const a of coachAssignments.filter(a=>data.matchs[a.matchId]))assert.ok([data.matchs[a.matchId].team1,data.matchs[a.matchId].team2].includes(a.teamId));
});
test('new assignments do not leak into past games or count scheduled and missing-score games',()=>{
 const original=coachAssignments[0],m=data.matchs[original.matchId];
 const more=[...coachAssignments,original,{...original,matchId:'future',coachId:'guto'},{...original,matchId:'missing'}];
 const d={...data,matchs:{...data.matchs,future:{...m,st:0,finished:false},missing:{...m,dt:{}}}};
 assert.deepEqual(coachStatistics(d,more).map(c=>c.played),[3,3,2,2,0]);
 assert.equal(coachFor(original.matchId,original.teamId,more).name,'Patrick');
 assert.equal(coachFor('not-assigned',original.teamId),null);
});
test('fifth-round assignments match the organizer list',()=>{
 const fifthRound={
   '-OuCEPqc-2Ju1pdvU4j1':'patrick',
   '-OuCE3jNN_OU-QexjdHw':'patrick',
   '-OuCE79e187h1srqNCAK':'enio',
   '-OuCEIPXbahnsYG98j_K':'enio',
   '-OuCE8ygQVY-3BXzP80H':'guto',
   '-OuCEUdiPg-VFiAmxP-W':'guto',
   '-OuCEBQOxXueVsu4_Pbt':'guto',
   '-OuCEAFLB6cDtcv8W1dI':'renan',
   '-OuCE5UUPYmEL7Mnf4-D':'renan',
   '-OuCECnOQDCHySBDLAxx':'renan',
 };
 const matchIds=new Set(['1780480367054','1786246792371','1786246792897','1786246793447','1786246794080']);
 const assignments=coachAssignments.filter(a=>matchIds.has(a.matchId));
 assert.equal(assignments.length,10);
 assert.deepEqual(Object.fromEntries(assignments.map(a=>[a.teamId,a.coachId])),fifthRound);
});
