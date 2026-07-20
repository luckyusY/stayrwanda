import { describe, expect, it } from "vitest";
import { stayDates } from "@/lib/booking-service";
import { bookingRequestSchema, hotelDraftSchema } from "@/lib/schemas";

describe("nightly allocation dates", () => {
  it("includes check-in and excludes check-out", () => {
    expect(stayDates("2026-08-01", "2026-08-04")).toEqual(["2026-08-01", "2026-08-02", "2026-08-03"]);
  });
  it("rejects reverse and zero-night stays", () => {
    expect(() => stayDates("2026-08-04", "2026-08-04")).toThrow("INVALID_DATES");
    expect(() => stayDates("2026-08-05", "2026-08-04")).toThrow("INVALID_DATES");
  });
  it("limits excessive inventory ranges", () => {
    expect(() => stayDates("2026-01-01", "2027-01-01")).toThrow("STAY_TOO_LONG");
  });
});

describe("public booking contract", () => {
  const valid = { hotelId: "507f1f77bcf86cd799439011", unitTypeId: "507f1f77bcf86cd799439012", guestName: "Test Guest", email: "guest@example.com", checkIn: "2026-08-01", checkOut: "2026-08-03", guests: 2 };
  it("normalizes optional booking fields", () => {
    expect(bookingRequestSchema.parse(valid)).toMatchObject({ quantity: 1, currency: "RWF", phone: "" });
  });
  it("rejects invalid email and excessive guests", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, email: "bad", guests: 100 }).success).toBe(false);
  });
  it.each(["RWF", "USD", "EUR", "GBP", "KES", "UGX", "TZS"])("accepts the displayed %s currency", (currency) => {
    expect(bookingRequestSchema.safeParse({ ...valid, currency }).success).toBe(true);
  });
});

describe("hotel publishing guardrails", () => {
  it("requires a complete story and gallery", () => {
    const result = hotelDraftSchema.safeParse({ organizationId: "org", name: "Hotel", slug: "hotel", category: "hotel", description: "short", location: { address: "Kigali", neighborhood: "Kacyiru", city: "Kigali", country: "Rwanda" }, gallery: [], amenities: [] });
    expect(result.success).toBe(false);
  });
});
