import { SystemDialogsComponent } from "./shared/system-dialogs.component";
import { MATERIAL } from "./shared/material";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import {
  Component,
  inject,
  afterNextRender,
  signal,
  computed,
} from "@angular/core";
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
} from "@angular/router";
import { CompetitionService } from "./core/competition.service";
import { VotingService } from "./core/voting.service";
import { DetailComponent } from "./shared/detail.component";
import { SECTIONS } from "./core/models";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    SystemDialogsComponent,
    ...MATERIAL,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DetailComponent,
  ],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  navOpen = signal(false);
  s = inject(CompetitionService);
  voting = inject(VotingService);
  sections = SECTIONS;
  private router = inject(Router);
  url = signal(this.router.url);
  current = computed(
    () =>
      this.sections.find((x) => this.url().includes("/" + x[0]))?.[1] ||
      "Visão geral",
  );
  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.url.set(e.urlAfterRedirects);
        this.s.close();
        this.closeNav();
      }
    });
    afterNextRender(async () => {
      await this.voting.initialize();
      await import("../../dist/live-court.mjs");
      await import("../../dist/gallery-ui.mjs");
      void this.s.start();
    });
  }
  closeNav() {
    this.navOpen.set(false);
  }
}
