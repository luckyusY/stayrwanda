"use client";

import { useMemo, useState } from "react";
import { GuestFavoriteCard } from "@/components/guest-favorite-card";
import type { GuestFavorite } from "@/lib/guest-account";

type SortKey = "saved" | "price_asc" | "price_desc" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "saved",      label: "Date saved" },
  { value: "price_asc",  label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
  { value: "name",       label: "Name A → Z" },
];

export function FavoritesGrid({ hotels }: { hotels: GuestFavorite[] }) {
  const [sort, setSort] = useState<SortKey>("saved");

  const sorted = useMemo(() => {
    const copy = [...hotels];
    if (sort === "price_asc")
      return copy.sort((a, b) => (a.startingPriceRwf ?? 0) - (b.startingPriceRwf ?? 0));
    if (sort === "price_desc")
      return copy.sort((a, b) => (b.startingPriceRwf ?? 0) - (a.startingPriceRwf ?? 0));
    if (sort === "name")
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy; // "saved" = insertion order
  }, [hotels, sort]);

  return (
    <div className="space-y-5">
      {/* Header: count + sort */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-bold text-[var(--ink)]">Saved Stays</span>
          <span className="rounded-full bg-[var(--gold-pale)] px-2.5 py-0.5 text-xs font-bold text-[var(--gold-deep)]">
            {hotels.length}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs sm:justify-start">
          <span className="text-[var(--muted)]">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-[var(--ink)] outline-none focus:border-[var(--gold)]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {sorted.map((hotel) => (
          <GuestFavoriteCard key={hotel.id} favorite={hotel} />
        ))}
      </div>
    </div>
  );
}
