import { MATERIAL } from "./material";
import { Component, input, inject } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { CompetitionService } from "../core/competition.service";
@Component({
  selector: "app-match-card",
  standalone: true,
  imports: [...MATERIAL, DecimalPipe],
  template: `<mat-card class="panel fixture-card" appearance="outlined"
    ><button
      mat-button
      class="fixture"
      type="button"
      (click)="s.open('match', m().id)"
    >
      <span class="fixture-meta"
        ><span>{{ s.time(m()) }} · {{ s.court(m().title) }}</span
        ><span class="badge" [class.neutral]="s.finished(m())">{{
          s.status(m())
        }}</span></span
      ><span class="fixture-body"
        ><span class="fixture-team"
          ><span class="fixture-crest-position">
            @if (rank(m().team1) !== null) {
              <b class="match-position">{{ rank(m().team1)! + 1 }}º</b>
            }
            <img
              class="crest"
              [src]="crestSource(m().team1)"
              referrerpolicy="no-referrer"
              (error)="crestFallback($event, m().team1)"
              alt="" /></span
          ><span>{{ s.name(s.team(m().team1)?.name) }}</span></span
        ><span class="score">{{ s.score(m()) }}</span
        ><span class="fixture-team"
          ><span class="fixture-crest-position"
            ><img
              class="crest"
              [src]="crestSource(m().team2)"
              referrerpolicy="no-referrer"
              (error)="crestFallback($event, m().team2)"
              alt=""
            />
            @if (rank(m().team2) !== null) {
              <b class="match-position">{{ rank(m().team2)! + 1 }}º</b>
            }</span
          ><span>{{ s.name(s.team(m().team2)?.name) }}</span></span
        ></span
      >
    </button>
    @if (odds() && s.prediction(m()); as p) {
      @if (p.status === "ready") {
        <div class="odds-caption px-3">
          Odds estimadas <span>1 · X · 2</span>
        </div>
        <div class="odds-strip px-3 pb-3">
          @for (v of p.odds; track $index; let i = $index) {
            <span class="odd-cell"
              ><span>{{ ["1", "X", "2"][i] }}</span
              ><b>{{ v | number: "1.2-2" }}</b
              ><small
                >{{ p.probabilities[i] * 100 | number: "1.1-1" }}%</small
              ></span
            >
          }
        </div>
      }
    }
    @if (s.finished(m())) {
      <div class="fixture-coaches px-3 pb-3">
        @for (team of [m().team1, m().team2]; track team) {
          <span
            >Técnico:
            <b>{{ s.coach(m().id, team)?.name || "Não informado" }}</b></span
          >
        }
      </div>
    } @else if (s.upcoming().some(isThis)) {
      <div class="px-3 pb-3">
        <div class="fixture-coaches">
          @for (side of s.predictedCoaches(m()).sides; track side.teamId) {
            <span
              >Previsão de técnico:
              <b>{{ side.coach?.name || "A definir" }}</b></span
            >
          }
        </div>
        <small class="subtle"
          >Previsão pelo histórico e alternância de quadras. Sujeita à
          confirmação.</small
        >
      </div>
    }
    <ng-content select="[match-summary]" />
  </mat-card>`,
})
export class MatchCardComponent {
  crestPlaceholder(id: string) {
    const team = this.s.team(id);
    const initials = team?.name
      ? this.s
          .name(team.name)
          .split(" ")
          .slice(0, 2)
          .map((s) => s[0])
          .join("")
      : "?";
    return (
      "https://placehold.co/80x80/e9edf2/647186/png?text=" +
      encodeURIComponent(initials)
    );
  }
  crestSource(id: string) {
    const url = this.s.team(id)?.url;
    return /^https:\/\//.test(url || "") ? url : this.crestPlaceholder(id);
  }
  crestFallback(e: Event, id: string) {
    const img = e.target as HTMLImageElement;
    if (img.dataset["fallback"]) return;
    img.dataset["fallback"] = "1";
    img.src = this.crestPlaceholder(id);
  }
  s = inject(CompetitionService);
  m = input.required<any>();
  odds = input(true);
  isThis = (m: any) => m.id === this.m().id;
  rank(id: string) {
    return this.m().fs === this.s.firstPhase &&
      !this.s.finished(this.m()) &&
      this.s.upcoming().some((m) => m.id === this.m().id)
      ? (this.s.standings().find((t) => t.id === id)?.rank ?? null)
      : null;
  }
}
