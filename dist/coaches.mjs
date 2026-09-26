// Historical assignments supplied by the organizer. Append new match/team rows;
// a coach working for another team next week must not rewrite past matches.
export const coaches=[
  {id:'patrick',name:'Patrick',photo:null},
  {id:'enio',name:'Ênio',photo:null},
  {id:'renan',name:'Renan',photo:null},
  {id:'guto',name:'Guto',photo:null},
];
export const coachAssignments=[
  {matchId:'1780480362137',teamId:'-OuCE1lbs7UFbj9mOJgT',coachId:'patrick'},
  {matchId:'1780480362137',teamId:'-OuCE2n4ni8czw1OPXtQ',coachId:'enio'},
  {matchId:'1786231624057',teamId:'-OuCEUdiPg-VFiAmxP-W',coachId:'guto'},
  {matchId:'1786231624057',teamId:'-OuCEAFLB6cDtcv8W1dI',coachId:'renan'},
  {matchId:'1786231624682',teamId:'-OuCE79e187h1srqNCAK',coachId:'enio'},
  {matchId:'1786231624682',teamId:'-OuCECnOQDCHySBDLAxx',coachId:'patrick'},
  {matchId:'1786231625365',teamId:'-OuCEBQOxXueVsu4_Pbt',coachId:'guto'},
  {matchId:'1786231625365',teamId:'-OuCE5UUPYmEL7Mnf4-D',coachId:'renan'},
  {matchId:'1786231626282',teamId:'-OuCE3jNN_OU-QexjdHw',coachId:'enio'},
  {matchId:'1786231626282',teamId:'-OuCE8ygQVY-3BXzP80H',coachId:'patrick'},
  {matchId:'1786231942016',teamId:'-OuCE2n4ni8czw1OPXtQ',coachId:'enio'},
  {matchId:'1786231940049',teamId:'-OuCEBQOxXueVsu4_Pbt',coachId:'enio'},
  {matchId:'1786231940049',teamId:'-OuCEAFLB6cDtcv8W1dI',coachId:'patrick'},
  {matchId:'1786231942016',teamId:'-OuCEUdiPg-VFiAmxP-W',coachId:'patrick'},
  {matchId:'1780480363729',teamId:'-OuCEIPXbahnsYG98j_K',coachId:'guto'},
  {matchId:'1786231940683',teamId:'-OuCE79e187h1srqNCAK',coachId:'guto'},
  {matchId:'1786231941308',teamId:'-OuCECnOQDCHySBDLAxx',coachId:'guto'},
  {matchId:'1780480363729',teamId:'-OuCEPqc-2Ju1pdvU4j1',coachId:'renan'},
  {matchId:'1786231940683',teamId:'-OuCE5UUPYmEL7Mnf4-D',coachId:'renan'},
  {matchId:'1786231941308',teamId:'-OuCE1lbs7UFbj9mOJgT',coachId:'renan'},
  {matchId:'1786235077995',teamId:'-OuCE2n4ni8czw1OPXtQ',coachId:'renan'},
  {matchId:'1786235079970',teamId:'-OuCE1lbs7UFbj9mOJgT',coachId:'renan'},
  {matchId:'1786235077995',teamId:'-OuCECnOQDCHySBDLAxx',coachId:'guto'},
  {matchId:'1786235079970',teamId:'-OuCE8ygQVY-3BXzP80H',coachId:'guto'},
  {matchId:'1786235078628',teamId:'-OuCEPqc-2Ju1pdvU4j1',coachId:'patrick'},
  {matchId:'1780480364862',teamId:'-OuCEUdiPg-VFiAmxP-W',coachId:'patrick'},
  {matchId:'1786235079278',teamId:'-OuCEAFLB6cDtcv8W1dI',coachId:'patrick'},
  {matchId:'1786235078628',teamId:'-OuCE3jNN_OU-QexjdHw',coachId:'enio'},
  {matchId:'1780480364862',teamId:'-OuCE79e187h1srqNCAK',coachId:'enio'},
  {matchId:'1786235079278',teamId:'-OuCEIPXbahnsYG98j_K',coachId:'enio'},
];
export function coachFor(matchId,teamId,assignments=coachAssignments){return coaches.find(c=>c.id===assignments.slice().reverse().find(a=>a.matchId===matchId&&a.teamId===teamId)?.coachId)||null;}
export function coachStatistics(data,assignments=coachAssignments){
  const unique=[...new Map(assignments.map(a=>[`${a.matchId}:${a.teamId}`,a])).values()];
  return coaches.map(coach=>{
    const games=[];let wins=0,draws=0,losses=0,gf=0,ga=0,cleanSheets=0;
    for(const a of unique.filter(a=>a.coachId===coach.id)){
      const m=data.matchs?.[a.matchId];
      if(!m||!(Number(m.st)===3||m.finished)||![m.team1,m.team2].includes(a.teamId)||![m.dt?.qt_g1,m.dt?.qt_g2].every(n=>Number.isInteger(n)&&n>=0))continue;
      const home=m.team1===a.teamId,f=home?m.dt.qt_g1:m.dt.qt_g2,g=home?m.dt.qt_g2:m.dt.qt_g1;
      const result=f>g?'V':f===g?'E':'D';if(result==='V')wins++;else if(result==='E')draws++;else losses++;
      gf+=f;ga+=g;if(!g)cleanSheets++;
      games.push({...a,opponentId:home?m.team2:m.team1,gf:f,ga:g,result,date:m.d_i});
    }
    games.sort((a,b)=>(b.date||0)-(a.date||0));
    const points=wins*3+draws;
    return {...coach,games,played:games.length,wins,draws,losses,gf,ga,gd:gf-ga,cleanSheets,points,percent:games.length?Math.round(points/(games.length*3)*100):0};
  });
}
