import { expect, test } from "@playwright/test";

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
