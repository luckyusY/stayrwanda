"use client";

import { useState } from "react";
import type { Hotel } from "@/lib/platform-types";
import { HotelCard } from "@/components/hotel-card";
import { PropertyQuickView } from "@/components/property-quick-view";
import type { Property } from "@/lib/properties";

export function HotelDirectory({ hotels, eyebrow, title, copy }: { hotels: Hotel[]; eyebrow: string; title: string; copy: string }) {
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  const mappedProperties: Property[] = hotels.map((h) => ({
    slug: h.slug,
    title: h.name,
    location: `${h.location.neighborhood}, ${h.location.city}`,
    neighborhood: h.location.neighborhood,
    type: h.category === "hotel" ? "Hotel room" : h.category === "guesthouse" ? "Guesthouse room" : "Furnished residence",
    price: h.startingPriceRwf,
    guests: h.unitSummary?.maxGuests,
    bedrooms: h.unitSummary?.bedrooms,
    beds: h.unitSummary?.beds,
    baths: h.unitSummary?.baths,
    image: h.heroImage || "",
    images: h.gallery || [],
    amenities: h.amenities || [],
    description: h.description || "",
    host: "StayRwanda Hospitality Partner",
    sourceUrl: "",
    photoCount: h.gallery?.length || 0,
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-[var(--ink)] sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">{copy}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onQuickView={() => setQuickViewSlug(hotel.slug)}
          />
        ))}
      </div>
      {!hotels.length && (
        <div className="surface-3d mt-10 bg-[var(--cream)] p-6 text-center sm:p-10">
          <h2 className="font-serif text-2xl text-[var(--ink)]">More places are being prepared</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Our local team is reviewing new profiles now.</p>
        </div>
      )}
      <PropertyQuickView
        slug={quickViewSlug}
        properties={mappedProperties}
        onClose={() => setQuickViewSlug(null)}
      />
    </section>
  );
}
