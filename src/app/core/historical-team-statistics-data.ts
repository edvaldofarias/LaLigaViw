export interface HistoricalScorer { name: string; goals: number; }
export interface HistoricalDisciplineLeader { position: number; name: string; team: string; editionTeamId: number; yellowCards: number; redCards: number; blueCards: number; totalCards: number; }
export interface HistoricalDisciplineEdition { eventKey: string; championship: string; seasonYear: number; leaders: HistoricalDisciplineLeader[]; }
export interface HistoricalScoringLeader { position: number; name: string; team: string; editionTeamId: number; goals: number; }
export interface HistoricalScoringEdition { eventKey: string; championship: string; seasonYear: number; leaders: HistoricalScoringLeader[]; }
export interface HistoricalTeamStatistic {
  ranking: number; eventKey: string; championship: string; seasonYear: number; semester: number; editionTeamId: number; team: string; badgeUrl: string; matches: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; goalDifference: number; points: number; placement: 1 | 2 | 3 | null; ongoing: boolean; duo: HistoricalScorer[]; duoGoals: number; duoRank: number; unbeatenStreak: number; cleanSheets: number; failedToScore: number; biggestWinMargin: number; biggestLossMargin: number; attackRank: number; defenseRank: number; yellowCards: number; redCards: number; blueCards: number; totalCards: number; cardRank: number;
}

