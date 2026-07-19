import { expect, test } from "@playwright/test";

test("mobile hamburger menu opens above the page and scrolls independently", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Phone interaction coverage");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, 360));
  const originalScroll = await page.evaluate(() => window.scrollY);

  const menuButton = page.getByRole("button", { name: "Open menu" });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toBeInViewport();
  await menuButton.click();

  const menu = page.getByRole("dialog", { name: "Main menu" });
  await expect(menu).toBeVisible();
  await expect(menu.getByLabel("StayRwanda home")).toBeVisible();
  await menu.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect(menu.getByRole("link", { name: "Help centre" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(originalScroll);
  await expect(menuButton).toBeFocused();
});

test("mobile account and currency dialogs show branding and restore scroll", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Phone interaction coverage");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, Math.min(500, document.body.scrollHeight / 3)));
  const originalScroll = await page.evaluate(() => window.scrollY);

  await page.getByRole("button", { name: /Account menu/ }).evaluate((element: HTMLButtonElement) => element.click());
  const account = page.getByRole("dialog", { name: "Account" });
  await expect(account).toBeVisible();
  await expect(account.getByAltText("StayRwanda")).toBeVisible();
  await account.getByRole("button", { name: "Close" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(originalScroll);

  await page.getByRole("button", { name: /currency/ }).evaluate((element: HTMLButtonElement) => element.click());
  const currency = page.getByRole("dialog", { name: "Currency" });
  await expect(currency).toBeVisible();
  await expect(currency.getByAltText("StayRwanda")).toBeVisible();
  await currency.getByRole("button", { name: "Close" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(originalScroll);
});

test("booking calendar stays open until dates are applied", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Phone interaction coverage");
  await page.goto("/hotels/kibagabaga-apartment-one", { waitUntil: "domcontentloaded" });

  const openBooking = page.getByRole("button", { name: "Start booking request" });
  test.skip(!(await openBooking.isEnabled().catch(() => false)), "Published unit inventory is unavailable in this environment");
  await openBooking.click();

  const booking = page.getByRole("dialog", { name: "Request to book" });
  await expect(booking).toBeVisible();
  await booking.getByText("Add date").first().click();

  const calendar = page.getByRole("dialog", { name: "Select dates" });
  await expect(calendar).toBeVisible();
  const availableDays = calendar.locator('[data-testid="calendar-day"]:not([disabled])');
  await availableDays.nth(1).click();
  await availableDays.nth(3).click();

  await expect(calendar).toBeVisible();
  await expect(booking).toBeVisible();
  await calendar.getByRole("button", { name: "Apply dates" }).click();
  await expect(calendar).toBeHidden();
  await expect(booking).toBeVisible();
  await expect(booking.getByText("Add date")).toHaveCount(0);
});

test("core phone routes have no horizontal page overflow", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Phone layout coverage");
  for (const route of ["/", "/search?destination=Kigali", "/hotels", "/destinations/kigali", "/offers", "/help"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth, `${route} overflows horizontally`).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  }
});

test("homepage mobile hero and navigation remain clear", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Phone layout coverage");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const header = page.locator("header").first();
  await expect(header).toBeVisible();
  await expect(header).toHaveCSS("background-color", /rgb\(255, 255, 255\)|rgba\(255, 255, 255|color\(srgb 1 1 1/);
  await expect(page.locator('[aria-roledescription="carousel"]')).toBeVisible();
  await expect(page.getByRole("link", { name: "View stay" }).first()).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
  const backToTop = page.getByRole("button", { name: "Back to top" });
  await expect(backToTop).toBeVisible();
  const accountTab = page.getByRole("link", { name: "Account", exact: true });
  const [topBox, accountBox] = await Promise.all([backToTop.boundingBox(), accountTab.boundingBox()]);
  expect(topBox && accountBox && topBox.y + topBox.height < accountBox.y).toBeTruthy();
});

test("search cards expose swipe galleries and real property facts", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Phone catalogue coverage");
  await page.goto("/search?destination=Kigali", { waitUntil: "domcontentloaded" });
  const firstCard = page.locator("article").first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard.getByLabel("Property details")).toBeVisible();
  await expect(firstCard.getByText(/4 guests/i)).toBeVisible();
  const gallery = firstCard.getByLabel(/photo gallery/i);
  await expect(gallery).toBeVisible();
  await expect(gallery.locator(":scope > div")).toHaveCount(8);
});

test("property profiles always expose a usable map", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Phone property coverage");
  await page.goto("/hotels/kibagabaga-apartment-one", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/Approximate neighbourhood location|Verified property location/)).toBeVisible();
  await expect(page.getByTitle("Property Map Location")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open in Google Maps" })).toBeVisible();
});
