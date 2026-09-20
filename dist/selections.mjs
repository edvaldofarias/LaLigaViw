// Curated selections supplied by the competition organizer, independently of
// Copa Fácil refreshes. Append future rounds; retain IDs and historical names.
export const championshipSelections = [
  {
    id:'2026-round-1', season:2026, roundNumber:1,
    poster:'images/selections/2026-round-1.png',
    phaseId:'1780479913323', roundId:'1780480342602',
    source:'Seleção informada pela organização',
    players:[
      {playerId:'1789194951922',name:'Gusthavo',teamId:'-OuCEAFLB6cDtcv8W1dI',teamName:'Real Bétis'},
      {playerId:'1789172821599',name:'Edvaldo',teamId:'-OuCE2n4ni8czw1OPXtQ',teamName:'Barcelona'},
      {playerId:'1789220926671',name:'Jonas',teamId:'-OuCE5UUPYmEL7Mnf4-D',teamName:'Sevilla'},
      {playerId:'1789196238332',name:'Raffa Marum',teamId:'-OuCECnOQDCHySBDLAxx',teamName:'Getafe'},
      {playerId:'1789220929755',name:'Lucas',teamId:'-OuCE5UUPYmEL7Mnf4-D',teamName:'Sevilla'},
      {playerId:'1789196762979',name:'Ricardinho',teamId:'-OuCE79e187h1srqNCAK',teamName:'Villareal'},
      {playerId:'1789196227773',name:'Jeferson',teamId:'-OuCECnOQDCHySBDLAxx',teamName:'Getafe'},
    ],
  },
  {
    "id": "2026-round-2",
    "season": 2026,
    "roundNumber": 2,
    "poster": "images/selections/2026-round-2.png",
    "phaseId": "1780479913323",
    "roundId": "1780480347872",
    "source": "Seleção informada pela organização",
    "players": [
      {
        "playerId": "1789194951922",
        "name": "Gusthavo",
        "teamId": "-OuCEAFLB6cDtcv8W1dI",
        "teamName": "Real Bétis"
      },
      {
        "playerId": "1789194969408",
        "name": "Presida",
        "teamId": "-OuCEAFLB6cDtcv8W1dI",
        "teamName": "Real Bétis"
      },
      {
        "playerId": "1789257954893",
        "name": "Paschoali",
        "teamId": "-OuCEPqc-2Ju1pdvU4j1",
        "teamName": "Atlético de Madrid"
      },
      {
        "playerId": "1789196216230",
        "name": "Biel",
        "teamId": "-OuCECnOQDCHySBDLAxx",
        "teamName": "Getafe"
      },
      {
        "playerId": "1789193322187",
        "name": "Gustavo",
        "teamId": "-OuCE1lbs7UFbj9mOJgT",
        "teamName": "Real Madrid"
      },
      {
        "playerId": "1789194059686",
        "name": "Renato",
        "teamId": "-OuCEUdiPg-VFiAmxP-W",
        "teamName": "Celta"
      },
      {
        "playerId": "1789196750970",
        "name": "Jhow",
        "teamId": "-OuCE79e187h1srqNCAK",
        "teamName": "Villareal"
      }
    ]
  },
];

export function selectionsForPlayer(playerId, history=championshipSelections){
  return history.filter(round=>round.players.some(p=>p.playerId===playerId));
}
