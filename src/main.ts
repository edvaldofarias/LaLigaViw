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
            view === "voting"
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
