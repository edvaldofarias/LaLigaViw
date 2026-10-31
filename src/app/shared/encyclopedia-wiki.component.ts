import { Component, computed, input } from "@angular/core";

interface EncyclopediaCampaign {
  eventKey: string;
  competition: string;
  season: string | number;
  period: string;
  team: string;
  teamCrest: string;
  playerPhoto: string;
  ongoing: boolean;
  positionLabel?: string;
  finish?: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  yellowCards?: number;
  redCards?: number;
  goalsFor: number;
  goalsAgainst: number;
}

interface EncyclopediaSource {
  name: string;
  canonicalId: number;
  activeSince?: number;
  currentPhoto: string;
  summary: {
    competitions: number;
    teams: number;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    goals: number;
    yellowCards: number;
    redCards: number;
  };
  campaigns: readonly EncyclopediaCampaign[];
  records?: {
    biggestWin?: string;
    biggestWinCompetition?: string;
    biggestLoss?: string;
    biggestLossCompetition?: string;
  };
}

@Component({
  selector: "app-encyclopedia-wiki",
  standalone: true,
  templateUrl: "./encyclopedia-wiki.component.html",
})
export class EncyclopediaWikiComponent {
  readonly source = input.required<EncyclopediaSource>();
  readonly campaigns = computed(() => this.source().campaigns);
  readonly currentCampaign = computed(() => this.campaigns().at(-1)!);
  readonly points = computed(
    () => this.source().summary.wins * 3 + this.source().summary.draws,
  );
  readonly performance = computed(() =>
    Math.round(
      (this.points() / (this.source().summary.matches * 3)) * 100,
    ),
  );
  readonly winRate = computed(() =>
    (
      (this.source().summary.wins / this.source().summary.matches) *
      100
    ).toFixed(1),
  );
  readonly unbeatenRate = computed(() =>
    (
      ((this.source().summary.wins + this.source().summary.draws) /
        this.source().summary.matches) *
      100
    ).toFixed(1),
  );
  readonly goalsPerMatch = computed(() =>
    (this.source().summary.goals / this.source().summary.matches).toFixed(2),
  );
  readonly goalsFor = computed(() =>
    this.campaigns().reduce((total, campaign) => total + campaign.goalsFor, 0),
  );
  readonly goalsAgainst = computed(() =>
    this.campaigns().reduce(
      (total, campaign) => total + campaign.goalsAgainst,
      0,
    ),
  );
  readonly goalDifference = computed(
    () => this.goalsFor() - this.goalsAgainst(),
  );
  readonly bestScoringCampaign = computed(() =>
    this.campaigns().reduce((best, campaign) =>
      campaign.goals > best.goals ? campaign : best,
    ),
  );
  readonly bestFinish = computed(
    () =>
      this.campaigns().find((campaign) =>
        ["Campeão", "Vice-campeão", "3º lugar", "4º lugar"].some((finish) =>
          this.finishLabel(campaign).includes(finish),
        ),
      ) ?? this.bestScoringCampaign(),
  );

  teamLabel(campaign: EncyclopediaCampaign) {
    const competition = campaign.competition
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .trim();
    const year = String(campaign.season);
    return `${campaign.team} (${competition}${competition.includes(year) ? "" : ` ${year}`})`;
  }

  finishLabel(campaign: EncyclopediaCampaign) {
    return campaign.positionLabel ?? campaign.finish ?? "Participação";
  }

  campaignPoints(campaign: EncyclopediaCampaign) {
    return campaign.wins * 3 + campaign.draws;
  }

  campaignPerformance(campaign: EncyclopediaCampaign) {
    return Math.round(
      (this.campaignPoints(campaign) / (campaign.matches * 3)) * 100,
    );
  }
}
