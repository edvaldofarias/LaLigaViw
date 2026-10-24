import {
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MATERIAL } from "../shared/material";
import { CompetitionService } from "../core/competition.service";
import {
  PoolPrediction,
  PoolRankingEntry,
  PoolResult,
  PoolService,
} from "../core/pool.service";
import { VotingService } from "../core/voting.service";
import {
  teamCrestFallback,
  teamCrestSource,
} from "../shared/compact-match-card.component";

type EditablePrediction = {
  homeScore?: number;
  awayScore?: number;
};

@Component({
  selector: "app-pool-page",
  standalone: true,
  imports: [...MATERIAL, FormsModule, RouterLink],
  templateUrl: "./pool-page.component.html",
})
export class PoolPageComponent {
  readonly s = inject(CompetitionService);
  readonly voting = inject(VotingService);
  private readonly pool = inject(PoolService);
  private readonly destroyRef=inject(DestroyRef);
  private rankingLoading=false;
  readonly predictions = signal<Record<string, EditablePrediction>>({});
  readonly ranking = signal<PoolRankingEntry[]>([]);
  readonly expandedPlayer = signal<number | null>(null);
  readonly busy = signal(false);
  readonly feedback = signal("");
  readonly upcomingMatches = computed(() => this.s.upcoming());
  readonly roundId = computed(() => this.upcomingMatches()[0]?.m_set || "");
  readonly lockAt = computed(() =>
    Math.min(
      ...this.upcomingMatches().map((match) => Number(match.d_i) || Infinity),
    ),
  );
  readonly open = computed(
    () => !!this.roundId() && Date.now() < this.lockAt(),
  );

  constructor() {
    afterNextRender(async () => {
      const timer=setInterval(()=>{if(!document.hidden)void this.loadRanking();},15000);
      this.destroyRef.onDestroy(()=>clearInterval(timer));
      await this.voting.initialize();
      await this.loadRanking();
    });
    effect(() => {
      if (this.voting.credential() && this.roundId()) void this.loadEntry();
    });
  }

  setScore(matchId: string, side: "homeScore" | "awayScore", value: number) {
    this.predictions.update((predictions) => ({
      ...predictions,
      [matchId]: { ...predictions[matchId], [side]: value },
    }));
  }

  prediction(matchId: string) {
    return this.predictions()[matchId] || {};
  }

  togglePlayer(position: number) {
    this.expandedPlayer.update((current) =>
      current === position ? null : position,
    );
  }

  resultLabel(result: PoolResult) {
    if (result.exact) return "Placar exato";
    return result.correct ? "Acertou" : "Errou";
  }

  teamCrest(id: string) {
    return teamCrestSource(this.s, id);
  }

  crestFallback(event: Event, id: string) {
    teamCrestFallback(this.s, event, id);
  }

  async submit() {
    if (!this.voting.credential()) {
      this.feedback.set("Entre com o Google para participar do bolão.");
      return;
    }
    const predictions: PoolPrediction[] = Object.entries(this.predictions())
      .filter(
        ([, prediction]) =>
          Number.isInteger(prediction.homeScore) &&
          Number.isInteger(prediction.awayScore),
      )
      .map(([matchId, prediction]) => ({
        matchId,
        homeScore: prediction.homeScore!,
        awayScore: prediction.awayScore!,
      }));
    if (predictions.length < 1) {
      this.feedback.set("Informe pelo menos um placar.");
      return;
    }
    this.busy.set(true);
    try {
      const result = await this.pool.save(
        this.roundId(),
        predictions,
      );
      this.feedback.set(
        `${result.saved} palpite(s) salvos. Você pode editar até o início da rodada.`,
      );
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  private async loadEntry() {
    try {
      const entry = await this.pool.entry(this.roundId());
      this.predictions.set(
        Object.fromEntries(
          entry.predictions.map((prediction) => [
            prediction.matchId,
            {
              homeScore: prediction.homeScore,
              awayScore: prediction.awayScore,
            },
          ]),
        ),
      );
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
    }
  }

  private async loadRanking() {
    if(this.rankingLoading)return;
    this.rankingLoading=true;
    try {
      this.ranking.set((await this.pool.ranking()).ranking);
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
    } finally { this.rankingLoading=false; }
  }
}
