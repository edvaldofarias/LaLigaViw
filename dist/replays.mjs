export const REPLAY_PLAYLIST_URL =
  'https://www.youtube.com/playlist?list=PLAnm2-TwxnXw';

export const matchReplays = [
  {matchId:'1780480362137',videoId:'BU53uVFOEvk'},
  {matchId:'1786231624057',videoId:'p-7TQ9qeBjM'},
  {matchId:'1786231624682',videoId:'hhK1h7D7gVA'},
  {matchId:'1786231625365',videoId:'E3p6jEOUY9g'},
  {matchId:'1786231626282',videoId:'FoiQJv7R-tg'},
  {matchId:'1780480363729',videoId:'1Yu5Q6Lyr8Y'},
  {matchId:'1786231940049',videoId:'g86_O4lvZ04'},
  {matchId:'1786231940683',videoId:'gOcBgXKSy80'},
  {matchId:'1786231941308',videoId:'lHaHdEM-Jko'},
  {matchId:'1786231942016',videoId:'mIK3Q4uVQMU'},
  {matchId:'1780480364862',videoId:'If7GtpI8k-Q'},
  {matchId:'1786235077995',videoId:'dDZdliyj2Ss'},
  {matchId:'1786235078628',videoId:'PshsE6veyUc'},
  {matchId:'1786235079278',videoId:'1isIm6I4L5Y'},
  {matchId:'1786235079970',videoId:'IJXz3mNOXRk'},
  {matchId:'1780480365913',videoId:'olTti_xnDp0'},
  {matchId:'1786245748227',videoId:'p_II_K54zUE'},
  {matchId:'1786245748918',videoId:'xfyeN6lwfWM'},
  {matchId:'1786245750160',videoId:'FXqfzJUoKMM'},
  {matchId:'1786246233389',videoId:'8RDvZhIM4dc'},
  {matchId:'1780480367054',videoId:'f0NHwMKBP4c'},
  {matchId:'1786246792371',videoId:'p8-XJPyM0tE'},
  {matchId:'1786246792897',videoId:'8vpaZa63fSY'},
  {matchId:'1786246793447',videoId:'D3GOr_R3VbQ'},
  {matchId:'1786246794080',videoId:'JAKJU7i_B4w'},
].map(replay => ({
  ...replay,
  embedUrl: `https://www.youtube-nocookie.com/embed/${replay.videoId}`,
  watchUrl: `https://www.youtube.com/watch?v=${replay.videoId}&list=PLAnm2-TwxnXw`,
}));

const replayByMatch = new Map(matchReplays.map(replay => [replay.matchId,replay]));

export function replayForMatch(matchId) {
  return replayByMatch.get(String(matchId)) || null;
}
