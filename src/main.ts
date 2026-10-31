import { registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";
import { bootstrapApplication } from "@angular/platform-browser";
import { LOCALE_ID, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { SECTIONS } from "./app/core/models";
registerLocaleData(localePt, "pt-BR");
// Preserve all existing shared URLs, e.g. #matches -> #/matches.
if (/^#[a-z]/i.test(location.hash))
  history.replaceState(
    null,
    "",
    location.pathname + location.search + "#/" + location.hash.slice(1),
  );
bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: "pt-BR" },
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(
      [
        ...SECTIONS.map(([view]) => ({
          path: view,
          loadComponent: () =>
            view === "teste"
              ? import("./app/pages/beta-hub-page.component").then(
                  (m) => m.BetaHubPageComponent,
                )
              : view === "simulation"
              ? import("./app/pages/simulation-page.component").then(m => m.SimulationPageComponent)
              : view === "voting"
              ? import("./app/pages/voting-page.component").then(
                  (m) => m.VotingPageComponent,
                )
              : view === "pool"
                ? import("./app/pages/pool-page.component").then(
                    (m) => m.PoolPageComponent,
                  )
                : view === "user"
                  ? import("./app/pages/user-page.component").then(
                      (m) => m.UserPageComponent,
                    )
              : import("./app/pages/competition-page.component").then(
                  (m) => m.CompetitionPageComponent,
                ),
          data: { view },
        })),
        {
          path: "wiki",
          loadComponent: () =>
            import("./app/pages/wiki-page.component").then(
              (m) => m.WikiPageComponent,
            ),
        },
        {
          path: "wiki-2",
          loadComponent: () =>
            import("./app/pages/wiki-two-page.component").then(
              (m) => m.WikiTwoPageComponent,
            ),
        },
        {
          path: "wiki-3",
          loadComponent: () =>
            import("./app/pages/wiki-three-page.component").then(
              (m) => m.WikiThreePageComponent,
            ),
        },
        {
          path: "ranking",
          loadComponent: () =>
            import("./app/pages/ranking-page.component").then(
              (m) => m.RankingPageComponent,
            ),
        },
        {
          path: "teste-estatisticas",
          pathMatch: "full",
          redirectTo: "teste-estatisticas/duplas",
        },
        {
          path: "teste-estatisticas/:view",
          loadComponent: () =>
            import("./app/pages/historical-statistics-page.component").then(
              (m) => m.HistoricalStatisticsPageComponent,
            ),
        },
        { path: "", pathMatch: "full", redirectTo: "overview" },
        { path: "**", redirectTo: "overview" },
      ],
      withHashLocation(),
    ),
  ],
}).catch((error) => {
  console.error(error);
  const root = document.querySelector("app-root");
  if (root)
    root.textContent =
      "Não foi possível iniciar a aplicação. Recarregue a página.";
});
