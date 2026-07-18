"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, ArrowRight, Undo2, Bed } from "lucide-react";
import { useRouter } from "next/navigation";
import { PriceDisplay } from "@/components/price-display";
import type { GuestFavorite } from "@/lib/guest-account";

export function GuestFavoriteCard({ favorite }: { favorite: GuestFavorite }) {
  const router = useRouter();
  const [removed, setRemoved] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleRemove() {
    setRemoved(true);
    setUndoVisible(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(async () => {
      setUndoVisible(false);
      // Commit the removal
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ hotelSlug: favorite.slug }),
      });
      router.refresh();
    }, 4000);
  }

  async function handleUndo() {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setRemoved(false);
    setUndoVisible(false);
  }

  useEffect(() => () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }, []);

  if (removed && !undoVisible) return null;

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
        removed ? "opacity-40 scale-[0.98]" : "border-[var(--line)] hover:shadow-md"
      }`}
    >
      {/* Image */}
      <Link href={`/hotels/${favorite.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-[var(--cream)]">
        {favorite.heroImage ? (
          <Image
            src={favorite.heroImage}
            alt={favorite.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--gold-deep)]">
            <Bed size={36} strokeWidth={1} />
          </div>
        )}
        {/* Saved badge */}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--gold-deep)] shadow-sm backdrop-blur-sm">
          <Heart size={11} fill="currentColor" /> Saved
        </span>
      </Link>

      {/* Content */}
      <div className="p-5">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <MapPin size={12} className="text-[var(--gold-deep)]" />
          {favorite.neighborhood}, {favorite.city}
        </p>

        <Link
          href={`/hotels/${favorite.slug}`}
          className="mt-2 block font-serif text-xl font-bold leading-snug text-[var(--ink)] transition hover:text-[var(--gold-deep)] line-clamp-1"
        >
          {favorite.name}
        </Link>

        {favorite.amenities.length > 0 && (
          <p className="mt-1.5 line-clamp-1 text-xs text-[var(--muted)]">
            {favorite.amenities.slice(0, 3).join(" · ")}
          </p>
        )}

        {/* Price + CTA */}
        <div className="mt-4 border-t border-[var(--line)] pt-4">
          <PriceDisplay
            amountRwf={favorite.startingPriceRwf}
            className="font-serif text-lg font-semibold text-[var(--ink)]"
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={`/hotels/${favorite.slug}`}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--ink)] py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--ink-2)]"
            >
              Book stay <ArrowRight size={11} />
            </Link>
            <button
              type="button"
              onClick={handleRemove}
              disabled={removed}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--line)] py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] transition hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] disabled:opacity-40"
            >
              <Heart size={13} fill={removed ? "currentColor" : "none"} />
              {removed ? "Removed" : "Unsave"}
            </button>
          </div>
        </div>
      </div>

      {/* Undo Toast */}
      {undoVisible && (
        <div className="border-t border-[var(--line)] bg-[var(--parchment)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--muted)]">Removed from saved stays</p>
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--gold)] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold-deep)] transition hover:bg-[var(--gold-pale)]"
            >
              <Undo2 size={12} /> Undo
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className="h-full bg-[var(--gold)] rounded-full"
              style={{ animation: "shrink-bar 4s linear forwards" }}
            />
          </div>
        </div>
      )}
    </article>
  );
}
