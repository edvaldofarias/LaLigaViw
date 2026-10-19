import { Component, computed, inject, input, output } from "@angular/core";
import { CompetitionService } from "../core/competition.service";

@Component({
  selector: "app-round-carousel",
  standalone: true,
  template: `
    <nav class="round-carousel" aria-label="Selecionar rodada">
      <button
        class="round-carousel-arrow"
        type="button"
        aria-label="Rodada anterior"
        [disabled]="selectedIndex() <= 0"
        (click)="change(-1)"
      >
        ‹
      </button>
      <div class="round-carousel-track">
        @for (round of rounds(); track round.id) {
          <button
            class="round-carousel-item"
            type="button"
            [class.active]="round.id === selected()"
            [attr.aria-current]="round.id === selected() ? 'true' : null"
            [attr.data-round-id]="round.id"
            (click)="selectedChange.emit(round.id)"
          >
            <small>{{ s.phase(round.fs) }}</small>
            <strong>{{ roundLabel(round.id) }}</strong>
          </button>
        }
      </div>
      <button
        class="round-carousel-arrow"
        type="button"
        aria-label="Próxima rodada"
        [disabled]="selectedIndex() >= rounds().length - 1"
        (click)="change(1)"
      >
        ›
      </button>
    </nav>
  `,
})
export class RoundCarouselComponent {
  readonly s = inject(CompetitionService);
  readonly rounds = input.required<any[]>();
  readonly selected = input.required<string>();
  readonly selectedChange = output<string>();
  readonly selectedIndex = computed(() =>
    this.rounds().findIndex((round) => round.id === this.selected()),
  );

  change(offset: number) {
    const next = this.selectedIndex() + offset;
    if (next >= 0 && next < this.rounds().length) {
      this.selectedChange.emit(this.rounds()[next].id);
    }
  }

  roundLabel(id: string) {
    const match = this.s.matches().find((item) => item.m_set === id);
    return match ? this.s.round(match) : "Rodada";
  }
}
