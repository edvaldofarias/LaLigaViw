import { MATERIAL } from "./material";
import { Component, input, inject } from "@angular/core";
import { CompetitionService } from "../core/competition.service";
@Component({
  selector: "app-entity",
  standalone: true,
  imports: [...MATERIAL],
  styles: [
    `
      :host {
        display: inline-block;
        max-width: 100%;
        vertical-align: middle;
      }
      .entity-content {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-width: 0;
        text-align: left;
      }
      .entity-content > img {
        flex: 0 0 auto;
        display: block;
        object-fit: contain;
      }
      .entity-content > .avatar {
        object-fit: cover;
      }
      .entity-content > span {
        display: block;
        min-width: 0;
        line-height: 1.45;
        overflow-wrap: normal;
      }
      button {
        max-width: 100%;
        height: auto;
        min-height: 48px;
      }
    `,
  ],
  template: `<button
    mat-button
    [attr.data-player]="kind() === 'player' ? entity().id : null"
    [attr.data-team]="kind() === 'team' ? entity().id : null"
    [attr.data-coach]="kind() === 'coach' ? entity().id : null"
    type="button"
    [class]="kind() === 'team' ? 'team-button' : 'player-name'"
    (click)="store.open(kind(), entity().id)"
  >
    <span class="entity-content"
      ><img
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
      </span></span
    >
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
    const initials = this.store
      .name(this.entity().name)
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="#e9edf2"/><text x="80" y="86" text-anchor="middle" dominant-baseline="middle" fill="#647186" font-family="Arial,sans-serif" font-size="48" font-weight="700">${initials}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  fallback(e: Event) {
    const img = e.target as HTMLImageElement;
    if (!img.dataset["fallback"]) {
      img.dataset["fallback"] = "1";
      img.src = this.placeholder();
    }
  }
}
