import { test, expect } from "@playwright/test";
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("dist/data.json", "utf8"));
test.beforeEach(async ({ page }) => {
  await page.route("**/copafacil-web.firebaseio.com/**", (r) => r.abort());
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
    ["odds", "Odds e simulações"],
    ["standings", "Classificação"],
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
  await expect(page.locator("#cartola-round")).toContainText("Rodada 5");
  await page.locator("#cartola-round").click();
  await page
    .getByRole("option", { name: "Primeira Fase · Rodada 6", exact: true })
    .click();
  await expect(page.locator(".cartola-team tbody tr")).toHaveCount(7);
  await expect(
    page.locator(".cartola-team tbody tr").first().locator("td").last(),
  ).toBeVisible();
  await page.goto("/#/players");
  await page.locator(".grid-search input").fill("Edvado");
  await expect(page.locator("#content tbody")).toContainText("Edvaldo");
  await page.locator("#content app-entity button").first().click();
  await expect(page.locator("#detail")).toBeVisible();
  await expect(page.locator("#detail canvas")).toHaveCount(2);
  await page.locator("#close-detail").click();
  expect(errors).toEqual([]);
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
  await page.locator(".coach-history button").first().click();
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
  await expect(
    page.locator("app-match-card").filter({ hasText: "Ao vivo" }),
  ).toBeVisible();
  await page.locator('[data-live-court="1"]').first().click();
  await expect(page.locator(".live-scoreboard")).toContainText("0 × 0");
  m.dt = { qt_g1: 2, qt_g2: 0 };
  await expect(page.locator(".live-scoreboard")).toContainText("2 × 0", {
    timeout: 25000,
  });
  await page.evaluate(() =>
    document.querySelector<HTMLDialogElement>(".live-dialog")!.close(),
  );
  await page.goto("/#/standings");
  await expect(page.locator(".live-table-notice")).toBeVisible();
  await expect(page.locator(".live-points-label")).toHaveCount(2);
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
  for (const route of ["ballon", "standings", "players"]) {
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
  await page.goto("/#/standings");
  await expect(page.locator(".chart-legend img")).toHaveCount(12);
  expect(
    await page.locator(".chart-legend img").evaluateAll((imgs) =>
      imgs.every((img) => {
        const r = img.getBoundingClientRect();
        return r.width <= 24 && r.height <= 24;
      }),
    ),
  ).toBe(true);
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
  await page
    .locator(".fixture")
    .filter({ hasText: "A Definir" })
    .first()
    .click();
  await expect(page.locator("#detail .fixture img").first()).toHaveAttribute(
    "src",
    /placehold.co/,
  );
  await page.locator("#close-detail").click();
  await page
    .locator(".fixture")
    .filter({ hasText: "Barcelona" })
    .filter({ hasText: "Real Madrid" })
    .first()
    .click();
  await expect(page.locator(".match-event-counts")).not.toHaveCount(0);
  const events = await page
    .locator(".match-event-counts > span")
    .allTextContents();
  expect(events.every((s) => !s.trim().endsWith(" 0"))).toBe(true);
  await expect(
    page.locator('.match-event-counts [aria-label="Cartões amarelos"]'),
  ).toContainText("1");
});

test("odds use the shared match card and Portuguese number formatting", async ({
  page,
}) => {
  await page.goto("/#/overview");
  await expect(page.locator(".odd-cell b").first()).toBeVisible();
  const odds = await page
    .locator("app-match-card")
    .first()
    .locator(".odd-cell b")
    .allTextContents();
  await page.goto("/#/odds");
  await expect(page.locator(".odds-match").first()).toBeVisible();
  await expect(page.locator(".odds-match > mat-card")).toHaveCount(0);
  await expect(
    page.locator(".odds-match app-match-card").first().locator("mat-card"),
  ).toHaveCount(1);
  expect(
    await page
      .locator(".odds-match app-match-card")
      .first()
      .locator(".odd-cell b")
      .allTextContents(),
  ).toEqual(odds);
  expect(odds.every((v) => /^\d+,\d{2}$/.test(v.trim()))).toBe(true);
  await expect(page.locator(".forecast-evidence").first()).toContainText(
    "Placar mais frequente",
  );
  await expect(page.locator(".prediction-facts").first()).toContainText(" x ");
});
