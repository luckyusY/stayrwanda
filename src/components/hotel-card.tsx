import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import type { Hotel } from "@/lib/platform-types";
import { FavoriteButton } from "@/components/favorite-button";
import { PropertyImageSlider } from "@/components/property-image-slider";
import { PropertyFacts } from "@/components/property-facts";
import { PropertyPriceTag } from "@/components/property-price-tag";

export function HotelCard({ hotel, onQuickView }: { hotel: Hotel; onQuickView?: () => void }) {
  return <article className="surface-3d surface-3d-lift group overflow-hidden relative">
    <div className="relative block aspect-[4/3] overflow-hidden bg-[var(--cream)]">
      <PropertyImageSlider images={hotel.gallery?.length ? hotel.gallery : hotel.heroImage ? [hotel.heroImage] : []} alt={hotel.name} href={`/hotels/${hotel.slug}`} sizes="(max-width: 768px) 100vw, 33vw" />
      <span className="absolute left-4 top-4 z-10 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--ink)]">{hotel.category}</span>
      <PropertyPriceTag amountRwf={hotel.startingPriceRwf} className="absolute bottom-4 left-0 z-20" />
      
      <div className="absolute right-3 top-3 z-30 flex flex-row-reverse gap-2 sm:right-4 sm:top-4 sm:flex-col">
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
      <Link href={`/hotels/${hotel.slug}`} className="block font-serif text-2xl font-semibold leading-tight text-[var(--ink)] group-hover:text-[var(--gold-deep)]">{hotel.name}</Link>

      <PropertyFacts neighborhood={hotel.location.neighborhood} city={hotel.location.city} guests={hotel.unitSummary?.maxGuests} bedrooms={hotel.unitSummary?.bedrooms} beds={hotel.unitSummary?.beds} baths={hotel.unitSummary?.baths} variant="card" />
      
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{hotel.description}</p>
      
      <div className="mt-5 flex items-end justify-end gap-3">
        <Link href={`/hotels/${hotel.slug}`} className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[var(--gold-deep)] transition-transform hover:translate-x-1">View profile <ArrowRight size={14} /></Link>
      </div>
    </div>
  </article>;
}
