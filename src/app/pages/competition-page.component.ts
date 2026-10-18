import { MATERIAL } from "../shared/material";
import { Component, inject, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DecimalPipe, NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { CompetitionService } from "../core/competition.service";
import { SECTIONS } from "../core/models";
import { GridComponent, GridColumn } from "../shared/grid.component";
import { MatchCardComponent } from "../shared/match-card.component";
import { EntityComponent } from "../shared/entity.component";
import { ChartComponent } from "../shared/chart.component";
@Component({
  selector: "app-competition-page",
  standalone: true,
  imports: [
    ...MATERIAL,
    FormsModule,
    DecimalPipe,
    NgTemplateOutlet,
    GridComponent,
    MatchCardComponent,
    EntityComponent,
    ChartComponent,
  ],
  templateUrl: "./competition-page.component.html",
})
export class CompetitionPageComponent {
  s = inject(CompetitionService);
  private routeData = toSignal(inject(ActivatedRoute).data);
  view = computed(() => this.routeData()?.["view"] || "overview");
  title = computed(
    () => SECTIONS.find((x) => x[0] === this.view())?.[1] || "Visão geral",
  );
  team = signal("");
  playerStatus = signal("");
  phase = signal("");
  round = signal("");
  status = signal("");
  selectionId = signal("");
  cartolaId = signal("");
  evolutionTeam = signal("");
  selectedSelection = computed(
    () =>
      this.s.selections.find((x) => x.id === this.selectionId()) ||
      this.s.selections.at(-1),
  );
  filteredPlayers = computed(() =>
    this.s
      .players()
      .filter(
        (p) =>
          (!this.team() || p.team === this.team()) &&
          (!this.playerStatus() ||
            (this.playerStatus() === "scorers"
              ? p.stats[0] > 0
              : this.playerStatus() === "cards"
                ? p.stats[14] > 0
                : this.playerStatus() === "red"
                  ? p.stats[16] > 0
                  : !!p.SUSP)),
      )
      .map((p) => ({
        ...p,
        goals: p.stats[0] ?? "—",
        games: p.stats[2],
        yellow: p.stats[14] ?? "—",
        red: p.stats[16] ?? "—",
      }))
      .sort(
        (a, b) =>
          (Number(b.goals) || 0) - (Number(a.goals) || 0) ||
          a.name.localeCompare(b.name, "pt-BR"),
      ),
  );
  mvp = computed(() =>
    this.s
      .ranking()
      .filter((p) => p.active && (!this.team() || p.team === this.team()))
      .map((p) => ({
        ...p,
        goals: p.components.find((c) => c.key === "goals")?.earned || 0,
        cards: p.components
          .filter((c) => ["yellow", "red"].includes(c.key))
          .reduce((n, c) => n + c.earned, 0),
        results: p.components
          .filter((c) => ["wins", "draws", "losses"].includes(c.key))
          .reduce((n, c) => n + c.earned, 0),
        defense: p.components
          .filter((c) =>
            [
              "goalkeeperCleanSheets",
              "outfieldCleanSheets",
              "goalsAgainst",
            ].includes(c.key),
          )
          .reduce((n, c) => n + c.earned, 0),
        prizes: p.components
          .filter((c) => ["motm", "selections"].includes(c.key))
          .reduce((n, c) => n + c.earned, 0),
      })),
  );
  filteredMatches = computed(() =>
    this.s
      .matches()
      .filter(
        (m) =>
          (!this.phase() || m.fs === this.phase()) &&
          (!this.round() || m.m_set === this.round()) &&
          (!this.team() || [m.team1, m.team2].includes(this.team())) &&
          (!this.status() ||
            (this.status() === "done"
              ? this.s.finished(m)
              : this.status() === "live"
                ? this.s.isLive(m)
                : !this.s.finished(m) && !this.s.isLive(m))),
      ),
  );
  standingsRows = computed(() =>
    this.s
      .standings()
      .map((t, i) => ({
        ...t,
        position: t.rank != null ? t.rank + 1 : i + 1,
        g4: this.s.chance(t.id, "top4"),
        g8: this.s.chance(t.id, "top8"),
        _rowClass:
          (t.rank ?? i) < 4
            ? "qualification-quarterfinal"
            : (t.rank ?? i) < 8
              ? "qualification-advantage"
              : "qualification-playoff",
      })),
  );
  availableRounds = computed(() =>
    this.s.rounds().filter(
      (r) =>
        this.s.matches().some((m) => m.m_set === r.id && this.s.finished(m)) ||
        (r.fs === this.s.firstPhase &&
          this.s
            .rounds()
            .filter((x) => x.fs === r.fs)
            .findIndex((x) => x.id === r.id) >= 4 &&
          this.s
            .rounds()
            .filter((x) => x.fs === r.fs)
            .findIndex((x) => x.id === r.id) <= 6),
    ),
  );
  chosenCartola = computed(
    () =>
      this.cartolaId() ||
      this.s.latestCompleted() ||
      this.availableRounds()[0]?.id ||
      "",
  );
  future = computed(() =>
    this.s
      .matches()
      .filter((m) => m.m_set === this.chosenCartola())
      .every((m) => !this.s.finished(m)),
  );
  cartola = computed(() => this.s.cartola(this.chosenCartola()));
  suggestions = computed(() =>
    this.future()
      ? this.s
          .suggestions(this.chosenCartola())
          .map((p) => ({
            ...p,
            confronto:
              this.s.name(this.s.team(p.team)?.name) +
              " × " +
              this.s.name(this.s.team(p.opponentId)?.name),
            averageValue: +p.average.toFixed(1),
            victory: (p.win * 100).toFixed(1) + "%",
          }))
      : [],
  );
  chartSeries = computed(() => {
    const history = this.s.teamHistory();
    return [...this.s.teams()]
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
      .filter((t) => !this.evolutionTeam() || t.id === this.evolutionTeam())
      .map((t) => ({
        name: this.s.name(t.name),
        logo: t.url,
        color:
          this.s.colors[
            this.s.teams().findIndex((x) => x.id === t.id) %
              this.s.colors.length
          ],
        values: (history.get(t.id) || []).map((p) => ({
          round: p.round,
          value: p.rank,
        })),
      }));
  });
  readonly playerColumns: GridColumn[] = [
    { key: "name", label: "Jogador", kind: "player" },
    { key: "team", label: "Equipe", kind: "team" },
    { key: "goals", label: "Gols", kind: "points" },
    { key: "games", label: "Jogos" },
    { key: "yellow", label: "C.AM" },
    { key: "red", label: "C.VM" },
  ];
  readonly mvpColumns: GridColumn[] = [
    { key: "rank", label: "#" },
    { key: "name", label: "Jogador", kind: "player" },
    { key: "team", label: "Equipe", kind: "team" },
    { key: "total", label: "Pontos", kind: "points" },
    { key: "goals", label: "Gols" },
    { key: "cards", label: "Cartões" },
    { key: "results", label: "Resultados" },
    { key: "defense", label: "Defesa" },
    { key: "prizes", label: "Prêmios" },
  ];
  readonly coachColumns: GridColumn[] = [
    { key: "name", label: "Técnico/Professor", kind: "coach" },
    { key: "percent", label: "Aprov.", kind: "points" },
    { key: "played", label: "Jogos" },
    { key: "wins", label: "Vitórias" },
    { key: "draws", label: "Empates" },
    { key: "losses", label: "Derrotas" },
    { key: "gf", label: "Gols pró" },
    { key: "ga", label: "Gols contra" },
    { key: "gd", label: "Saldo" },
  ];
  readonly standingsColumns: GridColumn[] = [
    { key: "position", label: "#", priority: 2 },
    { key: "id", label: "Equipe", kind: "team", priority: 1 },
    { key: "pts", label: "PTS", kind: "points" },
    { key: "j", label: "J" },
    { key: "v", label: "V" },
    { key: "e", label: "E" },
    { key: "d", label: "D" },
    { key: "gp", label: "GP" },
    { key: "gc", label: "GC" },
    { key: "sg", label: "SG" },
    { key: "percent", label: "Aprov." },
    { key: "g4", label: "Chance G4" },
    { key: "g8", label: "Chance G8" },
    { key: "form", label: "Últimos", kind: "form" },
  ];
  readonly cartolaColumns: GridColumn[] = [
    { key: "name", label: "Jogador", kind: "player" },
    { key: "team", label: "Equipe", kind: "team" },
    { key: "total", label: "Pontos", kind: "points" },
  ];
  readonly suggestionColumns: GridColumn[] = [
    { key: "name", label: "Jogador", kind: "player" },
    { key: "confronto", label: "Confronto", kind: "matchup" },
    { key: "averageValue", label: "Média MVP", kind: "points" },
  ];
  roundName(id: string) {
    const m = this.s.matches().find((m) => m.m_set === id);
    return m ? this.s.phase(m.fs) + " · " + this.s.round(m) : "Rodada";
  }
  hasLive = (t: any) => !!t.live;
  cartolaTotal(key: string) {
    return this.cartola()[key].reduce((n: number, p: any) => n + p.total, 0);
  }
  selectedNext(m: any) {
    return this.s.upcoming().some((x) => x.id === m.id);
  }
}
