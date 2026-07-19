import { describe, expect, it } from "vitest";
import { getMobileNavigationMode } from "./mobile-navigation";

describe("getMobileNavigationMode", () => {
  it.each(["/account", "/account/bookings", "/account/favorites"])("uses account tabs on %s", (pathname) => {
    expect(getMobileNavigationMode(pathname)).toBe("account");
  });

  it.each(["/", "/search", "/hotels/kigali-house"])("uses marketplace tabs on %s", (pathname) => {
    expect(getMobileNavigationMode(pathname)).toBe("public");
  });

  it.each(["/host", "/host/calendar", "/admin", "/sign-in", "/register", "/booking/reference"])(
    "hides the shared bar on %s",
    (pathname) => expect(getMobileNavigationMode(pathname)).toBe("hidden"),
  );
});
