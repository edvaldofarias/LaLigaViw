import { MATERIAL } from "./material";
import { Component, input, inject } from "@angular/core";
import { CompetitionService } from "../core/competition.service";
@Component({
  selector: "app-entity",
  standalone: true,
  imports: [...MATERIAL],
  template: `<button
    mat-button
    [attr.data-player]="kind() === 'player' ? entity().id : null"
    [attr.data-team]="kind() === 'team' ? entity().id : null"
    [attr.data-coach]="kind() === 'coach' ? entity().id : null"
    type="button"
    [class]="kind() === 'team' ? 'team-button' : 'player-name'"
    (click)="store.open(kind(), entity().id)"
  >
    <img
      [class]="kind() === 'team' ? 'crest' : 'avatar'"
      [src]="image()"
      (error)="fallback($event)"
      alt=""
      loading="lazy"
      referrerpolicy="no-referrer"
    /><span
      >{{ store.name(entity().name) }}
      @if (
        kind() === "player" && store.goalkeeper(entity().id, entity().team)
      ) {
        <small class="goalkeeper-badge">Goleiro · Camisa 1</small>
      }
    </span>
  </button>`,
})
export class EntityComponent {
  store = inject(CompetitionService);
  entity = input.required<any>();
  kind = input<"team" | "player" | "coach">("player");
  image() {
    const u = this.entity().url || this.entity().photo;
    return /^https:\/\//.test(u || "") ? u : this.placeholder();
  }
  placeholder() {
    return (
      "https://placehold.co/160x160/e9edf2/647186/png?text=" +
      encodeURIComponent(
        this.store
          .name(this.entity().name)
          .split(" ")
          .slice(0, 2)
          .map((s) => s[0])
          .join(""),
      )
    );
  }
  fallback(e: Event) {
    const img = e.target as HTMLImageElement;
    if (!img.dataset["fallback"]) {
      img.dataset["fallback"] = "1";
      img.src = this.placeholder();
    }
  }
}
