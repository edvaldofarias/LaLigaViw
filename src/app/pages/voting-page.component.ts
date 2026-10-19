import {
  Component,
  computed,
  effect,
  inject,
  signal,
  afterNextRender,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MATERIAL } from "../shared/material";
import { CompetitionService } from "../core/competition.service";
import { VotingService } from "../core/voting.service";
import {
  teamCrestFallback,
  teamCrestSource,
} from "../shared/compact-match-card.component";
import {
  entityImageFallback,
  entityImageSource,
} from "../shared/entity.component";

@Component({
  selector: "app-voting-page",
  standalone: true,
  imports: [...MATERIAL, FormsModule],
  templateUrl: "./voting-page.component.html",
})
export class VotingPageComponent {
  readonly s = inject(CompetitionService);
  readonly voting = inject(VotingService);
  readonly roundId = signal("");
  readonly matchId = signal("");
  readonly team1BestPlayerId = signal("");
  readonly team1WorstPlayerId = signal("");
  readonly team2BestPlayerId = signal("");
  readonly team2WorstPlayerId = signal("");
  readonly result = signal<any>(null);
  readonly busy = signal(false);
  readonly feedback = signal("");
  readonly match = computed(() => this.s.match(this.matchId()));
  readonly availableRounds = computed(() =>
    this.s
      .rounds()
      .filter((round) =>
        this.s
          .matches()
          .some(
            (match) => match.m_set === round.id && this.s.finished(match),
          ),
      ),
  );
  readonly selectedRound = computed(() => {
    const selected = this.roundId();
    if (this.availableRounds().some((round) => round.id === selected))
      return selected;
    return (
      this.s.latestCompleted() ||
      this.availableRounds().at(-1)?.id ||
      ""
    );
  });
  readonly roundMatches = computed(() =>
    this.s
      .matches()
      .filter(
        (match) =>
          match.m_set === this.selectedRound() && this.s.finished(match),
      ),
  );
  readonly eligiblePlayers = computed(() => {
    const match = this.match();
    if (!match) return [];
    return this.s
      .players()
      .filter((player) => [match.team1, match.team2].includes(player.team))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  });
  readonly team1Players = computed(() => {
    const match = this.match();
    return match
      ? this.eligiblePlayers().filter((player) => player.team === match.team1)
      : [];
  });
  readonly team2Players = computed(() => {
    const match = this.match();
    return match
      ? this.eligiblePlayers().filter((player) => player.team === match.team2)
      : [];
  });

  constructor() {
    afterNextRender(() => this.voting.initialize());
    effect(() => {
      this.matchId();
      this.team1BestPlayerId.set("");
      this.team1WorstPlayerId.set("");
      this.team2BestPlayerId.set("");
      this.team2WorstPlayerId.set("");
      this.result.set(null);
      this.feedback.set("");
    });
    effect(() => {
      this.selectedRound();
      this.matchId.set("");
    });
  }

  matchLabel(match: any) {
    return `${this.s.name(this.s.team(match.team1)?.name)} × ${this.s.name(this.s.team(match.team2)?.name)} · ${this.s.date(match)}`;
  }

  roundLabel(round: any) {
    const match = this.s.matches().find((item) => item.m_set === round.id);
    return match
      ? `${this.s.phase(round.fs)} · ${this.s.round(match)}`
      : this.s.phase(round.fs);
  }

  teamCrest(id: string) {
    return teamCrestSource(this.s, id);
  }

  crestFallback(event: Event, id: string) {
    teamCrestFallback(this.s, event, id);
  }

  playerPhoto(player: any) {
    return entityImageSource(this.s, player);
  }

  playerPhotoFallback(event: Event, player: any) {
    entityImageFallback(this.s, player, event);
  }

  teamPoints(match: any, team: 1 | 2) {
    const team1Goals = Number(match.dt?.qt_g1);
    const team2Goals = Number(match.dt?.qt_g2);
    if (team1Goals === team2Goals) return { best: 8, worst: 2 };
    const won =
      team === 1 ? team1Goals > team2Goals : team2Goals > team1Goals;
    return won ? { best: 10, worst: 4 } : { best: 6, worst: 1 };
  }

  async submit() {
    const match = this.match();
    if (!match || !this.voting.credential()) {
      this.feedback.set("Entre com o Google e escolha uma partida.");
      return;
    }
    if (
      !this.team1BestPlayerId() ||
      !this.team1WorstPlayerId() ||
      !this.team2BestPlayerId() ||
      !this.team2WorstPlayerId() ||
      this.team1BestPlayerId() === this.team1WorstPlayerId() ||
      this.team2BestPlayerId() === this.team2WorstPlayerId()
    ) {
      this.feedback.set("Escolha o melhor e o pior de cada equipe.");
      return;
    }
    const ballot = {
      team1BestPlayerId: this.team1BestPlayerId(),
      team1WorstPlayerId: this.team1WorstPlayerId(),
      team2BestPlayerId: this.team2BestPlayerId(),
      team2WorstPlayerId: this.team2WorstPlayerId(),
    };
    this.busy.set(true);
    this.feedback.set("");
    try {
      this.result.set(await this.voting.submit(match.id, "evaluation", ballot));
      this.feedback.set(
        "Voto registrado. Ele não poderá ser alterado e sua identidade não aparece nos resultados.",
      );
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
      if ((error as any)?.status === 409) await this.loadResults();
    } finally {
      this.busy.set(false);
    }
  }

  async loadResults() {
    if (!this.match() || !this.voting.credential()) return;
    this.busy.set(true);
    try {
      this.result.set(
        await this.voting.results(this.match()!.id, "evaluation"),
      );
    } catch (error) {
      this.feedback.set(this.voting.errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  playerName(id: string) {
    return this.s.name(this.s.player(id)?.name);
  }
}
