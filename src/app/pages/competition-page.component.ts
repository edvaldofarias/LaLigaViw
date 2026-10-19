import { MATERIAL } from "../shared/material";
import { Component, inject, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { CompetitionService } from "../core/competition.service";
import { SECTIONS } from "../core/models";
import { GridComponent, GridColumn } from "../shared/grid.component";
import {
  CompactMatchCardComponent,
  teamCrestFallback,
  teamCrestSource,
} from "../shared/compact-match-card.component";
import { RoundCarouselComponent } from "../shared/round-carousel.component";
import { EntityComponent } from "../shared/entity.component";
@Component({
  selector: "app-competition-page",
  standalone: true,
  imports: [
    ...MATERIAL,
    FormsModule,
    NgTemplateOutlet,
    GridComponent,
    CompactMatchCardComponent,
    RoundCarouselComponent,
    EntityComponent,
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
  round = signal("");
  status = signal("");
  overviewRound = signal("");
  selectionId = signal("");
  motmRound = signal<number | null>(null);
  cartolaId = signal("");
  selectedSelection = computed(
    () =>
      this.s.selections.find((x) => x.id === this.selectionId()) ||
      this.s.selections.at(-1),
  );
  motmRounds = computed(() =>
    [...new Set<number>(this.s.awards.map((award) => Number(award.round)))].sort(
      (a, b) => a - b,
    ),
  );
  selectedMotmRound = computed(
    () => this.motmRound() ?? this.motmRounds().at(-1) ?? 0,
  );
  motmAwards = computed(() =>
    this.s.awards.filter(
      (award) => award.round === this.selectedMotmRound(),
    ),
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
          m.m_set === this.selectedMatchesRound() &&
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
  overviewRounds = computed(() =>
    this.s
      .rounds()
      .filter((round) =>
        this.s.matches().some((match) => match.m_set === round.id),
      ),
  );
  selectedOverviewRound = computed(() => {
    const rounds = this.overviewRounds();
    const selected = this.overviewRound();
    if (selected && rounds.some((round) => round.id === selected)) {
      return selected;
    }
    return (
      this.s.upcoming()[0]?.m_set ||
      this.s.latestCompleted() ||
      rounds.at(-1)?.id ||
      ""
    );
  });
  overviewRoundIndex = computed(() =>
    this.overviewRounds().findIndex(
      (round) => round.id === this.selectedOverviewRound(),
    ),
  );
  overviewMatches = computed(() =>
    this.s
      .matches()
      .filter((match) => match.m_set === this.selectedOverviewRound()),
  );
  selectedMatchesRound = computed(() => {
    const rounds = this.overviewRounds();
    const selected = this.round();
    if (selected && rounds.some((item) => item.id === selected)) {
      return selected;
    }
    return (
      this.s.upcoming()[0]?.m_set ||
      this.s.latestCompleted() ||
      rounds.at(-1)?.id ||
      ""
    );
  });
  availableRounds = computed(() => this.s.rounds());
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
  suggestionGroups = computed(() => {
    if (!this.future()) return { ideal: [], avoid: [] };
    const decorate = (players: any[]) =>
      players.map((p) => ({
            ...p,
            confronto:
              this.s.name(this.s.team(p.team)?.name) +
              " × " +
              this.s.name(this.s.team(p.opponentId)?.name),
            averageValue: +p.average.toFixed(1),
            victory: (p.win * 100).toFixed(1) + "%",
          }));
    const groups = this.s.suggestionGroups(this.chosenCartola());
    return {
      ideal: decorate(groups.ideal),
      avoid: decorate(groups.avoid),
    };
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
    { key: "percent", label: "Aprov.", kind: "percent" },
    { key: "played", label: "Jogos" },
    { key: "wins", label: "Vitórias" },
    { key: "draws", label: "Empates" },
    { key: "losses", label: "Derrotas" },
    { key: "gf", label: "Gols pró" },
    { key: "ga", label: "Gols contra" },
    { key: "gd", label: "Saldo" },
  ];
  roundName(id: string) {
    const m = this.s.matches().find((m) => m.m_set === id);
    return m ? this.s.phase(m.fs) + " · " + this.s.round(m) : "Rodada";
  }
  teamCrest(id: string) {
    return teamCrestSource(this.s, id);
  }
  crestFallback(event: Event, id: string) {
    teamCrestFallback(this.s, event, id);
  }
  hasLive = (team: any) => !!team.live;
  cartolaTotal(key: string) {
    return this.cartola()[key].reduce((n: number, p: any) => n + p.total, 0);
  }
  teamEntity(id: string) {
    return { id, ...this.s.team(id) };
  }
  selectedNext(m: any) {
    return this.s.upcoming().some((x) => x.id === m.id);
  }
}
