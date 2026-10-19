import { DecimalPipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { CompetitionService } from "../core/competition.service";

export function teamCrestSource(service: CompetitionService, id: string) {
  const url = service.team(id)?.url;
  if (/^https:\/\//.test(url || "")) return url;
  const initials = service
    .name(service.team(id)?.name)
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    "https://placehold.co/64x64/e9edf2/647186/png?text=" +
    encodeURIComponent(initials || "?")
  );
}

export function teamCrestFallback(
  service: CompetitionService,
  event: Event,
  id: string,
) {
  const image = event.target as HTMLImageElement;
  if (image.dataset["fallback"]) return;
  image.dataset["fallback"] = "1";
  image.src = teamCrestSource(service, id);
}

@Component({
  selector: "app-compact-match-card",
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <article class="compact-match">
      <button
        class="compact-match-main"
        type="button"
        (click)="s.open('match', match().id)"
      >
        <span class="compact-match-info">
          <span>{{ s.date(match()) }} · {{ s.time(match()) }}</span>
          <b [class.live]="s.isLive(match())">{{ s.status(match()) }}</b>
        </span>
        <span class="compact-match-venue">{{ s.court(match().title) }}</span>
        <span class="compact-scoreline">
          <span class="compact-match-team">
            <span>{{ s.name(s.team(match().team1)?.name) }}</span>
            <img
              [src]="crestSource(match().team1)"
              referrerpolicy="no-referrer"
              (error)="crestFallback($event, match().team1)"
              alt=""
            />
          </span>
          <strong>{{ s.score(match()) }}</strong>
          <span class="compact-match-team away">
            <img
              [src]="crestSource(match().team2)"
              referrerpolicy="no-referrer"
              (error)="crestFallback($event, match().team2)"
              alt=""
            />
            <span>{{ s.name(s.team(match().team2)?.name) }}</span>
          </span>
        </span>
      </button>
      @if (odds() && s.prediction(match()); as prediction) {
        @if (prediction.status === "ready") {
          <div class="compact-odds">
            <span class="compact-odds-label">Odds</span>
            @for (
              odd of prediction.odds;
              track $index;
              let index = $index
            ) {
              <span class="compact-odd">
                <small>{{ ["1", "X", "2"][index] }}</small>
                <b>{{ odd | number: "1.2-2" }}</b>
              </span>
            }
          </div>
        }
      }
      @if (broadcast() && !s.finished(match()) && courtNumber()) {
        <button
          class="compact-broadcast"
          type="button"
          [attr.data-live-court]="courtNumber()"
        >
          <span aria-hidden="true">▶</span>
          Assistir ao vivo · {{ s.court(match().title) }}
        </button>
      }
    </article>
  `,
})
export class CompactMatchCardComponent {
  readonly s = inject(CompetitionService);
  readonly match = input.required<any>();
  readonly odds = input(true);
  readonly broadcast = input(true);

  crestSource(id: string) {
    return teamCrestSource(this.s, id);
  }

  crestFallback(event: Event, id: string) {
    teamCrestFallback(this.s, event, id);
  }

  courtNumber() {
    return Number(String(this.match().title || "").match(/[12]/)?.[0]) || 0;
  }
}
