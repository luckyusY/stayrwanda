export const SEEDED_NIGHTLY_RATES_RWF = {
  "kibagabaga-apartment-one": 85000,
  "kibagabaga-apartment-two": 90000,
  "kimironko-twin-apartment": 80000,
  "kagarama-furnished-residence": 75000,
  "tg-executive-apartment": 120000,
  "rebeccas-furnished-apartment": 100000,
  "mama-lina-kimironko-home": 110000,
} as const;

export function seededNightlyRateRwf(slug: string) {
  return SEEDED_NIGHTLY_RATES_RWF[slug as keyof typeof SEEDED_NIGHTLY_RATES_RWF];
}

export function formatRwf(value: number) {
  return `RWF ${Math.round(value).toLocaleString("en-RW")}`;
}

/** Format an ISO date string (YYYY-MM-DD) into e.g. "Fri 8 Aug 2025" */
export function formatDate(iso: string): string {
  if (!iso || iso === "—") return iso;
  const d = new Date(`${iso}T12:00:00Z`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Kigali",
  });
}

/** Number of days from today until the given ISO date. Negative means past. */
export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

