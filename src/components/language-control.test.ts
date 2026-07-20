import { describe, expect, it } from "vitest";
import { buildGoogleTranslateUrl } from "./language-control";

describe("buildGoogleTranslateUrl", () => {
  it("keeps the current page and requests the selected Google translation", () => {
    const result = new URL(buildGoogleTranslateUrl("https://stayrwanda.com/hotels/kigali?guests=2", "rw"));

    expect(result.origin).toBe("https://translate.google.com");
    expect(result.pathname).toBe("/translate");
    expect(result.searchParams.get("sl")).toBe("en");
    expect(result.searchParams.get("tl")).toBe("rw");
    expect(result.searchParams.get("u")).toBe("https://stayrwanda.com/hotels/kigali?guests=2");
  });
});