export const HISTORICAL_TEAM_STATISTICS: HistoricalTeamStatistic[] = [
  {
    "ranking": 1,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 39,
    "team": "UCRÂNIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2FD01F61AC-B1B3-4E95-9C54-87F241CE59E0-596-0000045176793475.png?alt=media",
    "matches": 9,
    "wins": 8,
    "draws": 0,
    "losses": 1,
    "goalsFor": 26,
    "goalsAgainst": 11,
    "goalDifference": 15,
    "points": 24,
    "placement": 1,
    "ongoing": false,
    "duo": [
      {
        "name": "RODRIGO",
        "goals": 7
      },
      {
        "name": "WILL",
        "goals": 7
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 5,
    "cleanSheets": 2,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 2,
    "yellowCards": 9,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 18,
    "defenseRank": 1,
    "duoRank": 25,
    "cardRank": 17
  },
  {
    "ranking": 2,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 46,
    "team": "BOTAFOGO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2FAAD684DA-E3F6-4BF5-8C91-43AACA44B05F-2544-0000017DB94C824F.png?alt=media",
    "matches": 9,
    "wins": 7,
    "draws": 2,
    "losses": 0,
    "goalsFor": 39,
    "goalsAgainst": 17,
    "goalDifference": 22,
    "points": 23,
    "placement": 1,
    "ongoing": false,
    "duo": [
      {
        "name": "MEIRELLES",
        "goals": 10
      },
      {
        "name": "RODRIGUINHO",
        "goals": 10
      }
    ],
    "duoGoals": 20,
    "unbeatenStreak": 9,
    "cleanSheets": 2,
    "failedToScore": 0,
    "biggestWinMargin": 7,
    "biggestLossMargin": 0,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 1,
    "defenseRank": 17,
    "duoRank": 2,
    "cardRank": 46
  },
  {
    "ranking": 3,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 60,
    "team": "LAZIO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKhSFAYQDex21kYbU.png?alt=media&token=1&m=1751863823029",
    "matches": 9,
    "wins": 7,
    "draws": 2,
    "losses": 0,
    "goalsFor": 31,
    "goalsAgainst": 15,
    "goalDifference": 16,
    "points": 23,
    "placement": 1,
    "ongoing": false,
    "duo": [
      {
        "name": "RAFINHA",
        "goals": 9
      },
      {
        "name": "GENTIL",
        "goals": 5
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 9,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 5,
    "biggestLossMargin": 0,
    "yellowCards": 4,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 4,
    "attackRank": 5,
    "defenseRank": 10,
    "duoRank": 18,
    "cardRank": 63
  },
  {
    "ranking": 4,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 21,
    "team": "Arsenal",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2FC536A316-7926-460D-AC9F-30F0538B4E7B-7719-00000572C0419A60.png?alt=media",
    "matches": 9,
    "wins": 7,
    "draws": 2,
    "losses": 0,
    "goalsFor": 24,
    "goalsAgainst": 15,
    "goalDifference": 9,
    "points": 23,
    "placement": 2,
    "ongoing": false,
    "duo": [
      {
        "name": "ROBERTINHO",
        "goals": 14
      },
      {
        "name": "IVAN",
        "goals": 3
      }
    ],
    "duoGoals": 17,
    "unbeatenStreak": 9,
    "cleanSheets": 2,
    "failedToScore": 1,
    "biggestWinMargin": 3,
    "biggestLossMargin": 0,
    "yellowCards": 13,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 13,
    "attackRank": 23,
    "defenseRank": 8,
    "duoRank": 6,
    "cardRank": 3
  },
  {
    "ranking": 5,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 58,
    "team": "INTER DE MILÃO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKadg1NW5IlAeTEHG.jpg?alt=media&token=1&m=1751864039394",
    "matches": 9,
    "wins": 7,
    "draws": 0,
    "losses": 2,
    "goalsFor": 25,
    "goalsAgainst": 12,
    "goalDifference": 13,
    "points": 21,
    "placement": 2,
    "ongoing": false,
    "duo": [
      {
        "name": "RENATO",
        "goals": 7
      },
      {
        "name": "THIAGO PESCADOS",
        "goals": 6
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 6,
    "cleanSheets": 3,
    "failedToScore": 1,
    "biggestWinMargin": 4,
    "biggestLossMargin": 5,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 19,
    "defenseRank": 2,
    "duoRank": 34,
    "cardRank": 48
  },
  {
    "ranking": 6,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 18,
    "team": "FLAMENGO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2FB55D910B-3D4F-42EF-9A5B-70DBAD1B2AAA-7832-000004BC186AB80C.png?alt=media",
    "matches": 8,
    "wins": 6,
    "draws": 2,
    "losses": 0,
    "goalsFor": 30,
    "goalsAgainst": 15,
    "goalDifference": 15,
    "points": 20,
    "placement": 1,
    "ongoing": false,
    "duo": [
      {
        "name": "BRUNO H",
        "goals": 7
      },
      {
        "name": "IGOR",
        "goals": 7
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 8,
    "cleanSheets": 2,
    "failedToScore": 1,
    "biggestWinMargin": 4,
    "biggestLossMargin": 0,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 8,
    "defenseRank": 16,
    "duoRank": 23,
    "cardRank": 80
  },
  {
    "ranking": 7,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 75,
    "team": "JAPÃO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ4-yU1BGCcin6HrSp.png?alt=media&token=1&m=1769058401321",
    "matches": 9,
    "wins": 6,
    "draws": 2,
    "losses": 1,
    "goalsFor": 28,
    "goalsAgainst": 15,
    "goalDifference": 13,
    "points": 20,
    "placement": 1,
    "ongoing": false,
    "duo": [
      {
        "name": "PIMENTA",
        "goals": 10
      },
      {
        "name": "REINALDO",
        "goals": 7
      }
    ],
    "duoGoals": 17,
    "unbeatenStreak": 7,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 1,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 12,
    "defenseRank": 9,
    "duoRank": 8,
    "cardRank": 49
  },
  {
    "ranking": 8,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 31,
    "team": "ALEMANHA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2FB329F2F7-9E43-4602-A913-CA70B29DC977-596-0000045042878520.png?alt=media",
    "matches": 9,
    "wins": 6,
    "draws": 1,
    "losses": 2,
    "goalsFor": 24,
    "goalsAgainst": 15,
    "goalDifference": 9,
    "points": 19,
    "placement": 3,
    "ongoing": false,
    "duo": [
      {
        "name": "FÁBIO Z",
        "goals": 7
      },
      {
        "name": "FÁBIO VITULLO",
        "goals": 6
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 3,
    "cleanSheets": 2,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 3,
    "yellowCards": 10,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 10,
    "attackRank": 22,
    "defenseRank": 7,
    "duoRank": 31,
    "cardRank": 8
  },
  {
    "ranking": 9,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 67,
    "team": "BRASIL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3oQF1j3hrLjida5p.jpg?alt=media&token=1&m=1769058318477",
    "matches": 10,
    "wins": 5,
    "draws": 2,
    "losses": 3,
    "goalsFor": 25,
    "goalsAgainst": 17,
    "goalDifference": 8,
    "points": 17,
    "placement": 2,
    "ongoing": false,
    "duo": [
      {
        "name": "ZIRONDI",
        "goals": 10
      },
      {
        "name": "JORGE",
        "goals": 7
      }
    ],
    "duoGoals": 17,
    "unbeatenStreak": 7,
    "cleanSheets": 2,
    "failedToScore": 0,
    "biggestWinMargin": 6,
    "biggestLossMargin": 2,
    "yellowCards": 3,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 4,
    "attackRank": 20,
    "defenseRank": 11,
    "duoRank": 7,
    "cardRank": 57
  },
  {
    "ranking": 10,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 48,
    "team": "NACIONAL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2FAFE99692-3B10-4859-BFCA-FDA03960F197-2544-0000017DDAAFA647.png?alt=media",
    "matches": 10,
    "wins": 4,
    "draws": 5,
    "losses": 1,
    "goalsFor": 31,
    "goalsAgainst": 24,
    "goalDifference": 7,
    "points": 17,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ALLAN REZENDE",
        "goals": 9
      },
      {
        "name": "MATHEUS OLIVEIRA",
        "goals": 6
      }
    ],
    "duoGoals": 15,
    "unbeatenStreak": 9,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 1,
    "yellowCards": 9,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 7,
    "defenseRank": 33,
    "duoRank": 13,
    "cardRank": 16
  },
  {
    "ranking": 11,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 53,
    "team": "OLÍMPIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2FDEC0688E-136D-4D31-9AF7-AF649C49C45B-6143-0000030958D979FB.png?alt=media",
    "matches": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 31,
    "goalsAgainst": 15,
    "goalDifference": 16,
    "points": 16,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "DAVID PIMENTA",
        "goals": 11
      },
      {
        "name": "ROBERTINHO",
        "goals": 8
      }
    ],
    "duoGoals": 19,
    "unbeatenStreak": 4,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 5,
    "biggestLossMargin": 1,
    "yellowCards": 5,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 6,
    "defenseRank": 26,
    "duoRank": 3,
    "cardRank": 54
  },
  {
    "ranking": 12,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 29,
    "team": "Fulham",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2FC35FE985-8516-40B5-9EFF-4A42D42445AA-794-000002022BD7EE14.png?alt=media",
    "matches": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 26,
    "goalsAgainst": 11,
    "goalDifference": 15,
    "points": 16,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "FELIPE MENEZES",
        "goals": 8
      },
      {
        "name": "ANDRÉ GOMES",
        "goals": 6
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 6,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 7,
    "biggestLossMargin": 3,
    "yellowCards": 6,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 7,
    "attackRank": 17,
    "defenseRank": 5,
    "duoRank": 20,
    "cardRank": 24
  },
  {
    "ranking": 13,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 10,
    "team": "CORITIBA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2FA0981BE5-754E-4885-9610-A650B1C9A9DF-7832-000004BDDE790C8B.png?alt=media",
    "matches": 8,
    "wins": 5,
    "draws": 1,
    "losses": 2,
    "goalsFor": 27,
    "goalsAgainst": 13,
    "goalDifference": 14,
    "points": 16,
    "placement": 2,
    "ongoing": false,
    "duo": [
      {
        "name": "IVAN LOPES",
        "goals": 8
      },
      {
        "name": "FÁBIO ZIRONDI",
        "goals": 5
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 6,
    "cleanSheets": 3,
    "failedToScore": 1,
    "biggestWinMargin": 7,
    "biggestLossMargin": 3,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 13,
    "defenseRank": 6,
    "duoRank": 28,
    "cardRank": 77
  },
  {
    "ranking": 14,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 45,
    "team": "FLAMENGO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2F25C2F922-050B-45A8-88D7-329F6C04C9B5-2544-0000017DA038191E.png?alt=media",
    "matches": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 21,
    "goalsAgainst": 10,
    "goalDifference": 11,
    "points": 16,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "EFRAIM",
        "goals": 9
      },
      {
        "name": "JOÃO PEGO",
        "goals": 4
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 6,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 1,
    "yellowCards": 5,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 36,
    "defenseRank": 3,
    "duoRank": 27,
    "cardRank": 52
  },
  {
    "ranking": 15,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 72,
    "team": "ESPANHÃ",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3vPzZEs0LK9sz0f7.png?alt=media&token=1&m=1769058303217",
    "matches": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 27,
    "goalsAgainst": 17,
    "goalDifference": 10,
    "points": 16,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ALAN",
        "goals": 10
      },
      {
        "name": "JUNINHO",
        "goals": 4
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 6,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 5,
    "biggestLossMargin": 3,
    "yellowCards": 8,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 14,
    "defenseRank": 36,
    "duoRank": 17,
    "cardRank": 11
  },
  {
    "ranking": 16,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 64,
    "team": "BOLOGNA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKwFbfswA0L-x5Le-.png?alt=media&token=1&m=1751863745410",
    "matches": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 23,
    "goalsAgainst": 13,
    "goalDifference": 10,
    "points": 16,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "DENNER",
        "goals": 5
      },
      {
        "name": "VINICIUS CARVALHO",
        "goals": 5
      }
    ],
    "duoGoals": 10,
    "unbeatenStreak": 5,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 5,
    "biggestLossMargin": 3,
    "yellowCards": 9,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 29,
    "defenseRank": 14,
    "duoRank": 52,
    "cardRank": 15
  },
  {
    "ranking": 17,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 66,
    "team": "SASSUOLO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OT2n54hMPtYibHgEKjl.png?alt=media&token=1&m=1751863703120",
    "matches": 7,
    "wins": 5,
    "draws": 1,
    "losses": 1,
    "goalsFor": 20,
    "goalsAgainst": 12,
    "goalDifference": 8,
    "points": 16,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "EFRAIM",
        "goals": 6
      },
      {
        "name": "REINALDO",
        "goals": 5
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 6,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 4,
    "biggestLossMargin": 1,
    "yellowCards": 13,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 14,
    "attackRank": 42,
    "defenseRank": 12,
    "duoRank": 46,
    "cardRank": 2
  },
  {
    "ranking": 18,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 30,
    "team": "Brighton",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2F6A2EC2BC-6766-4867-8980-349E5FFF250F-794-000002023C7A40BF.png?alt=media",
    "matches": 8,
    "wins": 5,
    "draws": 0,
    "losses": 3,
    "goalsFor": 29,
    "goalsAgainst": 24,
    "goalDifference": 5,
    "points": 15,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "RAFINHA",
        "goals": 10
      },
      {
        "name": "ANDREWS",
        "goals": 4
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 3,
    "yellowCards": 6,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 7,
    "attackRank": 10,
    "defenseRank": 57,
    "duoRank": 16,
    "cardRank": 23
  },
  {
    "ranking": 19,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 5,
    "team": "VITÓRIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2FA68E0042-0E1E-4DE8-9CD2-8145DAD17C96-6985-0000031E44A9D87A.png?alt=media",
    "matches": 7,
    "wins": 5,
    "draws": 0,
    "losses": 2,
    "goalsFor": 30,
    "goalsAgainst": 27,
    "goalDifference": 3,
    "points": 15,
    "placement": 3,
    "ongoing": false,
    "duo": [
      {
        "name": "TIAGO BIANCO",
        "goals": 7
      },
      {
        "name": "CAÍQUE",
        "goals": 5
      }
    ],
    "duoGoals": 12,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 4,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 9,
    "defenseRank": 80,
    "duoRank": 36,
    "cardRank": 90
  },
  {
    "ranking": 20,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 28,
    "team": "Wolves",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2F454D7C15-6B29-43BA-ABE5-7A3497AF87A3-7698-0000056FE90DEA7A.png?alt=media",
    "matches": 10,
    "wins": 4,
    "draws": 3,
    "losses": 3,
    "goalsFor": 22,
    "goalsAgainst": 15,
    "goalDifference": 7,
    "points": 15,
    "placement": 1,
    "ongoing": false,
    "duo": [
      {
        "name": "BOLACHA",
        "goals": 8
      },
      {
        "name": "GABRIEL",
        "goals": 6
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 4,
    "cleanSheets": 3,
    "failedToScore": 2,
    "biggestWinMargin": 4,
    "biggestLossMargin": 1,
    "yellowCards": 8,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 33,
    "defenseRank": 4,
    "duoRank": 21,
    "cardRank": 14
  },
  {
    "ranking": 21,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 50,
    "team": "INDEPENDENTE DEL VALLE",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2F8C4D4A74-72D8-49AE-A104-88F40D1B77C1-2544-0000017EDDC25795.png?alt=media",
    "matches": 7,
    "wins": 4,
    "draws": 2,
    "losses": 1,
    "goalsFor": 19,
    "goalsAgainst": 14,
    "goalDifference": 5,
    "points": 14,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "YURICK",
        "goals": 7
      },
      {
        "name": "JOSÉ BRUNO",
        "goals": 6
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 2,
    "yellowCards": 2,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 2,
    "attackRank": 44,
    "defenseRank": 21,
    "duoRank": 33,
    "cardRank": 71
  },
  {
    "ranking": 22,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 13,
    "team": "ATLÉTICO MINEIRO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2FEAEFF210-7B00-4076-8523-DB627AFF2470-7832-000004BD0206FF5C.png?alt=media",
    "matches": 8,
    "wins": 4,
    "draws": 1,
    "losses": 3,
    "goalsFor": 32,
    "goalsAgainst": 21,
    "goalDifference": 11,
    "points": 13,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCAS SANCHES",
        "goals": 11
      },
      {
        "name": "FELIPINHO",
        "goals": 5
      }
    ],
    "duoGoals": 16,
    "unbeatenStreak": 3,
    "cleanSheets": 2,
    "failedToScore": 0,
    "biggestWinMargin": 8,
    "biggestLossMargin": 5,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 4,
    "defenseRank": 42,
    "duoRank": 10,
    "cardRank": 74
  },
  {
    "ranking": 23,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 84,
    "team": "RAYO VALLECANO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCE8ygQVY-3BXzP80H.png?alt=media&token=1&m=1780486202332",
    "matches": 5,
    "wins": 4,
    "draws": 1,
    "losses": 0,
    "goalsFor": 23,
    "goalsAgainst": 14,
    "goalDifference": 9,
    "points": 13,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "FELIPE",
        "goals": 11
      },
      {
        "name": "BRUNO SALES",
        "goals": 4
      }
    ],
    "duoGoals": 15,
    "unbeatenStreak": 5,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 0,
    "yellowCards": 6,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 30,
    "defenseRank": 49,
    "duoRank": 12,
    "cardRank": 40
  },
  {
    "ranking": 24,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 23,
    "team": "Chelsea",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2F760F12FC-9D42-4F18-B412-1E2FA1F4F101-7719-000005726A1BD6A9.png?alt=media",
    "matches": 7,
    "wins": 4,
    "draws": 1,
    "losses": 2,
    "goalsFor": 21,
    "goalsAgainst": 17,
    "goalDifference": 4,
    "points": 13,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "MARCELO",
        "goals": 4
      },
      {
        "name": "FABIO",
        "goals": 3
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 5,
    "cleanSheets": 2,
    "failedToScore": 0,
    "biggestWinMargin": 5,
    "biggestLossMargin": 3,
    "yellowCards": 3,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 3,
    "attackRank": 38,
    "defenseRank": 34,
    "duoRank": 74,
    "cardRank": 65
  },
  {
    "ranking": 25,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 62,
    "team": "PARMA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKklnfjqzwb3fVTJ1.png?alt=media&token=1&m=1751863782281",
    "matches": 8,
    "wins": 4,
    "draws": 1,
    "losses": 3,
    "goalsFor": 21,
    "goalsAgainst": 17,
    "goalDifference": 4,
    "points": 13,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ROBERTINHO",
        "goals": 6
      },
      {
        "name": "YURICK",
        "goals": 5
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 2,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 39,
    "defenseRank": 23,
    "duoRank": 45,
    "cardRank": 51
  },
  {
    "ranking": 26,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 7,
    "team": "SANTA CRUZ",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2F085C2B48-8CDE-4402-A7C4-102A57261CB5-6985-0000032019BC6104.png?alt=media",
    "matches": 7,
    "wins": 4,
    "draws": 1,
    "losses": 2,
    "goalsFor": 33,
    "goalsAgainst": 31,
    "goalDifference": 2,
    "points": 13,
    "placement": 2,
    "ongoing": false,
    "duo": [
      {
        "name": "FELIPINHO",
        "goals": 10
      },
      {
        "name": "FÁBIO ZIRONDI",
        "goals": 9
      }
    ],
    "duoGoals": 19,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 3,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 3,
    "defenseRank": 88,
    "duoRank": 4,
    "cardRank": 87
  },
  {
    "ranking": 27,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 61,
    "team": "NAPOLI",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKi0D9POk6z2YmrK8.png?alt=media&token=1&m=1751863799904",
    "matches": 10,
    "wins": 4,
    "draws": 1,
    "losses": 5,
    "goalsFor": 25,
    "goalsAgainst": 23,
    "goalDifference": 2,
    "points": 13,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCAS SANCHES",
        "goals": 13
      },
      {
        "name": "WILLIAN ROSA",
        "goals": 5
      }
    ],
    "duoGoals": 18,
    "unbeatenStreak": 4,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 3,
    "biggestLossMargin": 2,
    "yellowCards": 8,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 8,
    "attackRank": 21,
    "defenseRank": 30,
    "duoRank": 5,
    "cardRank": 21
  },
  {
    "ranking": 28,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 42,
    "team": "CROÁCIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2FABF67D6D-9CA3-48FA-8BE6-378E02124882-596-0000045029B6E4A0.png?alt=media",
    "matches": 8,
    "wins": 4,
    "draws": 1,
    "losses": 3,
    "goalsFor": 17,
    "goalsAgainst": 18,
    "goalDifference": -1,
    "points": 13,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "IGOR",
        "goals": 7
      },
      {
        "name": "JÚNIOR",
        "goals": 3
      }
    ],
    "duoGoals": 10,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 4,
    "yellowCards": 6,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 56,
    "defenseRank": 28,
    "duoRank": 48,
    "cardRank": 36
  },
  {
    "ranking": 29,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 32,
    "team": "BELGICA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2FECAAC42C-4AAC-4BA6-ABBB-7968AE04C420-596-0000045052F76398.png?alt=media",
    "matches": 7,
    "wins": 4,
    "draws": 1,
    "losses": 2,
    "goalsFor": 15,
    "goalsAgainst": 18,
    "goalDifference": -3,
    "points": 13,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "JÚNIOR",
        "goals": 6
      },
      {
        "name": "LUCAS S",
        "goals": 6
      }
    ],
    "duoGoals": 12,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 1,
    "biggestLossMargin": 4,
    "yellowCards": 2,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 2,
    "attackRank": 67,
    "defenseRank": 39,
    "duoRank": 37,
    "cardRank": 69
  },
  {
    "ranking": 30,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 55,
    "team": "FIORENTINA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKWVg1vqI9DH8nIe9.png?alt=media&token=1&m=1751863945408",
    "matches": 10,
    "wins": 4,
    "draws": 1,
    "losses": 5,
    "goalsFor": 19,
    "goalsAgainst": 28,
    "goalDifference": -9,
    "points": 13,
    "placement": 3,
    "ongoing": false,
    "duo": [
      {
        "name": "ALAN",
        "goals": 12
      },
      {
        "name": "MEIRELES",
        "goals": 4
      }
    ],
    "duoGoals": 16,
    "unbeatenStreak": 2,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 1,
    "biggestLossMargin": 4,
    "yellowCards": 8,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 8,
    "attackRank": 50,
    "defenseRank": 50,
    "duoRank": 9,
    "cardRank": 20
  },
  {
    "ranking": 31,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 14,
    "team": "ATHLÉTICO PARANAENSE",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2FDB17C046-8DB2-4B78-AFF8-256B3580DB32-7832-000004BCB1808F3D.png?alt=media",
    "matches": 8,
    "wins": 4,
    "draws": 0,
    "losses": 4,
    "goalsFor": 29,
    "goalsAgainst": 27,
    "goalDifference": 2,
    "points": 12,
    "placement": 3,
    "ongoing": false,
    "duo": [
      {
        "name": "YURICK",
        "goals": 7
      },
      {
        "name": "MOSCA JR",
        "goals": 6
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 7,
    "biggestLossMargin": 6,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 11,
    "defenseRank": 69,
    "duoRank": 32,
    "cardRank": 73
  },
  {
    "ranking": 32,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 15,
    "team": "BOTAFOGO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2F8AB89D53-76C0-47F4-BFC4-C9E514A02C5F-7832-000004BC8C7CE38F.png?alt=media",
    "matches": 7,
    "wins": 4,
    "draws": 0,
    "losses": 3,
    "goalsFor": 24,
    "goalsAgainst": 22,
    "goalDifference": 2,
    "points": 12,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUIZ BAHIA",
        "goals": 8
      },
      {
        "name": "LEONARDO",
        "goals": 6
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 5,
    "biggestLossMargin": 5,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 24,
    "defenseRank": 61,
    "duoRank": 19,
    "cardRank": 75
  },
  {
    "ranking": 33,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 51,
    "team": "BOLÍVAR",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2FF39327CE-8CFC-4914-9644-C56E4EBBC21B-970-00000036AE961C09.png?alt=media",
    "matches": 9,
    "wins": 4,
    "draws": 0,
    "losses": 5,
    "goalsFor": 21,
    "goalsAgainst": 22,
    "goalDifference": -1,
    "points": 12,
    "placement": 3,
    "ongoing": false,
    "duo": [
      {
        "name": "ZIRONDI",
        "goals": 6
      },
      {
        "name": "JOÃO PAULO",
        "goals": 5
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 4,
    "biggestLossMargin": 3,
    "yellowCards": 10,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 10,
    "attackRank": 40,
    "defenseRank": 38,
    "duoRank": 43,
    "cardRank": 9
  },
  {
    "ranking": 34,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 9,
    "team": "FLUMINENSE",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2FDD41C2B4-455C-4113-88B9-572C43077EC3-7832-000004BDB4E6342D.png?alt=media",
    "matches": 8,
    "wins": 4,
    "draws": 0,
    "losses": 4,
    "goalsFor": 20,
    "goalsAgainst": 22,
    "goalDifference": -2,
    "points": 12,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "MEIRELES",
        "goals": 6
      },
      {
        "name": "LUCAS",
        "goals": 5
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 3,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 43,
    "defenseRank": 46,
    "duoRank": 44,
    "cardRank": 81
  },
  {
    "ranking": 35,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 2,
    "team": "SAMPAIO CORRÊA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2F2BD424D8-7260-48BB-A7E3-6925132D4775-6985-0000031A049BF535.png?alt=media",
    "matches": 7,
    "wins": 3,
    "draws": 3,
    "losses": 1,
    "goalsFor": 34,
    "goalsAgainst": 23,
    "goalDifference": 11,
    "points": 12,
    "placement": 1,
    "ongoing": false,
    "duo": [
      {
        "name": "RONALD",
        "goals": 10
      },
      {
        "name": "GENTIL",
        "goals": 6
      }
    ],
    "duoGoals": 16,
    "unbeatenStreak": 5,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 5,
    "biggestLossMargin": 2,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 2,
    "defenseRank": 67,
    "duoRank": 11,
    "cardRank": 86
  },
  {
    "ranking": 36,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 78,
    "team": "SENEGAL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ45Ut21vMLl2iIEhJ.png?alt=media&token=1&m=1769058239312",
    "matches": 8,
    "wins": 3,
    "draws": 3,
    "losses": 2,
    "goalsFor": 21,
    "goalsAgainst": 16,
    "goalDifference": 5,
    "points": 12,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ANDREWS",
        "goals": 7
      },
      {
        "name": "MARKS",
        "goals": 2
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 5,
    "cleanSheets": 2,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 2,
    "yellowCards": 0,
    "redCards": 3,
    "blueCards": 0,
    "totalCards": 3,
    "attackRank": 37,
    "defenseRank": 22,
    "duoRank": 56,
    "cardRank": 64
  },
  {
    "ranking": 37,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 68,
    "team": "ARGENTINA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3pKD3t6Eh1A75GZJ.png?alt=media&token=1&m=1769058328614",
    "matches": 7,
    "wins": 3,
    "draws": 3,
    "losses": 1,
    "goalsFor": 16,
    "goalsAgainst": 14,
    "goalDifference": 2,
    "points": 12,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "BOLACHA",
        "goals": 5
      },
      {
        "name": "CAIPIRA",
        "goals": 3
      }
    ],
    "duoGoals": 8,
    "unbeatenStreak": 5,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 3,
    "yellowCards": 4,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 4,
    "attackRank": 59,
    "defenseRank": 19,
    "duoRank": 64,
    "cardRank": 59
  },
  {
    "ranking": 38,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 49,
    "team": "COLO COLO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2F2395244D-8B13-4AD5-9B42-F93608A7413C-2544-000001803FBB50D9.png?alt=media",
    "matches": 8,
    "wins": 3,
    "draws": 3,
    "losses": 2,
    "goalsFor": 24,
    "goalsAgainst": 23,
    "goalDifference": 1,
    "points": 12,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "WILL",
        "goals": 8
      },
      {
        "name": "LEONARDO ROPELATO",
        "goals": 7
      }
    ],
    "duoGoals": 15,
    "unbeatenStreak": 5,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 4,
    "yellowCards": 8,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 25,
    "defenseRank": 54,
    "duoRank": 14,
    "cardRank": 10
  },
  {
    "ranking": 39,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 35,
    "team": "HOLANDA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2F5EBABBBD-A74B-4481-9054-2C7B8CFBC184-596-00000451328D7E74.png?alt=media",
    "matches": 7,
    "wins": 3,
    "draws": 3,
    "losses": 1,
    "goalsFor": 14,
    "goalsAgainst": 14,
    "goalDifference": 0,
    "points": 12,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "JORGE LADEIRA",
        "goals": 5
      },
      {
        "name": "BRUNO HENRIQUE",
        "goals": 2
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 1,
    "biggestLossMargin": 3,
    "yellowCards": 7,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 8,
    "attackRank": 72,
    "defenseRank": 20,
    "duoRank": 72,
    "cardRank": 19
  },
  {
    "ranking": 40,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 41,
    "team": "ITALIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2FA1986F71-C1F9-440D-8DB6-2DB792B21377-596-00000451976CEDBB.png?alt=media",
    "matches": 7,
    "wins": 3,
    "draws": 2,
    "losses": 2,
    "goalsFor": 17,
    "goalsAgainst": 15,
    "goalDifference": 2,
    "points": 11,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "MEIRELES",
        "goals": 4
      },
      {
        "name": "ANDREWS",
        "goals": 3
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 4,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 2,
    "yellowCards": 5,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 54,
    "defenseRank": 25,
    "duoRank": 75,
    "cardRank": 32
  },
  {
    "ranking": 41,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 19,
    "team": "Manchester City",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2F85C765FF-0F59-4619-B222-E0A661120D57-7719-00000573436A3D6D.png?alt=media",
    "matches": 7,
    "wins": 3,
    "draws": 2,
    "losses": 2,
    "goalsFor": 18,
    "goalsAgainst": 17,
    "goalDifference": 1,
    "points": 11,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ZIRONDI",
        "goals": 8
      },
      {
        "name": "GUILHERME",
        "goals": 3
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 3,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 3,
    "biggestLossMargin": 4,
    "yellowCards": 6,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 51,
    "defenseRank": 37,
    "duoRank": 41,
    "cardRank": 38
  },
  {
    "ranking": 42,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 80,
    "team": "BARCELONA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCE2n4ni8czw1OPXtQ.png?alt=media&token=1&m=1780486248020",
    "matches": 5,
    "wins": 3,
    "draws": 1,
    "losses": 1,
    "goalsFor": 17,
    "goalsAgainst": 18,
    "goalDifference": -1,
    "points": 10,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "RAPHA",
        "goals": 7
      },
      {
        "name": "MOSCA",
        "goals": 4
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 5,
    "yellowCards": 4,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 4,
    "attackRank": 55,
    "defenseRank": 74,
    "duoRank": 42,
    "cardRank": 60
  },
  {
    "ranking": 43,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 24,
    "team": "Liverpool",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2F837AADCD-9CA8-4ABC-AD81-621CC4CE586B-7719-00000572291A82B3.png?alt=media",
    "matches": 10,
    "wins": 3,
    "draws": 1,
    "losses": 6,
    "goalsFor": 22,
    "goalsAgainst": 24,
    "goalDifference": -2,
    "points": 10,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "JEFERSON",
        "goals": 7
      },
      {
        "name": "KAIQUE",
        "goals": 7
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 3,
    "cleanSheets": 1,
    "failedToScore": 2,
    "biggestWinMargin": 3,
    "biggestLossMargin": 3,
    "yellowCards": 5,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 34,
    "defenseRank": 32,
    "duoRank": 24,
    "cardRank": 33
  },
  {
    "ranking": 44,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 8,
    "team": "SPORT",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2FAD79440D-2075-448B-9CB3-AE0BF5C6C807-6985-00000320D36E1261.png?alt=media",
    "matches": 7,
    "wins": 3,
    "draws": 1,
    "losses": 3,
    "goalsFor": 27,
    "goalsAgainst": 30,
    "goalDifference": -3,
    "points": 10,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCAS SANCHES",
        "goals": 16
      },
      {
        "name": "ISMAEL",
        "goals": 4
      }
    ],
    "duoGoals": 20,
    "unbeatenStreak": 4,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 3,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 15,
    "defenseRank": 86,
    "duoRank": 1,
    "cardRank": 88
  },
  {
    "ranking": 45,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 40,
    "team": "FRANÇA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2F2F7951E2-82F4-4A8A-BF64-A74EDB2194B6-596-000004518808FAAD.png?alt=media",
    "matches": 10,
    "wins": 3,
    "draws": 1,
    "losses": 6,
    "goalsFor": 24,
    "goalsAgainst": 28,
    "goalDifference": -4,
    "points": 10,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LEANDRO PARIS",
        "goals": 5
      },
      {
        "name": "RODRIGO",
        "goals": 5
      }
    ],
    "duoGoals": 10,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 4,
    "biggestLossMargin": 2,
    "yellowCards": 4,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 4,
    "attackRank": 27,
    "defenseRank": 51,
    "duoRank": 54,
    "cardRank": 62
  },
  {
    "ranking": 46,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 12,
    "team": "GRÊMIO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2F9A3A3965-6862-44C9-A42C-C2474735713C-7832-000004BD20393C28.png?alt=media",
    "matches": 7,
    "wins": 3,
    "draws": 1,
    "losses": 3,
    "goalsFor": 16,
    "goalsAgainst": 20,
    "goalDifference": -4,
    "points": 10,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "THIAGO BIANCO",
        "goals": 6
      },
      {
        "name": "LUCÃO",
        "goals": 2
      }
    ],
    "duoGoals": 8,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 5,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 61,
    "defenseRank": 53,
    "duoRank": 63,
    "cardRank": 83
  },
  {
    "ranking": 47,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 27,
    "team": "West Ham",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2F144C2B27-F1DE-410C-88EC-8858A1745818-7719-00000571A1FD9D5F.png?alt=media",
    "matches": 10,
    "wins": 2,
    "draws": 4,
    "losses": 4,
    "goalsFor": 27,
    "goalsAgainst": 32,
    "goalDifference": -5,
    "points": 10,
    "placement": 3,
    "ongoing": false,
    "duo": [
      {
        "name": "MEIRELES",
        "goals": 8
      },
      {
        "name": "JOÃO PEGO",
        "goals": 5
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 3,
    "yellowCards": 12,
    "redCards": 2,
    "blueCards": 0,
    "totalCards": 14,
    "attackRank": 16,
    "defenseRank": 64,
    "duoRank": 30,
    "cardRank": 1
  },
  {
    "ranking": 48,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 89,
    "team": "ATLÉTICO DE MADRID",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCEPqc-2Ju1pdvU4j1.png?alt=media&token=1&m=1780486145929",
    "matches": 5,
    "wins": 3,
    "draws": 0,
    "losses": 2,
    "goalsFor": 15,
    "goalsAgainst": 12,
    "goalDifference": 3,
    "points": 9,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "MELCHIADES",
        "goals": 8
      },
      {
        "name": "WILL",
        "goals": 3
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 2,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 5,
    "biggestLossMargin": 3,
    "yellowCards": 2,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 2,
    "attackRank": 66,
    "defenseRank": 31,
    "duoRank": 39,
    "cardRank": 68
  },
  {
    "ranking": 49,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 86,
    "team": "REAL SOCIEDAD",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCEBQOxXueVsu4_Pbt.png?alt=media&token=1&m=1780486174129",
    "matches": 5,
    "wins": 3,
    "draws": 0,
    "losses": 2,
    "goalsFor": 10,
    "goalsAgainst": 9,
    "goalDifference": 1,
    "points": 9,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "ALAN",
        "goals": 4
      },
      {
        "name": "IGOR",
        "goals": 4
      }
    ],
    "duoGoals": 8,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 2,
    "biggestWinMargin": 3,
    "biggestLossMargin": 4,
    "yellowCards": 2,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 2,
    "attackRank": 88,
    "defenseRank": 13,
    "duoRank": 69,
    "cardRank": 72
  },
  {
    "ranking": 50,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 38,
    "team": "ROMÊNIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2F448396DB-C475-46ED-A87A-06D379B6AFC3-596-00000451627A4E3C.png?alt=media",
    "matches": 7,
    "wins": 3,
    "draws": 0,
    "losses": 4,
    "goalsFor": 14,
    "goalsAgainst": 18,
    "goalDifference": -4,
    "points": 9,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ALAN",
        "goals": 4
      },
      {
        "name": "BOLACHA",
        "goals": 3
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 1,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 4,
    "yellowCards": 8,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 8,
    "attackRank": 74,
    "defenseRank": 40,
    "duoRank": 78,
    "cardRank": 22
  },
  {
    "ranking": 51,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 73,
    "team": "INGLATERRA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3xIOzwGE3HoOd0x4.png?alt=media&token=1&m=1769058290722",
    "matches": 8,
    "wins": 2,
    "draws": 3,
    "losses": 3,
    "goalsFor": 19,
    "goalsAgainst": 23,
    "goalDifference": -4,
    "points": 9,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCAS SANCHES",
        "goals": 8
      },
      {
        "name": "BÁRBARO",
        "goals": 3
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 4,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 1,
    "biggestLossMargin": 2,
    "yellowCards": 3,
    "redCards": 2,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 47,
    "defenseRank": 55,
    "duoRank": 40,
    "cardRank": 43
  },
  {
    "ranking": 52,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 34,
    "team": "INGLATERRA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2F1301FE3A-7B13-4541-8D0F-67D551DF2A6D-596-000004511A4F82E0.png?alt=media",
    "matches": 10,
    "wins": 2,
    "draws": 3,
    "losses": 5,
    "goalsFor": 17,
    "goalsAgainst": 23,
    "goalDifference": -6,
    "points": 9,
    "placement": 2,
    "ongoing": false,
    "duo": [
      {
        "name": "GABRIEL",
        "goals": 5
      },
      {
        "name": "JÚNIOR",
        "goals": 3
      }
    ],
    "duoGoals": 8,
    "unbeatenStreak": 4,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 4,
    "yellowCards": 6,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 57,
    "defenseRank": 29,
    "duoRank": 65,
    "cardRank": 37
  },
  {
    "ranking": 53,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 25,
    "team": "Newcastle",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2FAD07229D-7E7A-431A-B195-BFDA065FB8D8-7719-00000571ECD6C42A.png?alt=media",
    "matches": 7,
    "wins": 2,
    "draws": 2,
    "losses": 3,
    "goalsFor": 19,
    "goalsAgainst": 19,
    "goalDifference": 0,
    "points": 8,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "FRANCIS",
        "goals": 6
      },
      {
        "name": "JP",
        "goals": 4
      }
    ],
    "duoGoals": 10,
    "unbeatenStreak": 4,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 2,
    "yellowCards": 6,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 45,
    "defenseRank": 45,
    "duoRank": 50,
    "cardRank": 39
  },
  {
    "ranking": 54,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 85,
    "team": "REAL BÉTIS",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCEAFLB6cDtcv8W1dI.jpg?alt=media&token=1&m=1780486184928",
    "matches": 5,
    "wins": 2,
    "draws": 2,
    "losses": 1,
    "goalsFor": 10,
    "goalsAgainst": 10,
    "goalDifference": 0,
    "points": 8,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "LUCCIOLA",
        "goals": 2
      },
      {
        "name": "PRESIDA",
        "goals": 2
      }
    ],
    "duoGoals": 4,
    "unbeatenStreak": 4,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 4,
    "yellowCards": 5,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 89,
    "defenseRank": 18,
    "duoRank": 89,
    "cardRank": 55
  },
  {
    "ranking": 55,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 71,
    "team": "FRANÇA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3tlplBOUQV6fxUa_.png?alt=media&token=1&m=1769058413403",
    "matches": 7,
    "wins": 2,
    "draws": 2,
    "losses": 3,
    "goalsFor": 13,
    "goalsAgainst": 15,
    "goalDifference": -2,
    "points": 8,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "TIAGO CB",
        "goals": 5
      },
      {
        "name": "EFRAIM",
        "goals": 2
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 2,
    "yellowCards": 5,
    "redCards": 3,
    "blueCards": 0,
    "totalCards": 8,
    "attackRank": 80,
    "defenseRank": 24,
    "duoRank": 71,
    "cardRank": 18
  },
  {
    "ranking": 56,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 74,
    "team": "CROÁCIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3zSXJwA84a5cnNlF.png?alt=media&token=1&m=1769058265014",
    "matches": 7,
    "wins": 2,
    "draws": 2,
    "losses": 3,
    "goalsFor": 14,
    "goalsAgainst": 17,
    "goalDifference": -3,
    "points": 8,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "WILL MENDES",
        "goals": 5
      },
      {
        "name": "DIGO",
        "goals": 2
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 4,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 3,
    "yellowCards": 4,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 4,
    "attackRank": 73,
    "defenseRank": 35,
    "duoRank": 70,
    "cardRank": 61
  },
  {
    "ranking": 57,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 3,
    "team": "FORTALEZA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2F5B3383C9-2AF7-4CE9-8FC1-4E25F30A6A20-6985-0000031D27600EFA.png?alt=media",
    "matches": 6,
    "wins": 2,
    "draws": 2,
    "losses": 2,
    "goalsFor": 21,
    "goalsAgainst": 25,
    "goalDifference": -4,
    "points": 8,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "JOÃO PAULO",
        "goals": 12
      },
      {
        "name": "JORGE",
        "goals": 2
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 1,
    "biggestLossMargin": 5,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 41,
    "defenseRank": 85,
    "duoRank": 15,
    "cardRank": 82
  },
  {
    "ranking": 58,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 16,
    "team": "CRUZEIRO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2F2FB69A3F-54FB-484C-BD18-BD4A75C880A4-7832-000004BC65C5FC5F.png?alt=media",
    "matches": 7,
    "wins": 2,
    "draws": 2,
    "losses": 3,
    "goalsFor": 16,
    "goalsAgainst": 20,
    "goalDifference": -4,
    "points": 8,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "CH",
        "goals": 3
      },
      {
        "name": "MARCO",
        "goals": 3
      }
    ],
    "duoGoals": 6,
    "unbeatenStreak": 2,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 3,
    "biggestLossMargin": 8,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 60,
    "defenseRank": 52,
    "duoRank": 85,
    "cardRank": 78
  },
  {
    "ranking": 59,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 70,
    "team": "ALEMANHÃ",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3rxi_GfAOTmrJ4fv.png?alt=media&token=1&m=1769058359029",
    "matches": 7,
    "wins": 2,
    "draws": 2,
    "losses": 3,
    "goalsFor": 19,
    "goalsAgainst": 24,
    "goalDifference": -5,
    "points": 8,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCCIOLA",
        "goals": 9
      },
      {
        "name": "WILIAN ROSA",
        "goals": 4
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 1,
    "biggestLossMargin": 3,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 48,
    "defenseRank": 70,
    "duoRank": 26,
    "cardRank": 44
  },
  {
    "ranking": 60,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 88,
    "team": "ATHLETICO BILBAO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCEIPXbahnsYG98j_K.png?alt=media&token=1&m=1780486156323",
    "matches": 5,
    "wins": 2,
    "draws": 1,
    "losses": 2,
    "goalsFor": 14,
    "goalsAgainst": 14,
    "goalDifference": 0,
    "points": 7,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "BLOTTI",
        "goals": 4
      },
      {
        "name": "IGOR",
        "goals": 3
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 4,
    "biggestLossMargin": 3,
    "yellowCards": 5,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 71,
    "defenseRank": 47,
    "duoRank": 73,
    "cardRank": 30
  },
  {
    "ranking": 61,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 36,
    "team": "PORTUGAL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2F25A332D7-57F7-457C-8F67-B4CEBD99B45A-596-0000045153D3B762.png?alt=media",
    "matches": 7,
    "wins": 2,
    "draws": 1,
    "losses": 4,
    "goalsFor": 13,
    "goalsAgainst": 13,
    "goalDifference": 0,
    "points": 7,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "MOTA",
        "goals": 5
      },
      {
        "name": "GENTIL",
        "goals": 3
      }
    ],
    "duoGoals": 8,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 2,
    "yellowCards": 9,
    "redCards": 2,
    "blueCards": 0,
    "totalCards": 11,
    "attackRank": 78,
    "defenseRank": 15,
    "duoRank": 67,
    "cardRank": 6
  },
  {
    "ranking": 62,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 87,
    "team": "GETAFE",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCECnOQDCHySBDLAxx.jpg?alt=media&token=1&m=1780486165873",
    "matches": 5,
    "wins": 2,
    "draws": 1,
    "losses": 2,
    "goalsFor": 13,
    "goalsAgainst": 14,
    "goalDifference": -1,
    "points": 7,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "JEFERSON",
        "goals": 3
      },
      {
        "name": "MATHEUS",
        "goals": 2
      }
    ],
    "duoGoals": 5,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 1,
    "biggestLossMargin": 2,
    "yellowCards": 2,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 2,
    "attackRank": 79,
    "defenseRank": 48,
    "duoRank": 88,
    "cardRank": 70
  },
  {
    "ranking": 63,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 63,
    "team": "ROMA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKm_l3ghoek06-9I5.png?alt=media&token=1&m=1751863761384",
    "matches": 8,
    "wins": 2,
    "draws": 1,
    "losses": 5,
    "goalsFor": 19,
    "goalsAgainst": 21,
    "goalDifference": -2,
    "points": 7,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "WILL",
        "goals": 6
      },
      {
        "name": "MATHEUS",
        "goals": 4
      }
    ],
    "duoGoals": 10,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 3,
    "biggestLossMargin": 2,
    "yellowCards": 3,
    "redCards": 3,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 46,
    "defenseRank": 43,
    "duoRank": 51,
    "cardRank": 27
  },
  {
    "ranking": 64,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 83,
    "team": "VILLAREAL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCE79e187h1srqNCAK.png?alt=media&token=1&m=1780486214562",
    "matches": 5,
    "wins": 2,
    "draws": 1,
    "losses": 2,
    "goalsFor": 18,
    "goalsAgainst": 20,
    "goalDifference": -2,
    "points": 7,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "JHOW",
        "goals": 5
      },
      {
        "name": "FAGNER",
        "goals": 4
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 4,
    "yellowCards": 6,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 7,
    "attackRank": 52,
    "defenseRank": 83,
    "duoRank": 62,
    "cardRank": 25
  },
  {
    "ranking": 65,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 76,
    "team": "KOREA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ41zkRhp8mmgD0ZVt.png?alt=media&token=1&m=1769059455339",
    "matches": 8,
    "wins": 2,
    "draws": 1,
    "losses": 5,
    "goalsFor": 17,
    "goalsAgainst": 24,
    "goalDifference": -7,
    "points": 7,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "R LOURENÇO",
        "goals": 7
      },
      {
        "name": "JOSÉ BRUNO",
        "goals": 5
      }
    ],
    "duoGoals": 12,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 3,
    "biggestLossMargin": 6,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 58,
    "defenseRank": 58,
    "duoRank": 35,
    "cardRank": 50
  },
  {
    "ranking": 66,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 69,
    "team": "PORTUGAL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3qbqDLwRqSgPL2by.png?alt=media&token=1&m=1769058346637",
    "matches": 9,
    "wins": 2,
    "draws": 1,
    "losses": 6,
    "goalsFor": 24,
    "goalsAgainst": 33,
    "goalDifference": -9,
    "points": 7,
    "placement": 3,
    "ongoing": false,
    "duo": [
      {
        "name": "FELIPE",
        "goals": 8
      },
      {
        "name": "RENAN",
        "goals": 5
      }
    ],
    "duoGoals": 13,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 4,
    "yellowCards": 5,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 28,
    "defenseRank": 75,
    "duoRank": 29,
    "cardRank": 34
  },
  {
    "ranking": 67,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 20,
    "team": "Manchester United",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2F1729DF14-D77B-48FC-A355-60CEB165BFAD-7719-000005732547C5FB.png?alt=media",
    "matches": 7,
    "wins": 2,
    "draws": 1,
    "losses": 4,
    "goalsFor": 14,
    "goalsAgainst": 23,
    "goalDifference": -9,
    "points": 7,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "RODRIGO NUNES",
        "goals": 7
      },
      {
        "name": "ALAN RESENDE",
        "goals": 3
      }
    ],
    "duoGoals": 10,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 6,
    "yellowCards": 3,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 4,
    "attackRank": 76,
    "defenseRank": 65,
    "duoRank": 49,
    "cardRank": 58
  },
  {
    "ranking": 68,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 82,
    "team": "SEVILLA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCE5UUPYmEL7Mnf4-D.jpg?alt=media&token=1&m=1780486225730",
    "matches": 5,
    "wins": 2,
    "draws": 0,
    "losses": 3,
    "goalsFor": 17,
    "goalsAgainst": 13,
    "goalDifference": 4,
    "points": 6,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "EFRAIM",
        "goals": 6
      },
      {
        "name": "LUCAS",
        "goals": 5
      }
    ],
    "duoGoals": 11,
    "unbeatenStreak": 1,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 2,
    "yellowCards": 9,
    "redCards": 2,
    "blueCards": 0,
    "totalCards": 11,
    "attackRank": 53,
    "defenseRank": 41,
    "duoRank": 47,
    "cardRank": 7
  },
  {
    "ranking": 69,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 1,
    "team": "EC BAHIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2F1D970C15-E6B7-49EB-9856-5B2C921964D2-6985-0000031EEFD5242D.png?alt=media",
    "matches": 6,
    "wins": 2,
    "draws": 0,
    "losses": 4,
    "goalsFor": 24,
    "goalsAgainst": 23,
    "goalDifference": 1,
    "points": 6,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "WILL",
        "goals": 5
      },
      {
        "name": "LUIZ BAHIA",
        "goals": 4
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 1,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 26,
    "defenseRank": 77,
    "duoRank": 59,
    "cardRank": 79
  },
  {
    "ranking": 70,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 37,
    "team": "TURQUIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2F7AE86BD1-4D7C-4835-9534-606FC53C2A3C-596-0000045145791CBF.png?alt=media",
    "matches": 8,
    "wins": 2,
    "draws": 0,
    "losses": 6,
    "goalsFor": 23,
    "goalsAgainst": 23,
    "goalDifference": 0,
    "points": 6,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "GOGO",
        "goals": 6
      },
      {
        "name": "ROBERTINHO",
        "goals": 6
      }
    ],
    "duoGoals": 12,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 5,
    "biggestLossMargin": 3,
    "yellowCards": 8,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 31,
    "defenseRank": 56,
    "duoRank": 38,
    "cardRank": 13
  },
  {
    "ranking": 71,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 65,
    "team": "ATALANTA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OT2leBmOnAs9JGFVGbq.png?alt=media&token=1&m=1751863726264",
    "matches": 7,
    "wins": 2,
    "draws": 0,
    "losses": 5,
    "goalsFor": 11,
    "goalsAgainst": 22,
    "goalDifference": -11,
    "points": 6,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "MOSCA",
        "goals": 3
      },
      {
        "name": "IGOR",
        "goals": 2
      }
    ],
    "duoGoals": 5,
    "unbeatenStreak": 2,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 4,
    "yellowCards": 2,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 2,
    "attackRank": 86,
    "defenseRank": 60,
    "duoRank": 87,
    "cardRank": 67
  },
  {
    "ranking": 72,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 4,
    "team": "CEARÁ",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2F6CDEA004-4CF6-4EC8-A393-A919FDA0C247-6985-0000031DF27010BF.png?alt=media",
    "matches": 6,
    "wins": 1,
    "draws": 3,
    "losses": 2,
    "goalsFor": 22,
    "goalsAgainst": 25,
    "goalDifference": -3,
    "points": 6,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "FRANCISCO THIAGO",
        "goals": 5
      },
      {
        "name": "CASSIO",
        "goals": 4
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 4,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 35,
    "defenseRank": 84,
    "duoRank": 58,
    "cardRank": 76
  },
  {
    "ranking": 73,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 43,
    "team": "BOCA JÚNIORS",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2FB574B894-1E10-40A6-878E-05AFAAFCF52C-2544-0000017B491DF800.png?alt=media",
    "matches": 8,
    "wins": 1,
    "draws": 3,
    "losses": 4,
    "goalsFor": 19,
    "goalsAgainst": 25,
    "goalDifference": -6,
    "points": 6,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ALEF",
        "goals": 6
      },
      {
        "name": "JORGE",
        "goals": 3
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 5,
    "biggestLossMargin": 4,
    "yellowCards": 3,
    "redCards": 2,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 49,
    "defenseRank": 59,
    "duoRank": 57,
    "cardRank": 42
  },
  {
    "ranking": 74,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 54,
    "team": "ATLÉTICO NACIONAL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2F435A78FB-7856-416B-950A-13FC4215E420-2544-000001812F11B94F.png?alt=media",
    "matches": 7,
    "wins": 1,
    "draws": 3,
    "losses": 3,
    "goalsFor": 13,
    "goalsAgainst": 19,
    "goalDifference": -6,
    "points": 6,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "BOLACHA",
        "goals": 3
      },
      {
        "name": "LUCAS HENRIQUE",
        "goals": 3
      }
    ],
    "duoGoals": 6,
    "unbeatenStreak": 3,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 3,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 81,
    "defenseRank": 44,
    "duoRank": 82,
    "cardRank": 45
  },
  {
    "ranking": 75,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 52,
    "team": "CERRO PORTEÑO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2FE34DF6D5-96B6-453A-9160-BCBDCB41C265-2544-0000017DF99C2370.png?alt=media",
    "matches": 10,
    "wins": 1,
    "draws": 3,
    "losses": 6,
    "goalsFor": 23,
    "goalsAgainst": 35,
    "goalDifference": -12,
    "points": 6,
    "placement": 2,
    "ongoing": false,
    "duo": [
      {
        "name": "IGOR",
        "goals": 7
      },
      {
        "name": "RENAN BATISTA",
        "goals": 7
      }
    ],
    "duoGoals": 14,
    "unbeatenStreak": 3,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 1,
    "biggestLossMargin": 4,
    "yellowCards": 6,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 32,
    "defenseRank": 73,
    "duoRank": 22,
    "cardRank": 35
  },
  {
    "ranking": 76,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 59,
    "team": "JUVENTUS",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKeCCZH9KtxNcb1qa.png?alt=media&token=1&m=1751863873523",
    "matches": 7,
    "wins": 1,
    "draws": 2,
    "losses": 4,
    "goalsFor": 15,
    "goalsAgainst": 22,
    "goalDifference": -7,
    "points": 5,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ANDRÉ GOMES",
        "goals": 5
      },
      {
        "name": "RODRIGUINHO",
        "goals": 4
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 1,
    "biggestLossMargin": 3,
    "yellowCards": 8,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 9,
    "attackRank": 68,
    "defenseRank": 63,
    "duoRank": 60,
    "cardRank": 12
  },
  {
    "ranking": 77,
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "semester": 1,
    "editionTeamId": 77,
    "team": "COSTA DO MARFIM",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ43dgqur1bN6RjDGY.png?alt=media&token=1&m=1769058252418",
    "matches": 7,
    "wins": 1,
    "draws": 2,
    "losses": 4,
    "goalsFor": 16,
    "goalsAgainst": 24,
    "goalDifference": -8,
    "points": 5,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "DAVI",
        "goals": 3
      },
      {
        "name": "IGOR",
        "goals": 3
      }
    ],
    "duoGoals": 6,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 2,
    "biggestLossMargin": 5,
    "yellowCards": 4,
    "redCards": 2,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 63,
    "defenseRank": 71,
    "duoRank": 84,
    "cardRank": 28
  },
  {
    "ranking": 78,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 81,
    "team": "VALÊNCIA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCE3jNN_OU-QexjdHw.jpg?alt=media&token=1&m=1780486237207",
    "matches": 5,
    "wins": 1,
    "draws": 1,
    "losses": 3,
    "goalsFor": 10,
    "goalsAgainst": 11,
    "goalDifference": -1,
    "points": 4,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "BOLACHA",
        "goals": 2
      },
      {
        "name": "LUCAS",
        "goals": 2
      }
    ],
    "duoGoals": 4,
    "unbeatenStreak": 2,
    "cleanSheets": 1,
    "failedToScore": 0,
    "biggestWinMargin": 3,
    "biggestLossMargin": 2,
    "yellowCards": 6,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 90,
    "defenseRank": 27,
    "duoRank": 90,
    "cardRank": 41
  },
  {
    "ranking": 79,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 22,
    "team": "Crystal Palace",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2FE7222896-A3D2-4FB0-A087-D128D632B337-7698-0000056F98EFF9E8.png?alt=media",
    "matches": 7,
    "wins": 1,
    "draws": 1,
    "losses": 5,
    "goalsFor": 16,
    "goalsAgainst": 22,
    "goalDifference": -6,
    "points": 4,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCAS HENRIQUE",
        "goals": 7
      },
      {
        "name": "CAÍQUE",
        "goals": 2
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 3,
    "biggestLossMargin": 4,
    "yellowCards": 4,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 62,
    "defenseRank": 62,
    "duoRank": 55,
    "cardRank": 47
  },
  {
    "ranking": 80,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 90,
    "team": "CELTA DE VIGO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCEUdiPg-VFiAmxP-W.png?alt=media&token=1&m=1780486128245",
    "matches": 5,
    "wins": 1,
    "draws": 1,
    "losses": 3,
    "goalsFor": 14,
    "goalsAgainst": 20,
    "goalDifference": -6,
    "points": 4,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "R LOURENÇO",
        "goals": 3
      },
      {
        "name": "RAFINHA",
        "goals": 3
      }
    ],
    "duoGoals": 6,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 2,
    "biggestLossMargin": 4,
    "yellowCards": 5,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 75,
    "defenseRank": 82,
    "duoRank": 83,
    "cardRank": 31
  },
  {
    "ranking": 81,
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "semester": 2,
    "editionTeamId": 33,
    "team": "ESPANHA",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-4dqvf%2F1E25A58E-D20E-4800-B466-8D0D9E5BC7D1-596-00000451076BD798.png?alt=media",
    "matches": 7,
    "wins": 1,
    "draws": 1,
    "losses": 5,
    "goalsFor": 16,
    "goalsAgainst": 24,
    "goalDifference": -8,
    "points": 4,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "ALEX R",
        "goals": 5
      },
      {
        "name": "DIEGO LEMES",
        "goals": 5
      }
    ],
    "duoGoals": 10,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 4,
    "biggestLossMargin": 5,
    "yellowCards": 11,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 12,
    "attackRank": 64,
    "defenseRank": 72,
    "duoRank": 53,
    "cardRank": 5
  },
  {
    "ranking": 82,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 17,
    "team": "INTER",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2F73065FF5-7447-4471-A103-2D577A87A438-7832-000004BC4056ED07.png?alt=media",
    "matches": 8,
    "wins": 1,
    "draws": 1,
    "losses": 6,
    "goalsFor": 16,
    "goalsAgainst": 31,
    "goalDifference": -15,
    "points": 4,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "DIEGO",
        "goals": 4
      },
      {
        "name": "CHICO",
        "goals": 2
      }
    ],
    "duoGoals": 6,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 2,
    "biggestWinMargin": 2,
    "biggestLossMargin": 7,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 65,
    "defenseRank": 81,
    "duoRank": 81,
    "cardRank": 84
  },
  {
    "ranking": 83,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 57,
    "team": "MILAN",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKYx1mq3QxZXlYpIu.jpg?alt=media&token=1&m=1751863907210",
    "matches": 7,
    "wins": 1,
    "draws": 0,
    "losses": 6,
    "goalsFor": 13,
    "goalsAgainst": 23,
    "goalDifference": -10,
    "points": 3,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "DESIATO",
        "goals": 5
      },
      {
        "name": "TIAGO MENDONÇA",
        "goals": 3
      }
    ],
    "duoGoals": 8,
    "unbeatenStreak": 1,
    "cleanSheets": 1,
    "failedToScore": 1,
    "biggestWinMargin": 5,
    "biggestLossMargin": 5,
    "yellowCards": 5,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 84,
    "defenseRank": 66,
    "duoRank": 66,
    "cardRank": 53
  },
  {
    "ranking": 84,
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "semester": 2,
    "editionTeamId": 56,
    "team": "LECCE",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKXKIJnSLtJrYOMBQ.png?alt=media&token=1&m=1751863922469",
    "matches": 7,
    "wins": 1,
    "draws": 0,
    "losses": 6,
    "goalsFor": 13,
    "goalsAgainst": 27,
    "goalDifference": -14,
    "points": 3,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "JOÃO PAULO",
        "goals": 4
      },
      {
        "name": "PIMENTA",
        "goals": 4
      }
    ],
    "duoGoals": 8,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 2,
    "biggestWinMargin": 1,
    "biggestLossMargin": 5,
    "yellowCards": 4,
    "redCards": 2,
    "blueCards": 0,
    "totalCards": 6,
    "attackRank": 85,
    "defenseRank": 78,
    "duoRank": 68,
    "cardRank": 29
  },
  {
    "ranking": 85,
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "semester": 2,
    "editionTeamId": 11,
    "team": "VASCO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ncna_domeuyityn-om1%2F34F8AC00-D01B-4096-8600-0BF10F5F5DD2-7832-000004BD44B11229.png?alt=media",
    "matches": 7,
    "wins": 1,
    "draws": 0,
    "losses": 6,
    "goalsFor": 15,
    "goalsAgainst": 34,
    "goalDifference": -19,
    "points": 3,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "EFRAIM",
        "goals": 4
      },
      {
        "name": "ED",
        "goals": 3
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 1,
    "biggestLossMargin": 7,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 69,
    "defenseRank": 89,
    "duoRank": 79,
    "cardRank": 89
  },
  {
    "ranking": 86,
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "semester": 1,
    "editionTeamId": 26,
    "team": "Tottenham",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-shn4%2FEAE6A44E-01E2-499E-B1B9-A3EFA7399021-7719-00000571843DBEB7.png?alt=media",
    "matches": 7,
    "wins": 1,
    "draws": 0,
    "losses": 6,
    "goalsFor": 11,
    "goalsAgainst": 30,
    "goalDifference": -19,
    "points": 3,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCAS SANCHES",
        "goals": 5
      },
      {
        "name": "BAHIA",
        "goals": 1
      }
    ],
    "duoGoals": 6,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 1,
    "biggestLossMargin": 7,
    "yellowCards": 5,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 5,
    "attackRank": 87,
    "defenseRank": 87,
    "duoRank": 80,
    "cardRank": 56
  },
  {
    "ranking": 87,
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "semester": 1,
    "editionTeamId": 6,
    "team": "NÁUTICO",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-ntuuhaxhe2_pmjm8fm5%2FECB55550-F0F8-4F08-9FBE-8449B3FA07AF-6985-0000031F2F7D1036.png?alt=media",
    "matches": 6,
    "wins": 0,
    "draws": 2,
    "losses": 4,
    "goalsFor": 13,
    "goalsAgainst": 20,
    "goalDifference": -7,
    "points": 2,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "EFRAIM",
        "goals": 4
      },
      {
        "name": "FABRÍCIO",
        "goals": 3
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 0,
    "biggestLossMargin": 3,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 0,
    "attackRank": 83,
    "defenseRank": 68,
    "duoRank": 76,
    "cardRank": 85
  },
  {
    "ranking": 88,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 44,
    "team": "RIVER PLATE",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2F42181C3D-28DF-413B-B0D0-574D98ED7535-2544-0000017BA07DC686.png?alt=media",
    "matches": 7,
    "wins": 0,
    "draws": 2,
    "losses": 5,
    "goalsFor": 14,
    "goalsAgainst": 27,
    "goalDifference": -13,
    "points": 2,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "BRUNO BLOTTI",
        "goals": 3
      },
      {
        "name": "MARCELO HENDLER",
        "goals": 3
      }
    ],
    "duoGoals": 6,
    "unbeatenStreak": 2,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 0,
    "biggestLossMargin": 5,
    "yellowCards": 7,
    "redCards": 0,
    "blueCards": 0,
    "totalCards": 7,
    "attackRank": 77,
    "defenseRank": 79,
    "duoRank": 86,
    "cardRank": 26
  },
  {
    "ranking": 89,
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "semester": 2,
    "editionTeamId": 79,
    "team": "REAL MADRID",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCE1lbs7UFbj9mOJgT.png?alt=media&token=1&m=1780486258622",
    "matches": 5,
    "wins": 0,
    "draws": 1,
    "losses": 4,
    "goalsFor": 13,
    "goalsAgainst": 19,
    "goalDifference": -6,
    "points": 1,
    "placement": null,
    "ongoing": true,
    "duo": [
      {
        "name": "TIAGO BIANCO",
        "goals": 4
      },
      {
        "name": "GUSTAVO MARQUES",
        "goals": 3
      }
    ],
    "duoGoals": 7,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 0,
    "biggestWinMargin": 0,
    "biggestLossMargin": 3,
    "yellowCards": 1,
    "redCards": 1,
    "blueCards": 0,
    "totalCards": 2,
    "attackRank": 82,
    "defenseRank": 76,
    "duoRank": 77,
    "cardRank": 66
  },
  {
    "ranking": 90,
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "semester": 1,
    "editionTeamId": 47,
    "team": "PENAROL",
    "badgeUrl": "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2FEF0B9C4D-EC0E-446B-8149-561D2CDCB194-2544-0000017DCA790E90.png?alt=media",
    "matches": 7,
    "wins": 0,
    "draws": 1,
    "losses": 6,
    "goalsFor": 15,
    "goalsAgainst": 39,
    "goalDifference": -24,
    "points": 1,
    "placement": null,
    "ongoing": false,
    "duo": [
      {
        "name": "LUCAS SANCHES",
        "goals": 5
      },
      {
        "name": "VALTINHO",
        "goals": 4
      }
    ],
    "duoGoals": 9,
    "unbeatenStreak": 1,
    "cleanSheets": 0,
    "failedToScore": 1,
    "biggestWinMargin": 0,
    "biggestLossMargin": 7,
    "yellowCards": 9,
    "redCards": 3,
    "blueCards": 0,
    "totalCards": 12,
    "attackRank": 70,
    "defenseRank": 90,
    "duoRank": 61,
    "cardRank": 4
  }
];

