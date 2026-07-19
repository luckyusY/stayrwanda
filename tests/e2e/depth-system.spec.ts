import { expect, test } from "@playwright/test";

test("homepage uses dimensional controls while editorial content stays flat", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const searchConsole = page.locator(".surface-3d-floating").first();
  await expect(searchConsole).toBeVisible();
  const styles = await searchConsole.evaluate((element) => {
    const style = getComputedStyle(element);
    return { shadow: style.boxShadow, radius: style.borderRadius };
  });
  expect(styles.shadow).not.toBe("none");
  expect(styles.radius).not.toBe("0px");
  await expect(page.locator("article.surface-3d").first()).toBeVisible();
  await expect(page.getByText("A different kind of stay", { exact: true })).not.toHaveClass(/surface-3d/);
});

test("search fields expose inset and keyboard-focus feedback", async ({ page }) => {
  await page.goto("/search?destination=Kigali", { waitUntil: "domcontentloaded" });
  const field = page.locator(".search-field-well").first();
  await expect(field).toBeVisible();
  await field.locator("input").focus();
  const shadow = await field.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(shadow).not.toBe("none");
});

test("authentication shell keeps the Clerk-inspired floating hierarchy", async ({ page }) => {
  await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
  const shell = page.locator(".auth-card-shell");
  await expect(shell).toBeVisible();
  expect(await shell.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
});

test("mobile public surfaces do not create horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/search?destination=Kigali", "/hotels", "/help"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(dimensions.scroll, `${route} overflows horizontally`).toBeLessThanOrEqual(dimensions.client + 1);
  }
});

test("reduced motion removes dimensional translation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/hotels", { waitUntil: "domcontentloaded" });
  const card = page.locator(".surface-3d-lift").first();
  await expect(card).toBeVisible();
  await card.hover();
  await expect(card).toHaveCSS("transform", "none");
});
