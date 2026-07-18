"use client";

import { useCurrency } from "@/components/currency-provider";

export function PriceDisplay({
  amountRwf,
  prefix = "From",
  className = "",
}: {
  amountRwf?: number;
  prefix?: string;
  className?: string;
}) {
  const { format } = useCurrency();
  if (!amountRwf || amountRwf < 1) return <span className={className}>Rate on request</span>;

  return (
    <span className={className}>
      {prefix && <span className="mr-1 text-[0.7em] font-sans font-medium text-[var(--muted)]">{prefix}</span>}
      {format(amountRwf)}
      <span className="ml-1 text-[0.7em] font-sans font-medium text-[var(--muted)]">/ night</span>
    </span>
  );
}
