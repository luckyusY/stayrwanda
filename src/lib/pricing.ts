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
