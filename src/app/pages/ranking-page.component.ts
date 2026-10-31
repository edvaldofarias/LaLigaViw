import {
  Component,
  computed,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MATERIAL } from "../shared/material";
import {
  HISTORICAL_TEAM_STATISTICS,
  HistoricalTeamStatistic,
} from "../core/historical-team-statistics-data";

@Component({
  selector: "app-ranking-page",
  standalone: true,
  imports: [...MATERIAL, FormsModule],
  templateUrl: "./ranking-page.component.html",
})
export class RankingPageComponent {
  readonly rows = signal<HistoricalTeamStatistic[]>(HISTORICAL_TEAM_STATISTICS);
  readonly search = signal("");
  readonly eventKey = signal("");
  readonly loading = signal(false);
  readonly error = signal("");
  readonly competitions = computed(() => [
    ...new Map(
      this.rows().map((row) => [
        row.eventKey,
        {
          eventKey: row.eventKey,
          label: `${row.championship} ${row.seasonYear}`,
        },
      ]),
    ).values(),
  ]);
  readonly filtered = computed(() => {
    const search = this.normalize(this.search());
    return this.rows().filter(
      (row) =>
        (!this.eventKey() || row.eventKey === this.eventKey()) &&
        (!search ||
          this.normalize(this.teamLabel(row)).includes(search)),
    );
  });
  readonly podium = computed(() => this.filtered().slice(0, 3));
  readonly totalMatches = computed(
    () =>
      this.rows().reduce((total, row) => total + row.matches, 0) / 2,
  );
  readonly totalPoints = computed(() =>
    this.rows().reduce((total, row) => total + row.points, 0),
  );

  teamLabel(row: HistoricalTeamStatistic) {
    const competition = row.championship
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
    return `${row.team} (${competition}${competition.includes(String(row.seasonYear)) ? "" : ` ${row.seasonYear}`})`;
  }

  placementLabel(placement: 1 | 2 | 3) {
    return placement === 1
      ? "Campeão"
      : placement === 2
        ? "Vice-campeão"
        : "Terceiro colocado";
  }

  private normalize(value: string) {
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  }

}