export const HISTORICAL_DISCIPLINE_EDITIONS: HistoricalDisciplineEdition[] = [
  {
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "leaders": []
  },
  {
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "leaders": []
  },
  {
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "leaders": [
      {
        "position": 1,
        "name": "JOÃO PAULO",
        "team": "PORTUGAL",
        "editionTeamId": 36,
        "yellowCards": 3,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 4
      },
      {
        "position": 2,
        "name": "LORRYS",
        "team": "TURQUIA",
        "editionTeamId": 37,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 3,
        "name": "MOTA",
        "team": "PORTUGAL",
        "editionTeamId": 36,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 4,
        "name": "EDUARDO",
        "team": "ALEMANHA",
        "editionTeamId": 31,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 5,
        "name": "RICARDINHO",
        "team": "ESPANHA",
        "editionTeamId": 33,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 6,
        "name": "ALEX R",
        "team": "ESPANHA",
        "editionTeamId": 33,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 7,
        "name": "CARLOS PAIVA",
        "team": "HOLANDA",
        "editionTeamId": 35,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 8,
        "name": "ALF",
        "team": "ITALIA",
        "editionTeamId": 41,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 9,
        "name": "ALMEIDA",
        "team": "PORTUGAL",
        "editionTeamId": 36,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 10,
        "name": "FÁBIO",
        "team": "ESPANHA",
        "editionTeamId": 33,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      }
    ]
  },
  {
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "leaders": [
      {
        "position": 1,
        "name": "FABIO",
        "team": "Wolves",
        "editionTeamId": 28,
        "yellowCards": 5,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 5
      },
      {
        "position": 2,
        "name": "PAULO",
        "team": "West Ham",
        "editionTeamId": 27,
        "yellowCards": 4,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 4
      },
      {
        "position": 3,
        "name": "ANDRÉ LUIS",
        "team": "Manchester United",
        "editionTeamId": 20,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 4,
        "name": "LÉO",
        "team": "Brighton",
        "editionTeamId": 30,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 5,
        "name": "JUNINHO",
        "team": "Arsenal",
        "editionTeamId": 21,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 6,
        "name": "RODRIGO",
        "team": "Manchester City",
        "editionTeamId": 19,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 7,
        "name": "GOGO",
        "team": "Fulham",
        "editionTeamId": 29,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 8,
        "name": "JOÃO PEGO",
        "team": "West Ham",
        "editionTeamId": 27,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 9,
        "name": "LEONARDO",
        "team": "West Ham",
        "editionTeamId": 27,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 10,
        "name": "ANDRÉ GOMES",
        "team": "Fulham",
        "editionTeamId": 29,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      }
    ]
  },
  {
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "leaders": [
      {
        "position": 1,
        "name": "CARLÃO",
        "team": "COLO COLO",
        "editionTeamId": 49,
        "yellowCards": 3,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 4
      },
      {
        "position": 2,
        "name": "GABRIEL",
        "team": "PENAROL",
        "editionTeamId": 47,
        "yellowCards": 3,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 4
      },
      {
        "position": 3,
        "name": "FAGNER",
        "team": "ATLÉTICO NACIONAL",
        "editionTeamId": 54,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 4,
        "name": "SUMAN",
        "team": "PENAROL",
        "editionTeamId": 47,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 5,
        "name": "EDNALDO",
        "team": "COLO COLO",
        "editionTeamId": 49,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 6,
        "name": "MARCELO HENDLER",
        "team": "RIVER PLATE",
        "editionTeamId": 44,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 7,
        "name": "LÉO REIS",
        "team": "BOTAFOGO",
        "editionTeamId": 46,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 8,
        "name": "LUCAS SANCHES",
        "team": "PENAROL",
        "editionTeamId": 47,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 9,
        "name": "RODRI",
        "team": "BOCA JÚNIORS",
        "editionTeamId": 43,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 10,
        "name": "ABNER",
        "team": "OLÍMPIA",
        "editionTeamId": 53,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      }
    ]
  },
  {
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "leaders": [
      {
        "position": 1,
        "name": "RICARDINHO",
        "team": "SASSUOLO",
        "editionTeamId": 66,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 2,
        "name": "RODRI",
        "team": "JUVENTUS",
        "editionTeamId": 59,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 3,
        "name": "LUCAS GUERREIRO",
        "team": "ROMA",
        "editionTeamId": 63,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 4,
        "name": "PORTUGA",
        "team": "INTER DE MILÃO",
        "editionTeamId": 58,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 5,
        "name": "ROBERTINHO",
        "team": "PARMA",
        "editionTeamId": 62,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 6,
        "name": "RODRIGUINHO",
        "team": "JUVENTUS",
        "editionTeamId": 59,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 7,
        "name": "ALAN",
        "team": "FIORENTINA",
        "editionTeamId": 55,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 8,
        "name": "BOLACHA",
        "team": "BOLOGNA",
        "editionTeamId": 64,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 9,
        "name": "CARLÃO",
        "team": "BOLOGNA",
        "editionTeamId": 64,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 10,
        "name": "EFRAIM",
        "team": "SASSUOLO",
        "editionTeamId": 66,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      }
    ]
  },
  {
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "leaders": [
      {
        "position": 1,
        "name": "BIEL",
        "team": "BRASIL",
        "editionTeamId": 67,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 2,
        "name": "CARLÃO",
        "team": "JAPÃO",
        "editionTeamId": 75,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 3,
        "name": "GENTIL",
        "team": "INGLATERRA",
        "editionTeamId": 73,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 4,
        "name": "LUCAS SANCHES",
        "team": "INGLATERRA",
        "editionTeamId": 73,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 5,
        "name": "LUIZ HENRIQUE",
        "team": "ESPANHÃ",
        "editionTeamId": 72,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 6,
        "name": "RODRI",
        "team": "FRANÇA",
        "editionTeamId": 71,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 7,
        "name": "TIAGO CB",
        "team": "FRANÇA",
        "editionTeamId": 71,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 8,
        "name": "ALAN",
        "team": "ESPANHÃ",
        "editionTeamId": 72,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 9,
        "name": "ÉDIPO",
        "team": "ESPANHÃ",
        "editionTeamId": 72,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 10,
        "name": "LÉO ROPELATO",
        "team": "COSTA DO MARFIM",
        "editionTeamId": 77,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      }
    ]
  },
  {
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "leaders": [
      {
        "position": 1,
        "name": "ÉDIPO",
        "team": "SEVILLA",
        "editionTeamId": 82,
        "yellowCards": 2,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 2,
        "name": "MARANGONI",
        "team": "SEVILLA",
        "editionTeamId": 82,
        "yellowCards": 3,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 3
      },
      {
        "position": 3,
        "name": "TURINI",
        "team": "SEVILLA",
        "editionTeamId": 82,
        "yellowCards": 1,
        "redCards": 1,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 4,
        "name": "ALE",
        "team": "VALÊNCIA",
        "editionTeamId": 81,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 5,
        "name": "DESIATO",
        "team": "ATHLETICO BILBAO",
        "editionTeamId": 88,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 6,
        "name": "EDVALDO",
        "team": "BARCELONA",
        "editionTeamId": 80,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 7,
        "name": "IGOR",
        "team": "ATHLETICO BILBAO",
        "editionTeamId": 88,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 8,
        "name": "J. JÚNIOR",
        "team": "RAYO VALLECANO",
        "editionTeamId": 84,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 9,
        "name": "LUCAS",
        "team": "SEVILLA",
        "editionTeamId": 82,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      },
      {
        "position": 10,
        "name": "RAPHA",
        "team": "BARCELONA",
        "editionTeamId": 80,
        "yellowCards": 2,
        "redCards": 0,
        "blueCards": 0,
        "totalCards": 2
      }
    ]
  }
];

