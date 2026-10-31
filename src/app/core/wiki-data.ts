export interface WikiCampaign {
  eventKey: string;
  competition: string;
  season: string;
  period: string;
  team: string;
  teamCrest: string;
  playerPhoto: string;
  competitionLogo: string;
  ongoing: boolean;
  position: number;
  positionLabel: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  yellowCards: number;
  redCards: number;
  goalsFor: number;
  goalsAgainst: number;
}

export const EDVALDO_WIKI = {
  name: "Edvaldo",
  canonicalId: 1,
  currentPhoto:
    "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fplayer%2F1789172821599.jpg?alt=media&token=1&m=1789198842934",
  summary: {
    competitions: 4,
    teams: 4,
    matches: 30,
    wins: 16,
    draws: 4,
    losses: 10,
    goals: 9,
    yellowCards: 2,
    redCards: 0,
  },
  campaigns: [
    {
      eventKey: "-1xwvs",
      competition: "Copa LibertaViw",
      season: "2025",
      period: "Primeiro semestre",
      team: "Independiente del Valle",
      teamCrest:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2F8C4D4A74-72D8-49AE-A104-88F40D1B77C1-2544-0000017EDDC25795.png?alt=media",
      playerPhoto:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-1xwvs%2Fplayer%2F1740282423158.jpg?alt=media&token=1&m=1742692592564",
      competitionLogo:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/evts%2F-1xwvs%2F4EC65A51-04F2-454B-A9B9-C42F851BF54B-970-0000003655C338E4.png?alt=media",
      ongoing: false,
      position: 8,
      positionLabel: "8º lugar",
      matches: 7,
      wins: 4,
      draws: 2,
      losses: 1,
      goals: 3,
      yellowCards: 0,
      redCards: 0,
      goalsFor: 19,
      goalsAgainst: 14,
    },
    {
      eventKey: "-t22j5",
      competition: "Campeonato Italiano VIW",
      season: "2025",
      period: "Segundo semestre",
      team: "Inter de Milão",
      teamCrest:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fteams%2F-OSOKadg1NW5IlAeTEHG.jpg?alt=media&token=1&m=1751864039394",
      playerPhoto:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Fplayer%2F1754797262688.jpg?alt=media&token=1&m=1757821308620",
      competitionLogo:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-t22j5%2Finfo.png?alt=media&token=1&m=1750262368732",
      ongoing: false,
      position: 2,
      positionLabel: "Vice-campeão",
      matches: 9,
      wins: 7,
      draws: 0,
      losses: 2,
      goals: 3,
      yellowCards: 0,
      redCards: 0,
      goalsFor: 25,
      goalsAgainst: 12,
    },
    {
      eventKey: "-6pgn9",
      competition: "Copa do Mundo VIW",
      season: "2026",
      period: "Primeiro semestre",
      team: "Portugal",
      teamCrest:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fteams%2F-OjZ3qbqDLwRqSgPL2by.png?alt=media&token=1&m=1769058346637",
      playerPhoto:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Fplayer%2F1773498715966.jpg?alt=media&token=1&m=1774111882143",
      competitionLogo:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-6pgn9%2Finfo.png?alt=media&token=1&m=1769057895553",
      ongoing: false,
      position: 3,
      positionLabel: "3º lugar",
      matches: 9,
      wins: 2,
      draws: 1,
      losses: 6,
      goals: 1,
      yellowCards: 0,
      redCards: 0,
      goalsFor: 24,
      goalsAgainst: 33,
    },
    {
      eventKey: "-ciddy",
      competition: "LaLiga VIW",
      season: "2026",
      period: "Segundo semestre",
      team: "Barcelona",
      teamCrest:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fteams%2F-OuCE2n4ni8czw1OPXtQ.png?alt=media&token=1&m=1780486248020",
      playerPhoto:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Fplayer%2F1789172821599.jpg?alt=media&token=1&m=1789198842934",
      competitionLogo:
        "https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-ciddy%2Finfo.png?alt=media&token=1&m=1780485943228",
      ongoing: true,
      position: 2,
      positionLabel: "2º lugar atual",
      matches: 5,
      wins: 3,
      draws: 1,
      losses: 1,
      goals: 2,
      yellowCards: 2,
      redCards: 0,
      goalsFor: 17,
      goalsAgainst: 18,
    },
  ] satisfies WikiCampaign[],
};
