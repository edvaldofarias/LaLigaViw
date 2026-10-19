import { test, expect } from "@playwright/test";
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("dist/data.json", "utf8"));
const installPromptTest =
  "mobile install suggestion remembers a permanent decline";
test.beforeEach(async ({ page }, testInfo) => {
  await page.route("**/copafacil-web.firebaseio.com/**", (r) => r.abort());
  if (testInfo.title !== installPromptTest) {
    await page.addInitScript(() =>
      localStorage.setItem("laliga-install-declined", "1"),
    );
  }
});
test(installPromptTest, async ({ page }, testInfo) => {
  await page.goto("/#/overview");
  if (testInfo.project.name === "desktop") {
    await expect(page.locator(".install-prompt-hero")).toHaveCount(0);
    return;
  }
  await expect(page.locator(".install-prompt-hero")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Leve o campeonato com você" })).toBeVisible();
  await page.locator("#decline-install").click();
  await expect(page.locator(".install-prompt-hero")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".install-prompt-hero")).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("laliga-install-declined"),
    ),
  ).toBe("1");
});
test("overview keeps standings and compact round navigation together", async ({
  page,
}) => {
  await page.goto("/#/overview");
  await expect(page.locator(".overview-table tbody tr")).toHaveCount(12);
  await expect(page.locator(".overview-table thead")).toContainText(
    "Chance G4",
  );
  await expect(page.locator(".overview-table thead")).toContainText(
    "Chance G8",
  );
  await expect(page.locator(".overview-form").first()).toBeVisible();
  await expect(page.locator("app-compact-match-card")).not.toHaveCount(0);
  await expect(page.locator(".metrics")).toHaveCount(0);
  const currentRound = await page
    .locator(".round-carousel-item.active strong")
    .innerText();
  const nextButton = page.getByRole("button", { name: "Próxima rodada" });
  if (await nextButton.isEnabled()) {
    await nextButton.click();
    await expect(
      page.locator(".round-carousel-item.active strong"),
    ).not.toHaveText(currentRound);
  }
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
});
test("matches opens the current round and reuses compact cards", async ({
  page,
}) => {
  await page.goto("/#/matches");
  const activeRound = page.locator(".round-carousel-item.active");
  await expect(activeRound).toBeVisible();
  await expect(page.locator("app-compact-match-card")).not.toHaveCount(0);
  await expect(page.locator("app-match-card")).toHaveCount(0);
  await expect(page.locator(".compact-broadcast").first()).toBeVisible();
  const filter = page.locator(".matches-toolbar mat-form-field").first();
  await expect(filter).toBeVisible();
  expect(
    await filter.evaluate((element) => {
      const field = element.querySelector(".mat-mdc-text-field-wrapper")!;
      const style = getComputedStyle(field);
      return {
        height: field.getBoundingClientRect().height,
        radius: parseFloat(style.borderRadius),
      };
    }),
  ).toEqual({ height: 54, radius: 12 });
  const visibleMatches = await page.locator("app-compact-match-card").count();
  expect(visibleMatches).toBeLessThan(Object.keys(data.matchs).length);
  const previous = page.getByRole("button", { name: "Rodada anterior" });
  if (await previous.isEnabled()) {
    const currentRound = await activeRound.getAttribute("data-round-id");
    await previous.click();
    await expect(page.locator(".round-carousel-item.active")).not.toHaveAttribute(
      "data-round-id",
      currentRound!,
    );
  }
});
test("statistics combines rankings, team duos and historical awards", async ({
  page,
}) => {
  await page.goto("/#/statistics");
  await expect(
    page.getByRole("heading", { name: "Estatísticas", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".statistics-summary article")).toHaveCount(5);
  for (const heading of [
    "Melhores jogadores",
    "Maiores goleadores",
    "Melhores ataques",
    "Melhores defesas",
    "Piores defesas",
    "Goleiros menos vazados",
    "Melhores técnicos",
    "Mais indisciplinados",
    "Mais vezes na Seleção da Rodada",
    "Mais vezes no time ideal",
    "Mais vezes no time ruim",
    "Equipes mais premiadas",
  ]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  const honoredTeams = page.locator(".statistics-panel").filter({has: page.getByRole("heading", {name:"Equipes mais premiadas",exact:true})});
  const firstHonor = honoredTeams.locator("li").first();
  const prizeCount = (await firstHonor.locator("strong").innerText()).split(" ")[0];
  await expect(firstHonor.locator(":scope > b")).toHaveText(prizeCount);
  await expect(firstHonor.locator("strong")).toContainText("premiações");
  await expect(page.locator(".statistics-duo-card")).toHaveCount(
    Object.keys(data.teams).length,
  );
  await expect(page.locator(".statistics-match-list button").first()).toBeVisible();
  await page.locator(".statistics-ranking-list [data-player]").first().click();
  await expect(page.locator(".player-profile-hero")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
});
test("round five official selection lists all seven supplied players", async ({
  page,
}) => {
  await page.goto("/#/selection");
  await expect(page.locator("#selection-round")).toContainText("Rodada 5");
  await expect(page.locator(".selection-grid .selection-card")).toHaveCount(7);
  const poster = page.locator(".selection-art-preview img");
  await expect(poster).toBeVisible();
  await expect(poster).toHaveAttribute("src", /2026-round-5-gold\.png$/);
  await expect.poll(() => poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 1080 && img.naturalHeight === 1350)).toBe(true);
  await expect(page.locator(".selection-download")).toHaveAttribute("download", "viw-selecao-rodada-5.png");
});
test("selects and search fields share the global form style", async ({
  page,
}) => {
  for (const [route, selector] of [
    ["matches", ".matches-toolbar mat-form-field"],
    ["players", ".grid-search"],
    ["selection", ".filters mat-form-field"],
  ]) {
    await page.goto(`/#/${route}`);
    const field = page.locator(selector).first();
    await expect(field).toBeVisible();
    expect(
      await field.evaluate((element) => {
        const wrapper = element.querySelector(".mat-mdc-text-field-wrapper")!;
        return {
          height: wrapper.getBoundingClientRect().height,
          radius: parseFloat(getComputedStyle(wrapper).borderRadius),
        };
      }),
    ).toEqual({ height: 54, radius: 12 });
  }
  await page.goto("/#/players");
  const search = page.locator(".grid-search");
  await expect(search.locator("input")).toHaveAttribute(
    "placeholder",
    "Nome, equipe ou estatística",
  );
  expect(
    await search.evaluate((element) => {
      const label = element.querySelector("label")!.getBoundingClientRect();
      const input = element.querySelector("input")!.getBoundingClientRect();
      return label.bottom <= input.top;
    }),
  ).toBe(true);
});
test("match detail stays compact with broadcast, newspaper and highlights", async ({
  page,
}) => {
  await page.goto("/#/matches");
  await page.locator(".compact-match-main").first().click();
  await expect(page.locator(".match-detail-card")).toBeVisible();
  await expect(page.locator(".match-detail app-match-card")).toHaveCount(0);
  await expect(page.locator(".match-detail-broadcast")).toBeVisible();
  await expect(page.locator(".match-image-action")).toHaveText(
    /Ver imagem do jogo e baixar/,
  );
  expect(
    await page
      .locator(".match-image-action")
      .evaluate(
        (element) =>
          element.getBoundingClientRect().top >
          document
            .querySelector(".match-detail-broadcast")!
            .getBoundingClientRect().bottom,
      ),
  ).toBe(true);
  await expect(page.locator(".match-detail .match-newspaper")).toBeVisible();
  await expect(
    page.locator(".match-detail .detail-section", {
      hasText: "Estatísticas",
    }),
  ).toHaveCount(0);
  await expect(page.locator(".match-detail .newspaper-columns")).toContainText(
    /G8|quartas de final|liderança/,
  );
  await expect(page.locator(".match-highlights-grid article")).not.toHaveCount(
    0,
  );
});
test("all Angular routes, old deep links, no horizontal overflow, search and player charts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#players");
  await expect(page.locator("app-root")).toHaveAttribute(
    "ng-version",
    "22.2.3",
    { timeout: 15000 },
  );
  await expect(page).toHaveURL(/#\/players$/);
  for (const [path, title] of [
    ["overview", "Visão geral"],
    ["matches", "Partidas"],
    ["teams", "Equipes"],
    ["players", "Jogadores"],
    ["selection", "Seleção da rodada"],
    ["motm", "Melhor em campo"],
    ["coaches", "Técnicos"],
    ["ballon", "MVP"],
    ["cartola", "CARTOLA"],
  ]) {
    await page.goto("/#/" + path);
    await expect(page.locator(".section-title h2")).toHaveText(title);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  for (const removedRoute of ["odds", "standings"]) {
    await page.goto("/#/" + removedRoute);
    await expect(page).toHaveURL(/#\/overview$/);
    await expect(page.locator(".section-title h2")).toHaveText("Visão geral");
  }
  await expect(page.locator(".desktop-navigation")).not.toContainText(
    "Odds e simulações",
  );
  await expect(page.locator(".desktop-navigation")).not.toContainText(
    "Classificação",
  );
  await page.goto("/#/cartola");
  await expect(page.locator(".round-carousel-item.active")).toContainText(
    "Rodada 5",
  );
  await page
    .locator(".round-carousel-item", { hasText: "Rodada 6" })
    .click();
  await expect(page.locator(".cartola-suggestion-grid .cartola-team")).toHaveCount(2);
  await expect(page.locator(".cartola-suggestion-row")).toHaveCount(14);
  await page.goto("/#/players");
  await page.locator(".grid-search input").fill("Edvado");
  await expect(page.locator("#content tbody")).toContainText("Edvaldo");
  await page.locator("#content app-entity button").first().click();
  await expect(page.locator("#detail")).toBeVisible();
  const profilePhoto = page.locator(".player-profile-hero .avatar");
  await expect(profilePhoto).toBeVisible();
  await expect
    .poll(() =>
      profilePhoto.evaluate((image: HTMLImageElement) => {
        const imageWidth = image.getBoundingClientRect().width;
        const frameWidth =
          image.closest(".player-profile-photo")?.getBoundingClientRect()
            .width ?? 0;
        return {
          loaded: image.complete && image.naturalWidth > 0,
          fillsFrame: imageWidth >= frameWidth - 8,
        };
      }),
    )
    .toEqual({
      loaded: true,
      fillsFrame: true,
    });
  await expect(page.locator(".player-profile-team .crest")).toBeVisible();
  await expect(page.locator(".player-profile-stats > div")).toHaveCount(4);
  await expect(page.locator(".player-stat-panel")).toContainText(
    "Números na competição",
  );
  await expect(page.locator("#detail canvas")).toHaveCount(2);
  await page.locator("#close-detail").click();
  expect(errors).toEqual([]);
});
test("all competition tabs use compact modern surfaces", async ({ page }) => {
  for (const [route, selector] of [
    ["teams", ".team-summary-card"],
    ["players", ".data-panel"],
    ["ballon", ".data-panel"],
    ["coaches", ".data-panel"],
    ["selection", ".feature-panel"],
    ["motm", ".motm-player-card"],
    ["cartola", ".data-panel"],
  ]) {
    await page.goto(`/#/${route}`);
    await expect(page.locator(selector).first()).toBeVisible();
  }
  await page.goto("/#/coaches");
  await expect(page.locator("td.mat-column-percent").first()).toHaveText(
    /^\d+%$/,
  );
  await page.goto("/#/motm");
  await expect(page.locator("#motm-round")).toContainText("Rodada 5");
  await expect(page.locator(".motm-player-card")).toHaveCount(5);
  await page.locator("#motm-round").click();
  await page
    .getByRole("option", {
      name: "Melhores em campo · Rodada 4",
      exact: true,
    })
    .click();
  await expect(page.locator(".motm-player-card")).toHaveCount(5);
});
test("player recognitions stay compact and aligned", async ({ page }, info) => {
  await page.goto("/#/players");
  await page.locator(".grid-search input").fill("Felipe");
  await page.locator('[data-player="1789220352095"]').click();
  const achievements = page.locator(".player-achievement");
  await expect(achievements).toHaveCount(4);
  const positions = await achievements.evaluateAll((cards) =>
    cards.map((card) => Math.round(card.getBoundingClientRect().top)),
  );
  if (info.project.name === "desktop") {
    expect(new Set(positions).size).toBe(1);
  } else {
    expect(new Set(positions).size).toBe(4);
  }
  await expect(
    achievements.first().locator(".player-achievement-icon"),
  ).toHaveCSS("width", "32px");
  await achievements.filter({ hasText: "Melhor em campo" }).click();
  await expect(page.locator(".match-detail-card")).toBeVisible();
});
test("team detail uses a compact profile and match cards", async ({ page }) => {
  await page.goto("/#/teams");
  await page.locator(".team-summary-card button[data-team]").first().click();
  await expect(page.locator(".team-profile-hero")).toBeVisible();
  await expect(page.locator(".team-profile-crest .crest")).toBeVisible();
  await expect(page.locator(".team-profile-stats > span")).toHaveCount(4);
  await expect(page.locator(".team-detail-panel")).toHaveCount(2);
  await page
    .locator("mat-expansion-panel-header", { hasText: "Elenco completo" })
    .click();
  await expect(page.locator(".team-roster-section app-grid")).toBeVisible();
  const rosterCount = Number(
    (
      await page
        .locator("mat-expansion-panel-header", { hasText: "jogadores" })
        .textContent()
    )?.match(/(\d+) jogadores/)?.[1],
  );
  await expect(
    page.locator(".team-roster-section app-grid tbody tr"),
  ).toHaveCount(rosterCount);
  await expect(page.locator(".team-roster-section mat-paginator")).toHaveCount(
    0,
  );
  await page
    .locator("mat-expansion-panel-header", { hasText: "Partidas da equipe" })
    .click();
  await expect(
    page.locator(".team-match-grid app-compact-match-card"),
  ).not.toHaveCount(0);
  await expect(page.locator("#detail app-match-card")).toHaveCount(0);
});
test("MVP scoring rules distinguish bonuses and penalties", async ({ page }) => {
  await page.goto("/#/ballon");
  await expect(page.locator(".score-rule")).toHaveCount(12);
  await expect(page.locator(".score-rule.positive")).toHaveCount(8);
  await expect(page.locator(".score-rule.negative")).toHaveCount(3);
  await expect(page.locator(".score-rule.neutral")).toHaveCount(1);
  await expect(page.locator(".scoring-note")).toContainText(
    "Jogo sem sofrer gols vale +7 para o goleiro e +3 para a linha",
  );
});
test("completed Cartola round uses compact seven-player lineups", async ({
  page,
}) => {
  await page.goto("/#/cartola");
  await page
    .locator(".round-carousel-item", { hasText: "Rodada 5" })
    .click();
  await expect(page.locator(".cartola-grid .cartola-team")).toHaveCount(2);
  await expect(page.locator(".cartola-lineup-row")).toHaveCount(14);
  await expect(page.locator(".cartola-lineup-row.goalkeeper")).toHaveCount(2);
  await expect(page.locator(".cartola-grid table")).toHaveCount(0);
  await expect(
    page.locator(".cartola-lineup-row .cartola-player-points").first(),
  ).toContainText("pts");
});
test("coach detail teams, match newspaper and selection zoom remain available", async ({
  page,
}) => {
  await page.goto("/#/coaches");
  await page.locator("#content app-entity button").first().click();
  await expect(page.locator("#detail")).toBeVisible();
  await expect(
    page.locator("#detail .coach-team-grid app-entity"),
  ).not.toHaveCount(0);
  const coachGame = page.locator(".coach-history-row").first();
  await expect(coachGame).toHaveCSS("display", "grid");
  await expect
    .poll(() =>
      coachGame.evaluate((row) => {
        const title = row.querySelector(".coach-history-copy b");
        const detail = row.querySelector(".coach-history-copy small");
        return (
          !!title &&
          !!detail &&
          detail.getBoundingClientRect().top >=
            title.getBoundingClientRect().bottom
        );
      }),
    )
    .toBe(true);
  await coachGame.click();
  await expect(page.locator("#detail .match-newspaper")).toBeVisible();
  await page.locator("#close-detail").click();
  await page.goto("/#/selection");
  const img = page.locator(".selection-art-preview img");
  await expect(img).toBeVisible();
  await expect
    .poll(() =>
      img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await img.click();
  await expect(page.locator(".pswp--open")).toBeVisible();
  await page.locator(".pswp__button--close").click();
});
test("live scoreboard and provisional points update from source without reloading", async ({
  page,
}) => {
  const snapshot = structuredClone(data);
  const [id, m] = Object.entries(snapshot.matchs).find(
    ([, m]: any) => !m.st && m.title === "Q1",
  ) as [string, any];
  m.st = 1;
  delete m.dt;
  await page.unroute("**/copafacil-web.firebaseio.com/**");
  await page.route("**/copafacil-web.firebaseio.com/**", (r) => {
    const key = r.request().url().split("/").at(-1)!.replace(".json", "");
    return snapshot[key] ? r.fulfill({ json: snapshot[key] }) : r.abort();
  });
  await page.route("**/click190.com.br/**", (r) => r.abort());
  await page.goto("/#/matches");
  await page.locator(`[data-round-id="${m.m_set}"]`).click();
  await expect(page.locator(".compact-match-info b.live")).toHaveText(
    "Ao vivo",
  );
  await page.locator('[data-live-court="1"]').first().click();
  await expect(page.locator(".live-scoreboard")).toContainText("0 × 0");
  m.dt = { qt_g1: 2, qt_g2: 0 };
  await expect(page.locator(".live-scoreboard")).toContainText("2 × 0", {
    timeout: 25000,
  });
  await page.evaluate(() =>
    document.querySelector<HTMLDialogElement>(".live-dialog")!.close(),
  );
  await page.goto("/#/overview");
  await expect(page.locator(".live-table-notice")).toBeVisible();
  await expect(page.locator(".live-points-label")).toHaveCount(2);
});
test("live cameras fill the stage and waiting status stays centered", async ({
  page,
}) => {
  await page.route("**/click190.com.br/**", (route) => route.abort());
  await page.goto("/#/matches");
  await page.locator('[data-live-court]').first().click();
  const stage = page.locator(".live-stage");
  await expect(stage.locator(".live-half")).toHaveCount(2);
  await expect(stage.locator(".live-scoreboard.waiting")).toContainText(
    "Aguardando o início da partida",
  );
  const wideViewport = page.viewportSize()!.width > 900;
  if (wideViewport) {
    await expect
      .poll(() =>
        stage.locator("video").first().evaluate((video) => ({
          fit: getComputedStyle(video).objectFit,
          fullscreen: Boolean(document.fullscreenElement),
        })),
      )
      .toEqual({ fit: "cover", fullscreen: false });
    await page.locator(".live-dialog [data-full]").click();
  }
  await expect
    .poll(() =>
      stage
        .locator("video")
        .first()
        .evaluate((video) => getComputedStyle(video).objectFit),
    )
    .toBe("contain");
  await expect
    .poll(() =>
      stage.evaluate((element) => {
        const stageBox = element.getBoundingClientRect();
        const cameras = [...element.querySelectorAll(".live-half")];
        const cameraWidth = cameras.reduce(
          (total, camera) => total + camera.getBoundingClientRect().width,
          0,
        );
        const scoreboard = element
          .querySelector(".live-scoreboard")!
          .getBoundingClientRect();
        return {
          fillsStage: Math.abs(cameraWidth - stageBox.width) <= 1,
          centered:
            Math.abs(
              scoreboard.left +
                scoreboard.width / 2 -
                (stageBox.left + stageBox.width / 2),
            ) <= 1,
          overlay:
            getComputedStyle(
              element.querySelector(".live-scoreboard")!,
            ).position === "absolute",
        };
      }),
    )
    .toEqual({ fillsStage: true, centered: true, overlay: true });
  await page.evaluate(() =>
    document.querySelector<HTMLDialogElement>(".live-dialog")!.close(),
  );
});
test("Material controls sort, filter, paginate and open accessible navigation", async ({
  page,
}, info) => {
  await page.goto("/#/players");
  await expect(page.locator("mat-paginator")).toBeVisible();
  await page.locator("th.mat-column-goals").click();
  await expect(page.locator("th.mat-column-goals")).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await page.locator("th.mat-column-goals").click();
  await expect(page.locator("th.mat-column-goals")).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await expect(
    page.locator("tbody tr").first().locator(".mat-column-goals"),
  ).toHaveText("9");
  await page
    .getByRole("button", { name: "Próxima página", exact: true })
    .click();
  await expect(page.locator(".mat-mdc-paginator-range-label")).toContainText(
    "21–40",
  );
  await page.locator(".grid-search input").fill("Edvado");
  await expect(page.locator(".mat-mdc-paginator-range-label")).toContainText(
    "1–1",
  );
  await expect(page.locator("tbody")).toContainText("Edvaldo");
  await page.locator("tbody app-entity button").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#detail")).toHaveCount(0);
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.locator("mat-sidenav")).toBeVisible();
    await page
      .locator("mat-sidenav")
      .getByRole("link", { name: "CARTOLA", exact: true })
      .click();
    await expect(page).toHaveURL(/cartola$/);
    await expect(page.locator("mat-sidenav")).not.toBeVisible();
  }
  await expect(
    page.locator('script[src*="bootstrap"],script[src*="datatables"]'),
  ).toHaveCount(0);
});

test("entity alignment, compact chart logos, placeholders and nonzero match events", async ({
  page,
}) => {
  await page.route(/firebasestorage.googleapis.com|placehold.co/, (r) =>
    r.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"><rect width="800" height="1200" fill="#55aacc"/></svg>',
    }),
  );
  for (const route of ["ballon", "players"]) {
    await page.goto("/#/" + route);
    const entity = page.locator("tbody app-entity .entity-content").first();
    await expect(entity).toBeVisible();
    await expect
      .poll(() =>
        entity.evaluate((el) => {
          const image = el.querySelector("img")!.getBoundingClientRect(),
            text = el.querySelector("span")!.getBoundingClientRect();
          return (
            text.left >= image.right &&
            Math.abs(image.y + image.height / 2 - text.y - text.height / 2) < 2
          );
        }),
      )
      .toBe(true);
  }
  await page.goto("/#/cartola");
  expect(
    await page
      .locator("mat-expansion-panel")
      .evaluate(
        (el) =>
          el.getBoundingClientRect().top >
          document.querySelector(".cartola-grid")!.getBoundingClientRect()
            .bottom,
      ),
  ).toBe(true);
  await page.goto("/#/matches");
  const placeholderMatch = Object.values(data.matchs).find(
    (match: any) => !data.teams[match.team1] || !data.teams[match.team2],
  ) as any;
  await page
    .locator(`[data-round-id="${placeholderMatch.m_set}"]`)
    .click();
  await page
    .locator(".compact-match-main")
    .filter({ hasText: "A Definir" })
    .first()
    .click();
  await expect(
    page.locator("#detail .compact-match-team img").first(),
  ).toHaveAttribute("src", /placehold.co/);
  await page.locator("#close-detail").click();
  const classic = Object.values(data.matchs).find((match: any) => {
    const names = [data.teams[match.team1]?.name, data.teams[match.team2]?.name];
    return names.includes("BARCELONA") && names.includes("REAL MADRID");
  }) as any;
  await page.locator(`[data-round-id="${classic.m_set}"]`).click();
  await page
    .locator(".compact-match-main")
    .filter({ hasText: "Barcelona" })
    .filter({ hasText: "Real Madrid" })
    .first()
    .click();
  await expect(page.locator(".match-event-counts")).not.toHaveCount(0);
  await expect(
    page.locator("#detail .match-team-stats-heading .crest"),
  ).toHaveCount(2);
  await expect(
    page.locator("#detail .match-event-player app-entity .avatar").first(),
  ).toBeVisible();
  const events = await page
    .locator(".match-event-counts > span")
    .allTextContents();
  expect(events.every((s) => !s.trim().endsWith(" 0"))).toBe(true);
  await expect(
    page.locator('.match-event-counts [aria-label="Cartões amarelos"]'),
  ).toContainText("1");
});

test("overview odds use Portuguese number formatting", async ({ page }) => {
  await page.goto("/#/overview");
  await expect(page.locator(".compact-odd b").first()).toBeVisible();
  const odds = await page
    .locator("app-compact-match-card")
    .first()
    .locator(".compact-odd b")
    .allTextContents();
  expect(odds.every((v) => /^\d+,\d{2}$/.test(v.trim()))).toBe(true);
});