export const HISTORICAL_SCORING_EDITIONS: HistoricalScoringEdition[] = [
  {
    "eventKey": "-ncna_domeuyityn-om1",
    "championship": "COPA DO BRASIL VIW ⚽️",
    "seasonYear": 2023,
    "leaders": [
      {
        "position": 1,
        "name": "LUCAS SANCHES",
        "team": "ATLÉTICO MINEIRO",
        "editionTeamId": 13,
        "goals": 11
      },
      {
        "position": 2,
        "name": "IVAN LOPES",
        "team": "CORITIBA",
        "editionTeamId": 10,
        "goals": 8
      },
      {
        "position": 3,
        "name": "LUIZ BAHIA",
        "team": "BOTAFOGO",
        "editionTeamId": 15,
        "goals": 8
      },
      {
        "position": 4,
        "name": "BRUNO H",
        "team": "FLAMENGO",
        "editionTeamId": 18,
        "goals": 7
      },
      {
        "position": 5,
        "name": "IGOR",
        "team": "FLAMENGO",
        "editionTeamId": 18,
        "goals": 7
      },
      {
        "position": 6,
        "name": "YURICK",
        "team": "ATHLÉTICO PARANAENSE",
        "editionTeamId": 14,
        "goals": 7
      },
      {
        "position": 7,
        "name": "JP",
        "team": "FLAMENGO",
        "editionTeamId": 18,
        "goals": 6
      },
      {
        "position": 8,
        "name": "LEONARDO",
        "team": "BOTAFOGO",
        "editionTeamId": 15,
        "goals": 6
      },
      {
        "position": 9,
        "name": "MEIRELES",
        "team": "FLUMINENSE",
        "editionTeamId": 9,
        "goals": 6
      },
      {
        "position": 10,
        "name": "MOSCA JR",
        "team": "ATHLÉTICO PARANAENSE",
        "editionTeamId": 14,
        "goals": 6
      }
    ]
  },
  {
    "eventKey": "-ntuuhaxhe2_pmjm8fm5",
    "championship": "COPA DO NORDESTE VIW 2023",
    "seasonYear": 2023,
    "leaders": [
      {
        "position": 1,
        "name": "LUCAS SANCHES",
        "team": "SPORT",
        "editionTeamId": 8,
        "goals": 16
      },
      {
        "position": 2,
        "name": "JOÃO PAULO",
        "team": "FORTALEZA",
        "editionTeamId": 3,
        "goals": 12
      },
      {
        "position": 3,
        "name": "FELIPINHO",
        "team": "SANTA CRUZ",
        "editionTeamId": 7,
        "goals": 10
      },
      {
        "position": 4,
        "name": "RONALD",
        "team": "SAMPAIO CORRÊA",
        "editionTeamId": 2,
        "goals": 10
      },
      {
        "position": 5,
        "name": "FÁBIO ZIRONDI",
        "team": "SANTA CRUZ",
        "editionTeamId": 7,
        "goals": 9
      },
      {
        "position": 6,
        "name": "TIAGO BIANCO",
        "team": "VITÓRIA",
        "editionTeamId": 5,
        "goals": 7
      },
      {
        "position": 7,
        "name": "GENTIL",
        "team": "SAMPAIO CORRÊA",
        "editionTeamId": 2,
        "goals": 6
      },
      {
        "position": 8,
        "name": "CAÍQUE",
        "team": "VITÓRIA",
        "editionTeamId": 5,
        "goals": 5
      },
      {
        "position": 9,
        "name": "FRANCISCO THIAGO",
        "team": "CEARÁ",
        "editionTeamId": 4,
        "goals": 5
      },
      {
        "position": 10,
        "name": "IGOR",
        "team": "SAMPAIO CORRÊA",
        "editionTeamId": 2,
        "goals": 5
      }
    ]
  },
  {
    "eventKey": "-4dqvf",
    "championship": "COPA EUROVIW",
    "seasonYear": 2024,
    "leaders": [
      {
        "position": 1,
        "name": "FÁBIO Z",
        "team": "ALEMANHA",
        "editionTeamId": 31,
        "goals": 7
      },
      {
        "position": 2,
        "name": "IGOR",
        "team": "CROÁCIA",
        "editionTeamId": 42,
        "goals": 7
      },
      {
        "position": 3,
        "name": "RODRIGO",
        "team": "UCRÂNIA",
        "editionTeamId": 39,
        "goals": 7
      },
      {
        "position": 4,
        "name": "WILL",
        "team": "UCRÂNIA",
        "editionTeamId": 39,
        "goals": 7
      },
      {
        "position": 5,
        "name": "FÁBIO VITULLO",
        "team": "ALEMANHA",
        "editionTeamId": 31,
        "goals": 6
      },
      {
        "position": 6,
        "name": "GOGO",
        "team": "TURQUIA",
        "editionTeamId": 37,
        "goals": 6
      },
      {
        "position": 7,
        "name": "JÚNIOR",
        "team": "BELGICA",
        "editionTeamId": 32,
        "goals": 6
      },
      {
        "position": 8,
        "name": "LUCAS S",
        "team": "BELGICA",
        "editionTeamId": 32,
        "goals": 6
      },
      {
        "position": 9,
        "name": "ROBERTINHO",
        "team": "TURQUIA",
        "editionTeamId": 37,
        "goals": 6
      },
      {
        "position": 10,
        "name": "ALEF",
        "team": "UCRÂNIA",
        "editionTeamId": 39,
        "goals": 5
      }
    ]
  },
  {
    "eventKey": "-shn4",
    "championship": "PREMIER LEAGUE VIW",
    "seasonYear": 2024,
    "leaders": [
      {
        "position": 1,
        "name": "ROBERTINHO",
        "team": "Arsenal",
        "editionTeamId": 21,
        "goals": 14
      },
      {
        "position": 2,
        "name": "RAFINHA",
        "team": "Brighton",
        "editionTeamId": 30,
        "goals": 10
      },
      {
        "position": 3,
        "name": "BOLACHA",
        "team": "Wolves",
        "editionTeamId": 28,
        "goals": 8
      },
      {
        "position": 4,
        "name": "FELIPE MENEZES",
        "team": "Fulham",
        "editionTeamId": 29,
        "goals": 8
      },
      {
        "position": 5,
        "name": "MEIRELES",
        "team": "West Ham",
        "editionTeamId": 27,
        "goals": 8
      },
      {
        "position": 6,
        "name": "ZIRONDI",
        "team": "Manchester City",
        "editionTeamId": 19,
        "goals": 8
      },
      {
        "position": 7,
        "name": "JEFERSON",
        "team": "Liverpool",
        "editionTeamId": 24,
        "goals": 7
      },
      {
        "position": 8,
        "name": "KAIQUE",
        "team": "Liverpool",
        "editionTeamId": 24,
        "goals": 7
      },
      {
        "position": 9,
        "name": "LUCAS HENRIQUE",
        "team": "Crystal Palace",
        "editionTeamId": 22,
        "goals": 7
      },
      {
        "position": 10,
        "name": "RODRIGO NUNES",
        "team": "Manchester United",
        "editionTeamId": 20,
        "goals": 7
      }
    ]
  },
  {
    "eventKey": "-1xwvs",
    "championship": "COPA LIBERTAVIW",
    "seasonYear": 2025,
    "leaders": [
      {
        "position": 1,
        "name": "DAVID PIMENTA",
        "team": "OLÍMPIA",
        "editionTeamId": 53,
        "goals": 11
      },
      {
        "position": 2,
        "name": "MEIRELLES",
        "team": "BOTAFOGO",
        "editionTeamId": 46,
        "goals": 10
      },
      {
        "position": 3,
        "name": "RODRIGUINHO",
        "team": "BOTAFOGO",
        "editionTeamId": 46,
        "goals": 10
      },
      {
        "position": 4,
        "name": "ALLAN REZENDE",
        "team": "NACIONAL",
        "editionTeamId": 48,
        "goals": 9
      },
      {
        "position": 5,
        "name": "EFRAIM",
        "team": "FLAMENGO",
        "editionTeamId": 45,
        "goals": 9
      },
      {
        "position": 6,
        "name": "ROBERTINHO",
        "team": "OLÍMPIA",
        "editionTeamId": 53,
        "goals": 8
      },
      {
        "position": 7,
        "name": "TIAGO MENDONÇA",
        "team": "OLÍMPIA",
        "editionTeamId": 53,
        "goals": 8
      },
      {
        "position": 8,
        "name": "WILL",
        "team": "COLO COLO",
        "editionTeamId": 49,
        "goals": 8
      },
      {
        "position": 9,
        "name": "IGOR",
        "team": "CERRO PORTEÑO",
        "editionTeamId": 52,
        "goals": 7
      },
      {
        "position": 10,
        "name": "LEONARDO ROPELATO",
        "team": "COLO COLO",
        "editionTeamId": 49,
        "goals": 7
      }
    ]
  },
  {
    "eventKey": "-t22j5",
    "championship": "CAMPEONATO ITALIANO VIW",
    "seasonYear": 2025,
    "leaders": [
      {
        "position": 1,
        "name": "LUCAS SANCHES",
        "team": "NAPOLI",
        "editionTeamId": 61,
        "goals": 13
      },
      {
        "position": 2,
        "name": "ALAN",
        "team": "FIORENTINA",
        "editionTeamId": 55,
        "goals": 12
      },
      {
        "position": 3,
        "name": "RAFINHA",
        "team": "LAZIO",
        "editionTeamId": 60,
        "goals": 9
      },
      {
        "position": 4,
        "name": "RENATO",
        "team": "INTER DE MILÃO",
        "editionTeamId": 58,
        "goals": 7
      },
      {
        "position": 5,
        "name": "EFRAIM",
        "team": "SASSUOLO",
        "editionTeamId": 66,
        "goals": 6
      },
      {
        "position": 6,
        "name": "ROBERTINHO",
        "team": "PARMA",
        "editionTeamId": 62,
        "goals": 6
      },
      {
        "position": 7,
        "name": "THIAGO PESCADOS",
        "team": "INTER DE MILÃO",
        "editionTeamId": 58,
        "goals": 6
      },
      {
        "position": 8,
        "name": "WILL",
        "team": "ROMA",
        "editionTeamId": 63,
        "goals": 6
      },
      {
        "position": 9,
        "name": "ANDRÉ GOMES",
        "team": "JUVENTUS",
        "editionTeamId": 59,
        "goals": 5
      },
      {
        "position": 10,
        "name": "DENNER",
        "team": "BOLOGNA",
        "editionTeamId": 64,
        "goals": 5
      }
    ]
  },
  {
    "eventKey": "-6pgn9",
    "championship": "COPA DO MUNDO VIW 2026",
    "seasonYear": 2026,
    "leaders": [
      {
        "position": 1,
        "name": "ALAN",
        "team": "ESPANHÃ",
        "editionTeamId": 72,
        "goals": 10
      },
      {
        "position": 2,
        "name": "PIMENTA",
        "team": "JAPÃO",
        "editionTeamId": 75,
        "goals": 10
      },
      {
        "position": 3,
        "name": "ZIRONDI",
        "team": "BRASIL",
        "editionTeamId": 67,
        "goals": 10
      },
      {
        "position": 4,
        "name": "LUCCIOLA",
        "team": "ALEMANHÃ",
        "editionTeamId": 70,
        "goals": 9
      },
      {
        "position": 5,
        "name": "FELIPE",
        "team": "PORTUGAL",
        "editionTeamId": 69,
        "goals": 8
      },
      {
        "position": 6,
        "name": "LUCAS SANCHES",
        "team": "INGLATERRA",
        "editionTeamId": 73,
        "goals": 8
      },
      {
        "position": 7,
        "name": "ANDREWS",
        "team": "SENEGAL",
        "editionTeamId": 78,
        "goals": 7
      },
      {
        "position": 8,
        "name": "JORGE",
        "team": "BRASIL",
        "editionTeamId": 67,
        "goals": 7
      },
      {
        "position": 9,
        "name": "R LOURENÇO",
        "team": "KOREA",
        "editionTeamId": 76,
        "goals": 7
      },
      {
        "position": 10,
        "name": "REINALDO",
        "team": "JAPÃO",
        "editionTeamId": 75,
        "goals": 7
      }
    ]
  },
  {
    "eventKey": "-ciddy",
    "championship": "LALIGA VIW 2026 🇪🇸",
    "seasonYear": 2026,
    "leaders": [
      {
        "position": 1,
        "name": "FELIPE",
        "team": "RAYO VALLECANO",
        "editionTeamId": 84,
        "goals": 11
      },
      {
        "position": 2,
        "name": "MELCHIADES",
        "team": "ATLÉTICO DE MADRID",
        "editionTeamId": 89,
        "goals": 8
      },
      {
        "position": 3,
        "name": "RAPHA",
        "team": "BARCELONA",
        "editionTeamId": 80,
        "goals": 7
      },
      {
        "position": 4,
        "name": "EFRAIM",
        "team": "SEVILLA",
        "editionTeamId": 82,
        "goals": 6
      },
      {
        "position": 5,
        "name": "JHOW",
        "team": "VILLAREAL",
        "editionTeamId": 83,
        "goals": 5
      },
      {
        "position": 6,
        "name": "LUCAS",
        "team": "SEVILLA",
        "editionTeamId": 82,
        "goals": 5
      },
      {
        "position": 7,
        "name": "ALAN",
        "team": "REAL SOCIEDAD",
        "editionTeamId": 86,
        "goals": 4
      },
      {
        "position": 8,
        "name": "BLOTTI",
        "team": "ATHLETICO BILBAO",
        "editionTeamId": 88,
        "goals": 4
      },
      {
        "position": 9,
        "name": "BRUNO SALES",
        "team": "RAYO VALLECANO",
        "editionTeamId": 84,
        "goals": 4
      },
      {
        "position": 10,
        "name": "FAGNER",
        "team": "VILLAREAL",
        "editionTeamId": 83,
        "goals": 4
      }
    ]
  }
];
