"use client";

export type ConversionEventName =
  | "property_viewed"
  | "booking_started"
  | "booking_step_completed"
  | "booking_submitted"
  | "booking_succeeded"
  | "booking_failed"
  | "concierge_opened";

type EventProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Non-PII conversion events. A configured analytics provider can consume dataLayer. */
export function trackConversionEvent(name: ConversionEventName, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;
  const safeProperties = Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
  window.dataLayer?.push({ event: `stayrwanda_${name}`, ...safeProperties });
  window.dispatchEvent(new CustomEvent("stayrwanda:conversion", { detail: { name, properties: safeProperties } }));
}
