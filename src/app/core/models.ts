export type Entity = Record<string, any> & { id: string; name?: string };
export interface CompetitionData {
  teams: Record<string, any>;
  player: Record<string, any>;
  matchs: Record<string, any>;
  matchDetails?: Record<string, any>;
  fetchedAt?: string;
}
export interface DetailSelection {
  kind: "player" | "team" | "match" | "coach" | "art";
  id: string;
}
export const FIRST_PHASE = "1780479913323";
export const PHASE_NAMES: Record<string, string> = {
  "1780479913323": "Primeira Fase",
  "1780479913324": "Repescagem",
  "1780480689653": "Quartas de Finais",
  "1780480702080": "Semi Finais",
  "1780480718514": "Grande FINAL",
};
export const SECTIONS = [
  ["overview", "Visão geral"],
  ["matches", "Partidas"],
  ["simulation", "Simulação"],
  ["voting", "Votação secreta"],
  ["pool", "Bolão"],
  ["teams", "Equipes"],
  ["players", "Jogadores"],
  ["statistics", "Estatísticas"],
  ["selection", "Seleção da rodada"],
  ["motm", "Melhor em campo"],
  ["coaches", "Técnicos"],
  ["ballon", "MVP"],
  ["cartola", "CARTOLA"],
  ["user", "Usuário"],
];
export const displayName = (s: any) =>
  String(s ?? "A definir")
    .trim()
    .toLocaleLowerCase("pt-BR")
    .replace(/(^|\s)\S/g, (c) => c.toLocaleUpperCase("pt-BR"));
export const parseStats = (s: any): Record<string, number> =>
  Object.fromEntries(
    String(s ?? "")
      .split("#")
      .filter((v) => v.includes("="))
      .map((v) => {
        const [k, n] = v.split("=");
        return [k, Number(n) || 0];
      }),
  );
export const finished = (m: any) => Number(m?.st) === 3 || !!m?.finished;
export const scored = (m: any) =>
  [m?.dt?.qt_g1, m?.dt?.qt_g2].every(Number.isFinite);
