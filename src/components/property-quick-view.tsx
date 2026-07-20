"use client";

import Link from "next/link";
import { Popout } from "./popout";
import { PropertyImageSlider } from "./property-image-slider";
import { CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/properties";
import { PriceDisplay } from "@/components/price-display";
import { PropertyFacts } from "@/components/property-facts";
import { AmenityPills } from "@/components/amenity-icon";

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
          <div className="flex-1 overflow-y-auto pb-40 sm:pb-24">
            <div className="aspect-[4/3] w-full relative bg-black/5">
              <PropertyImageSlider 
                 images={property.images?.length ? property.images : [property.image]}
                 alt={property.title}
                 href={`/hotels/${property.slug}`}
                 sizes="(max-width: 640px) 100vw, 480px"
              />
            </div>
            
            <div className="space-y-6 p-4 sm:p-6">
              <div>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)]">
                  <MapPin size={12} /> {property.neighborhood}, {property.location}
                </span>
                <h3 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)] leading-tight">{property.title}</h3>
                <div className="mt-3"><PropertyFacts neighborhood={property.neighborhood} guests={property.guests} bedrooms={property.bedrooms} beds={property.beds} baths={property.baths} compact /></div>
                <p className="mt-2 text-sm text-[var(--muted)]">{property.type} · Up to {property.guests || 2} guests</p>
              </div>

              <div className="flex items-center gap-3 border-y border-[var(--line)] py-4">
                <div className="grid size-12 place-items-center rounded-full border border-[var(--gold)]/20 bg-[var(--gold-pale)] font-serif text-sm font-bold uppercase tracking-wider text-[var(--gold-deep)] shadow-inner">
                  New
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">Recently listed</p>
                  <span className="mt-0.5 block text-xs font-medium text-[var(--muted)]">
                    Verified StayRwanda residence
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">Amenities</h4>
                <AmenityPills amenities={property.amenities} limit={property.amenities.length} />
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
          
          <div className="absolute inset-x-0 bottom-0 z-20 flex shrink-0 flex-col gap-3 border-t border-[var(--line)] bg-white/95 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <PriceDisplay amountRwf={property.price} className="font-serif text-2xl font-semibold text-[var(--ink)]" />
            </div>
            <Link 
              href={`/stays/${property.slug}`} 
              className="button-3d flex min-h-12 w-full items-center justify-center bg-[var(--ink)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md transition-colors hover:bg-[var(--ink-2)] sm:w-auto"
            >
              View full details
            </Link>
          </div>
        </div>
      )}
    </Popout>
  )
}
