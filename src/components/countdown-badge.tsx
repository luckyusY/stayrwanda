"use client";

import { daysUntil } from "@/lib/pricing";

export function CountdownBadge({ checkIn }: { checkIn: string }) {
  const days = daysUntil(checkIn);
  if (days < 0 || days > 7) return null;

  const label = days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `In ${days} days`;
  const colour =
    days === 0
      ? "bg-[var(--rwanda-green)] text-white"
      : days === 1
      ? "bg-[var(--rwanda-green)] text-white"
      : "bg-[var(--gold-pale)] text-[var(--gold-deep)]";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colour}`}>
      <span className="size-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      {label}
    </span>
  );
}
