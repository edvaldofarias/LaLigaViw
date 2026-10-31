import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink, RouterLinkActive } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  HISTORICAL_DISCIPLINE_EDITIONS,
  HISTORICAL_SCORING_EDITIONS,
  HISTORICAL_TEAM_STATISTICS,
  HistoricalDisciplineEdition,
  HistoricalScoringEdition,
  HistoricalTeamStatistic,
} from "../core/historical-team-statistics-data";
import { MATERIAL } from "../shared/material";

@Component({
  selector: "app-historical-statistics-page",
  standalone: true,
  imports: [...MATERIAL, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: "./historical-statistics-page.component.html",
})
export class HistoricalStatisticsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly rows = HISTORICAL_TEAM_STATISTICS;
  readonly tabs = [
    { view: "duplas", label: "Duplas artilheiras" },
    { view: "ataques", label: "Melhores ataques" },
    { view: "defesas", label: "Melhores defesas" },
    { view: "jogos-sem-sofrer", label: "Jogos sem sofrer gols" },
    { view: "invencibilidade", label: "Invencibilidade" },
    { view: "cartoes", label: "Cartões por equipe" },
    { view: "cartoes-jogadores", label: "Cartões por jogador" },
    { view: "artilheiros", label: "Artilheiros por Copa" },
  ];
  readonly view = computed(() => this.routeParams().get("view") ?? "duplas");
  readonly search = signal("");
  readonly eventKey = signal("");
  readonly competitions = [
    ...new Map(
      this.rows.map((row) => [
        row.eventKey,
        {
          eventKey: row.eventKey,
          label: this.competitionLabel(row),
        },
      ]),
    ).values(),
  ];
  readonly filtered = computed(() => {
    const search = this.normalize(this.search());
    return this.rows.filter(
      (row) =>
        (!this.eventKey() || row.eventKey === this.eventKey()) &&
        (!search ||
          this.normalize(this.teamLabel(row)).includes(search) ||
          row.duo.some((player) =>
            this.normalize(player.name).includes(search),
          )),
    );
  });
  readonly duoRanking = computed(() =>
    [...this.filtered()].sort(
      (a, b) =>
        a.duoRank - b.duoRank ||
        a.ranking - b.ranking,
    ),
  );
  readonly attackRanking = computed(() =>
    [...this.filtered()].sort((a, b) => a.attackRank - b.attackRank),
  );
  readonly defenseRanking = computed(() =>
    [...this.filtered()].sort((a, b) => a.defenseRank - b.defenseRank),
  );
  readonly unbeatenRanking = computed(() =>
    [...this.filtered()].sort(
      (a, b) =>
        b.unbeatenStreak - a.unbeatenStreak ||
        a.ranking - b.ranking,
    ),
  );
  readonly cleanSheetRanking = computed(() =>
    [...this.filtered()].sort(
      (a, b) =>
        b.cleanSheets - a.cleanSheets ||
        a.defenseRank - b.defenseRank,
    ),
  );
  readonly cardRanking = computed(() =>
    [...this.filtered()].sort(
      (a, b) =>
        a.cardRank - b.cardRank ||
        a.ranking - b.ranking,
    ),
  );
  readonly disciplineEditions = computed(() =>
    this.filterEditions(HISTORICAL_DISCIPLINE_EDITIONS),
  );
  readonly scoringEditions = computed(() =>
    this.filterEditions(HISTORICAL_SCORING_EDITIONS),
  );

  teamLabel(row: HistoricalTeamStatistic) {
    return `${row.team} (${this.competitionLabel(row)})`;
  }

  competitionLabel(row: HistoricalTeamStatistic) {
    const competition = row.championship
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
    return `${competition}${competition.includes(String(row.seasonYear)) ? "" : ` ${row.seasonYear}`}`;
  }

  editionLabel(
    edition: HistoricalDisciplineEdition | HistoricalScoringEdition,
  ) {
    const competition = edition.championship
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
    return `${competition}${competition.includes(String(edition.seasonYear)) ? "" : ` ${edition.seasonYear}`}`;
  }

  teamById(editionTeamId: number) {
    return this.rows.find((row) => row.editionTeamId === editionTeamId)!;
  }

  editionOngoing(eventKey: string) {
    return this.rows.some(
      (row) => row.eventKey === eventKey && row.ongoing,
    );
  }

  private filterEditions<
    T extends HistoricalDisciplineEdition | HistoricalScoringEdition,
  >(editions: T[]) {
    const search = this.normalize(this.search());
    return editions
      .filter((edition) => !this.eventKey() || edition.eventKey === this.eventKey())
      .map((edition) => ({
        ...edition,
        leaders: edition.leaders.filter(
          (leader) =>
            !search ||
            this.normalize(`${leader.name} ${leader.team}`).includes(search),
        ),
      }))
      .filter((edition) => !search || edition.leaders.length > 0);
  }

  private normalize(value: string) {
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  }
}
