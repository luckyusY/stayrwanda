import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, BedDouble, Bath, Users, Wifi, Car, ChefHat, Eye } from "lucide-react";
import type { Hotel } from "@/lib/platform-types";
import { FavoriteButton } from "@/components/favorite-button";

export function HotelCard({ hotel, onQuickView }: { hotel: Hotel; onQuickView?: () => void }) {
  return <article className="surface-3d surface-3d-lift group overflow-hidden relative">
    <div className="relative block aspect-[4/3] overflow-hidden bg-[var(--cream)]">
      <Link href={`/hotels/${hotel.slug}`} className="absolute inset-0 z-0">
        {hotel.heroImage && <Image src={hotel.heroImage} alt={hotel.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />}
      </Link>
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
      <div className="flex items-start justify-between gap-4">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-[.14em] text-[var(--muted)]"><MapPin size={13} className="text-[var(--gold-deep)]" />{hotel.location.neighborhood}, {hotel.location.city}</p>
      </div>
      
      <Link href={`/hotels/${hotel.slug}`} className="mt-2 block font-serif text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--gold-deep)]">{hotel.name}</Link>
      
      <div className="mt-3 flex items-center gap-3 text-[var(--muted)]">
        <div className="flex items-center gap-1.5" title="Bedrooms"><BedDouble size={14} className="text-[var(--gold-mid)]" /> <span className="text-xs">2</span></div>
        <div className="h-1 w-1 rounded-full bg-[var(--line)]" />
        <div className="flex items-center gap-1.5" title="Bathrooms"><Bath size={14} className="text-[var(--gold-mid)]" /> <span className="text-xs">2</span></div>
        <div className="h-1 w-1 rounded-full bg-[var(--line)]" />
        <div className="flex items-center gap-1.5" title="Guests"><Users size={14} className="text-[var(--gold-mid)]" /> <span className="text-xs">4</span></div>
        <div className="h-1 w-1 rounded-full bg-[var(--line)]" />
        <div className="flex items-center gap-2">
          {hotel.amenities.includes("WiFi") && <span title="High-speed WiFi" className="flex items-center"><Wifi size={14} className="text-[var(--gold-mid)]" /></span>}
          {hotel.amenities.includes("Parking") && <span title="Private parking" className="flex items-center"><Car size={14} className="text-[var(--gold-mid)]" /></span>}
          {hotel.amenities.includes("Chef") && <span title="Private chef available" className="flex items-center"><ChefHat size={14} className="text-[var(--gold-mid)]" /></span>}
        </div>
      </div>
      
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{hotel.description}</p>
      
      <Link href={`/hotels/${hotel.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[var(--gold-deep)] transition-transform hover:translate-x-1">View profile <ArrowRight size={14} /></Link>
    </div>
  </article>;
}
