import { TemplateRef } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { MATERIAL } from "./material";
import {
  Component,
  inject,
  computed,
  signal,
  viewChild,
  ElementRef,
  afterRenderEffect,
  DestroyRef,
} from "@angular/core";
import { CompetitionService } from "../core/competition.service";
import { EntityComponent } from "./entity.component";
import { GridComponent, GridColumn } from "./grid.component";
import { ChartComponent } from "./chart.component";
import { MatchCardComponent } from "./match-card.component";
import { makeMatchFlyer } from "../../../dist/match-flyer.mjs";
import { makeMotmPoster } from "../../../dist/motm-poster.mjs";
import { parseStats } from "../core/models";
@Component({
  selector: "app-detail",
  standalone: true,
  imports: [
    MatDialogModule,
    ...MATERIAL,
    EntityComponent,
    GridComponent,
    ChartComponent,
    MatchCardComponent,
  ],
  templateUrl: "./detail.component.html",
})
export class DetailComponent {
  s = inject(CompetitionService);
  dialog = viewChild.required<TemplateRef<any>>("dialog");
  private dialogs = inject(MatDialog);
  private ref?: MatDialogRef<any>;
  art = signal("");
  artError = signal("");
  private activeArt = "";
  private generation = 0;
  selected = computed(() => this.s.detail());
  player = computed(() => this.s.player(this.selected()?.id || ""));
  score = computed(() =>
    this.s.ranking().find((p) => p.id === this.selected()?.id),
  );
  team = computed(() =>
    this.s.standings().find((t) => t.id === this.selected()?.id),
  );
  coach = computed(() =>
    this.s.staff().find((c) => c.id === this.selected()?.id),
  );
  match = computed(() => this.s.match(this.selected()?.id || ""));
  roster = computed(() =>
    this.s
      .players()
      .filter((p) => p.team === this.selected()?.id)
      .map((p) => ({
        ...p,
        goals: p.stats[0] ?? "—",
        games: p.stats[2],
        yellow: p.stats[14] ?? "—",
        red: p.stats[16] ?? "—",
      })),
  );
  teamMatches = computed(() =>
    this.s
      .matches()
      .filter((m) => [m.team1, m.team2].includes(this.selected()?.id)),
  );
  teamCoaches = computed(() =>
    this.s
      .staff()
      .filter((c) => c.games.some((g) => g.teamId === this.selected()?.id)),
  );
  coachTeams = computed(() =>
    [...new Set((this.coach()?.games || []).map((g) => g.teamId))].map(
      (id) => ({ ...this.s.team(id as string), id }),
    ),
  );
  history = computed(() =>
    this.selected()?.kind === "player"
      ? this.s.history(this.selected()!.id)
      : [],
  );
  pointsChart = computed(() => [
    {
      name: "Pontos da rodada",
      color: "#527428",
      values: this.history().map((p) => ({ round: p.round, value: p.points })),
    },
  ]);
  rankChart = computed(() => [
    {
      name: "Posição no MVP",
      color: "#2563eb",
      values: this.history().map((p) => ({ round: p.round, value: p.rank })),
    },
  ]);
  playerAwards = computed(() =>
    this.s.awards.filter((a) => a.playerId === this.selected()?.id),
  );
  playerSelections = computed(() =>
    this.s.selections.filter((r) =>
      r.players.some((p) => p.playerId === this.selected()?.id),
    ),
  );
  phases = computed(() =>
    Object.entries(this.player()?.fs || {}).map(([id, raw]: [string, any]) => ({
      id,
      phase: this.s.phase(id),
      goals: parseStats(raw.dt)[0] ?? 0,
      games: this.player()?.appearances?.byPhase[id] || 0,
      yellow: parseStats(raw.dt)[14] ?? 0,
      red: parseStats(raw.dt)[16] ?? 0,
    })),
  );
  readonly playerColumns: GridColumn[] = [
    { key: "name", label: "Jogador", kind: "player" },
    { key: "goals", label: "Gols" },
    { key: "games", label: "Jogos" },
    { key: "yellow", label: "C.AM" },
    { key: "red", label: "C.VM" },
  ];
  readonly phaseColumns: GridColumn[] = [
    { key: "phase", label: "Fase" },
    { key: "goals", label: "Gols" },
    { key: "games", label: "Jogos" },
    { key: "yellow", label: "C.AM" },
    { key: "red", label: "C.VM" },
  ];
  constructor() {
    afterRenderEffect(() => {
      const selected = this.s.detail();
      if (selected) {
        if (!this.ref) {
          const ref = this.dialogs.open(this.dialog(), {
            width: "960px",
            ariaLabelledBy: "detail-title",
            maxWidth: "96vw",
            maxHeight: "92dvh",
            autoFocus: false,
            restoreFocus: true,
            panelClass: "competition-dialog",
          });
          this.ref = ref;
          ref.afterClosed().subscribe(() => {
            if (this.ref === ref) {
              this.ref = undefined;
              this.s.close();
            }
          });
        }
        if (selected.kind === "art" && this.activeArt !== selected.id) {
          this.activeArt = selected.id;
          void this.generateArt(selected.id);
        }
      } else {
        const ref = this.ref;
        this.ref = undefined;
        ref?.close();
        this.activeArt = "";
        this.clearArt();
      }
    });
    inject(DestroyRef).onDestroy(() => {
      this.ref?.close();
      this.clearArt();
    });
  }
  close() {
    this.s.close();
  }
  private clearArt() {
    this.generation++;
    if (this.art()) URL.revokeObjectURL(this.art());
    this.art.set("");
  }
  async generateArt(id: string) {
    this.clearArt();
    this.artError.set("");
    const generation = this.generation;
    try {
      const [kind, matchId] = id.split(":"),
        m = this.s.match(matchId);
      if (!m) throw Error("Partida não encontrada");
      const canvas =
        kind === "motm"
          ? await makeMotmPoster(m, this.s.data(), this.s.award(matchId))
          : await makeMatchFlyer(m, this.s.data(), this.s.round(m));
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(Error("Não foi possível gerar a imagem")),
          "image/png",
        ),
      );
      if (generation !== this.generation) return;
      this.art.set(URL.createObjectURL(blob));
    } catch (e) {
      if (generation === this.generation)
        this.artError.set(
          e instanceof Error ? e.message : "Não foi possível gerar a imagem.",
        );
    }
  }
  summary() {
    return this.match() ? this.s.summary(this.match()) : null;
  }
  artIsMotm() {
    return this.selected()?.id.startsWith("motm:");
  }
  isNext(m: any) {
    return this.s.upcoming().some((x) => x.id === m.id);
  }
  courtNumber(m: any) {
    return Number(String(m.title || "").match(/[12]/)?.[0]) || 0;
  }
  coachGameCount(c: any) {
    return c.games.filter((g) => g.teamId === this.selected()?.id).length;
  }
}
