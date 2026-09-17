// Goleiros e camisas 1 informados pela organização. IDs evitam confundir homônimos.
export const goalkeepers=[
  {playerId:'1789172492805',teamId:'-OuCE2n4ni8czw1OPXtQ',name:'Felipe'},
  {playerId:'1789194015748',teamId:'-OuCEUdiPg-VFiAmxP-W',name:'Panosso'},
  {playerId:'1789196204246',teamId:'-OuCECnOQDCHySBDLAxx',name:'Cauan'},
  {playerId:'1789220310276',teamId:'-OuCE8ygQVY-3BXzP80H',name:'Jorge'},
  {playerId:'1789194951922',teamId:'-OuCEAFLB6cDtcv8W1dI',name:'Gusthavo'},
  {playerId:'1789193322187',teamId:'-OuCE1lbs7UFbj9mOJgT',name:'Gustavo'},
  {playerId:'1789199512178',teamId:'-OuCEBQOxXueVsu4_Pbt',name:'Corotinho'},
  {playerId:'1789220893017',teamId:'-OuCE5UUPYmEL7Mnf4-D',name:'Will'},
  {playerId:'1789199087770',teamId:'-OuCE3jNN_OU-QexjdHw',name:'Diego Costa'},
  {playerId:'1789196734409',teamId:'-OuCE79e187h1srqNCAK',name:'Mineiro'},
  {playerId:'1789257856480',teamId:'-OuCEIPXbahnsYG98j_K',name:'Felipe Hermínio'},
  {playerId:'1789257941190',teamId:'-OuCEPqc-2Ju1pdvU4j1',name:'Kaique'},
];
export const isGoalkeeper=(playerId,teamId)=>goalkeepers.some(p=>p.playerId===playerId&&p.teamId===teamId);
