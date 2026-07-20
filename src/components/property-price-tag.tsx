"use client";

import { useCurrency } from "@/components/currency-provider";

export function PropertyPriceTag({ amountRwf, className = "" }: { amountRwf?: number; className?: string }) {
  const { format } = useCurrency();

  return (
    <div className={`pointer-events-none border-l-4 border-[var(--gold)] bg-white px-3.5 py-2.5 text-[var(--ink)] shadow-[0_8px_24px_rgba(20,34,58,.2)] ${className}`}>
      {amountRwf && amountRwf > 0 ? (
        <>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)]">From</span>
          <span className="mt-0.5 block whitespace-nowrap font-serif text-xl font-bold leading-none sm:text-2xl">{format(amountRwf)}</span>
          <span className="mt-1 block text-[10px] font-medium text-[var(--muted)]">per night</span>
        </>
      ) : (
        <span className="block whitespace-nowrap font-serif text-lg font-bold">Rate on request</span>
      )}
    </div>
  );
}
