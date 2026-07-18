"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PriceDisplay } from "@/components/price-display";
import type { GuestFavorite } from "@/lib/guest-account";

export function GuestFavoriteCard({ favorite }: { favorite: GuestFavorite }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  async function remove() {
    setRemoving(true);
    const response = await fetch("/api/favorites", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ hotelSlug: favorite.slug }) });
    if (response.ok) router.refresh(); else setRemoving(false);
  }
  return <article className="surface-3d surface-3d-lift overflow-hidden bg-white">
    <Link href={`/hotels/${favorite.slug}`} className="relative block aspect-[4/3] bg-[var(--cream)]">{favorite.heroImage && <Image src={favorite.heroImage} alt={favorite.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />}</Link>
    <div className="p-5"><p className="flex items-center gap-1 text-xs uppercase tracking-[.12em] text-[var(--muted)]"><MapPin size={13} className="text-[var(--gold-deep)]" />{favorite.neighborhood}, {favorite.city}</p><Link href={`/hotels/${favorite.slug}`} className="mt-2 block font-serif text-2xl font-semibold text-[var(--ink)] hover:text-[var(--gold-deep)]">{favorite.name}</Link><p className="mt-2 line-clamp-1 text-sm text-[var(--muted)]">{favorite.amenities.slice(0, 3).join(" · ") || "Verified StayRwanda property"}</p><div className="mt-5 flex items-end justify-between gap-3"><PriceDisplay amountRwf={favorite.startingPriceRwf} className="font-serif text-lg font-semibold text-[var(--ink)]" /><button onClick={remove} disabled={removing} className="button-3d grid size-10 place-items-center bg-[var(--parchment)] text-[var(--gold-deep)] disabled:opacity-50" aria-label={`Remove ${favorite.name} from saved properties`}><Heart size={18} fill="currentColor" /></button></div></div>
  </article>;
}
