"use client";

import Link from "next/link";
import { Popout } from "./popout";
import { PropertyImageSlider } from "./property-image-slider";
import { CheckCircle2, MapPin, ShieldCheck, Star } from "lucide-react";
import type { Property } from "@/lib/properties";
import { useCurrency } from "@/components/currency-provider";

export function PropertyQuickView({
  slug,
  properties,
  onClose
}: {
  slug: string | null;
  properties: Property[];
  onClose: () => void;
}) {
  const property = properties.find(p => p.slug === slug);
  const { format } = useCurrency();

  return (
    <Popout
      variant="sheet"
      isOpen={!!property}
      onClose={onClose}
      title="Property preview"
      className="w-full sm:w-[480px] bg-[#fdfcfb] flex flex-col h-full"
    >
      {property && (
        <div className="flex flex-col h-full overflow-hidden relative">
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="aspect-[4/3] w-full relative bg-black/5">
              <PropertyImageSlider 
                 images={property.images?.length ? property.images : [property.image]}
                 alt={property.title}
                 sizes="(max-width: 640px) 100vw, 480px"
              />
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)]">
                  <MapPin size={12} /> {property.neighborhood}, {property.location}
                </span>
                <h3 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)] leading-tight">{property.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{property.type} · Up to {property.units[0]?.maxGuests || 2} guests</p>
              </div>

              <div className="flex items-center gap-3 border-y border-[var(--line)] py-4">
                <div className="grid size-12 place-items-center rounded-full bg-[var(--gold-pale)] text-[var(--gold-deep)] font-serif font-bold text-xl shadow-inner border border-[var(--gold)]/20">4.9</div>
                <div>
                  <div className="flex gap-0.5 text-[var(--gold)]">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current opacity-40" />
                  </div>
                  <span className="text-xs text-[var(--muted)] font-medium mt-0.5 block">Exceptional · 24 reviews</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map(am => (
                    <span key={am} className="amenity-pill bg-white border border-[var(--line)] text-[var(--ink)] rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm transition-colors hover:bg-[var(--parchment)]">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--parchment)] p-5 rounded-xl border border-[var(--line)] shadow-sm space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">StayRwanda Assurances</h4>
                <div className="flex items-start gap-3 text-sm text-[var(--ink)]">
                  <CheckCircle2 size={18} className="text-[var(--gold-deep)] shrink-0 mt-0.5" />
                  <span><strong>Personally verified</strong> by our local concierge team to guarantee quality and accuracy.</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[var(--ink)]">
                  <ShieldCheck size={18} className="text-[var(--gold-deep)] shrink-0 mt-0.5" />
                  <span><strong>Secure booking</strong> with no prepayment required until host confirmation.</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 inset-x-0 shrink-0 border-t border-[var(--line)] bg-white/95 backdrop-blur-md p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] flex items-center justify-between z-20">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Starting from</p>
              <div className="font-serif text-2xl font-semibold text-[var(--ink)]">
                {format(property.units[0]?.basePriceRwf || 85000)}
                <span className="text-sm font-sans font-normal text-[var(--muted)] ml-1">/ night</span>
              </div>
            </div>
            <Link 
              href={`/stays/${property.slug}`} 
              className="button-3d bg-[var(--ink)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[var(--ink-2)] shadow-md transition-colors"
            >
              View full details
            </Link>
          </div>
        </div>
      )}
    </Popout>
  )
}
