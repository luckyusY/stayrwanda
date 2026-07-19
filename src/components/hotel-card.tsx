import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import type { Hotel } from "@/lib/platform-types";
import { FavoriteButton } from "@/components/favorite-button";
import { PriceDisplay } from "@/components/price-display";
import { PropertyImageSlider } from "@/components/property-image-slider";
import { PropertyFacts } from "@/components/property-facts";

export function HotelCard({ hotel, onQuickView }: { hotel: Hotel; onQuickView?: () => void }) {
  return <article className="surface-3d surface-3d-lift group overflow-hidden relative">
    <div className="relative block aspect-[4/3] overflow-hidden bg-[var(--cream)]">
      <PropertyImageSlider images={hotel.gallery?.length ? hotel.gallery : hotel.heroImage ? [hotel.heroImage] : []} alt={hotel.name} href={`/hotels/${hotel.slug}`} sizes="(max-width: 768px) 100vw, 33vw" />
      <span className="absolute left-4 top-4 z-10 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--ink)]">{hotel.category}</span>
      <span className="absolute bottom-4 left-4 z-10 rounded-full bg-[var(--gold-pale)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--gold-deep)]">New</span>
      
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <FavoriteButton hotelSlug={hotel.slug} className="grid size-9 place-items-center rounded-full bg-white/90 text-[var(--ink)] shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--gold-deep)]" />
        <button 
          onClick={onQuickView}
          aria-label="Quick view property"
          className="grid size-9 place-items-center rounded-full bg-white/90 text-[var(--ink)] shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--gold-deep)]"
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
    
    <div className="p-5">
      <PropertyFacts neighborhood={hotel.location.neighborhood} city={hotel.location.city} guests={hotel.unitSummary?.maxGuests} bedrooms={hotel.unitSummary?.bedrooms} beds={hotel.unitSummary?.beds} baths={hotel.unitSummary?.baths} compact />
      
      <Link href={`/hotels/${hotel.slug}`} className="mt-2 block font-serif text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--gold-deep)]">{hotel.name}</Link>
      
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{hotel.description}</p>
      
      <div className="mt-5 flex items-end justify-between gap-3">
        <PriceDisplay amountRwf={hotel.startingPriceRwf} className="font-serif text-lg font-semibold text-[var(--ink)]" />
        <Link href={`/hotels/${hotel.slug}`} className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[var(--gold-deep)] transition-transform hover:translate-x-1">View profile <ArrowRight size={14} /></Link>
      </div>
    </div>
  </article>;
}
