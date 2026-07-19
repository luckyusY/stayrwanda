"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, MapPin, Search, CheckCircle2, ShieldCheck, Eye } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { FilterDialog, FilterGroup } from "@/components/filter-dialog";
import { PropertyImageSlider } from "@/components/property-image-slider";
import { PropertyQuickView } from "@/components/property-quick-view";
import { PriceDisplay } from "@/components/price-display";
import { PropertyFacts } from "@/components/property-facts";
import { Reveal, RevealGroup } from "@/components/reveal";
import type { Property } from "@/lib/properties";

export function SearchResults({
  properties,
  initialDestination,
}: {
  properties: Property[];
  initialDestination: string;
}) {
  const [destination, setDestination] = useState(initialDestination);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  const results = useMemo(
    () =>
      properties.filter((property) => {
        const matchPlace =
          !destination ||
          `${property.location} ${property.neighborhood} ${property.title}`
            .toLowerCase()
            .includes(destination.toLowerCase());
        const matchType = !selectedTypes.length || selectedTypes.includes(property.type);
        const amenityText = property.amenities.join(" ").toLowerCase();
        const matchAmenities = !selectedAmenities.length || selectedAmenities.every((amenity) => amenityText.includes(amenity.toLowerCase()));
        const matchNeighborhood = !selectedNeighborhoods.length || selectedNeighborhoods.includes(property.neighborhood);
        return matchPlace && matchType && matchAmenities && matchNeighborhood;
      }),
    [properties, destination, selectedTypes, selectedAmenities, selectedNeighborhoods],
  );

  const toggle = (type: string) =>
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );

  const toggleValue = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const clearFilters = () => { setSelectedTypes([]); setSelectedAmenities([]); setSelectedNeighborhoods([]); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-5 truncate text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] sm:mb-6 sm:text-xs sm:tracking-[0.16em]">
        <Link href="/" className="hover:text-[var(--gold-deep)]">
          Home
        </Link>
        <span className="px-2">·</span>
        <span>Rwanda</span>
        <span className="px-2">·</span>
        <span className="text-[var(--ink)]">Search</span>
      </nav>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="hidden h-fit lg:sticky lg:top-24 lg:block">
          <div className="surface-3d glass-white p-5 rounded-xl shadow-md">
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">Refine</h2>
            <label className="mt-4 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Destination
            </label>
            <div className="search-field-well mt-1.5 flex items-center gap-2 px-3 py-1">
              <MapPin size={17} className="shrink-0 text-[var(--gold-deep)]" />
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Kigali, Kibagabaga…"
                className="search-field-input min-h-11"
              />
            </div>
            <label className="mt-4 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Check-in
            </label>
            <span className="search-field-well mt-1.5 block px-3 py-2.5">
              <input type="date" className="search-field-input min-h-6" />
            </span>
            <label className="mt-4 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Check-out
            </label>
            <span className="search-field-well mt-1.5 block px-3 py-2.5">
              <input type="date" className="search-field-input min-h-6" />
            </span>
          </div>

          <div className="surface-3d mt-5 overflow-hidden rounded-xl shadow-md bg-white">
            <h3 className="border-b border-[var(--line)] bg-[var(--parchment)] p-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
              Filter by
            </h3>
            <FilterGroup
              title="Property type"
              options={["Furnished apartment", "Serviced apartment", "Furnished home"]}
              selected={selectedTypes}
              toggle={toggle}
            />
            <FilterGroup
              title="Amenities"
              options={["Fully furnished", "Kitchen", "Parking", "Balcony"]}
              selected={selectedAmenities}
              toggle={(value) => toggleValue(value, setSelectedAmenities)}
            />
            <FilterGroup
              title="Neighbourhood"
              options={["Kibagabaga", "Kimironko", "Kagarama", "Kigali"]}
              selected={selectedNeighborhoods}
              toggle={(value) => toggleValue(value, setSelectedNeighborhoods)}
            />
          </div>
        </aside>

        {/* Results grid */}
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="eyebrow">{results.length} residences</p>
              <h1 className="mt-1 font-serif text-3xl font-semibold text-[var(--ink)] sm:mt-2">
                {destination || "Kigali"}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">Furnished stays matching your search</p>
            </div>
            <div className="self-start"><FilterDialog selectedTypes={selectedTypes} toggleType={toggle} selectedAmenities={selectedAmenities} toggleAmenity={(value) => toggleValue(value, setSelectedAmenities)} selectedNeighborhoods={selectedNeighborhoods} toggleNeighborhood={(value) => toggleValue(value, setSelectedNeighborhoods)} onClear={clearFilters} resultCount={results.length} /></div>
          </div>

          <div className="surface-3d mt-5 flex flex-col gap-2 rounded-lg bg-[var(--parchment)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-[var(--muted)]">Sorted by our recommendations</span>
            <button className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)]">
              Top picks <ChevronDown size={15} />
            </button>
          </div>

          {/* Prefer simple fade (no blur) so mobile Safari never leaves cards at opacity:0 */}
          <RevealGroup className="mt-5 space-y-4 sm:space-y-6">
            {results.map((property) => (
              <Reveal
                variant="fade"
                as="article"
                key={property.slug}
                className="surface-3d surface-3d-lift group flex min-w-0 flex-col overflow-hidden rounded-xl shadow-sm hover:border-[var(--gold)] hover:shadow-md sm:grid sm:grid-cols-[240px_1fr] sm:gap-5 sm:p-5"
              >
                <div className="relative w-full min-w-0 overflow-hidden aspect-[16/10] sm:aspect-[4/3] sm:rounded-lg">
                  <PropertyImageSlider
                    images={property.images?.length ? property.images : [property.image]}
                    alt={property.title}
                    href={`/stays/${property.slug}`}
                    sizes="(max-width: 639px) calc(100vw - 32px), 240px"
                    aspect="aspect-[16/10] sm:aspect-[4/3]"
                  />
                  <div className="absolute right-3 top-3 z-30 flex flex-col gap-2">
                    <FavoriteButton
                      hotelSlug={property.slug}
                      className="grid size-11 sm:size-9 place-items-center rounded-full bg-white/90 text-[var(--ink)] shadow transition-transform duration-200 hover:scale-110"
                    />
                    <button
                      onClick={() => setQuickViewSlug(property.slug)}
                      aria-label="Quick view property"
                      className="grid size-11 sm:size-9 place-items-center rounded-full bg-white/90 text-[var(--ink)] opacity-100 sm:opacity-0 shadow transition-all duration-200 hover:scale-110 group-hover:opacity-100 hover:text-[var(--gold-deep)]"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex min-w-0 flex-col p-4 sm:flex-row sm:justify-between sm:gap-6 sm:p-0">
                  <div className="min-w-0 flex-1">
                    <PropertyFacts neighborhood={property.neighborhood} guests={property.guests} bedrooms={property.bedrooms} beds={property.beds} baths={property.baths} compact />
                    <Link
                      href={`/stays/${property.slug}`}
                      className="mt-2 block font-serif text-lg sm:text-2xl font-semibold text-[var(--ink)] transition group-hover:text-[var(--gold-deep)]"
                    >
                      {property.title}
                    </Link>
                    <p className="mt-2 text-sm font-medium text-[var(--ink)]">{property.type}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)] sm:line-clamp-none">
                      {property.amenities.slice(0, 3).join(" · ")}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--parchment)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)]"><CheckCircle2 size={12} className="text-[var(--gold-deep)]" /> Free booking request</span>
                      <span className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--parchment)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)]"><ShieldCheck size={12} className="text-[var(--gold-deep)]" /> No prepayment</span>
                    </div>
                  </div>
                  <div className="mt-5 flex shrink-0 flex-row items-end justify-between border-t border-[var(--line)] pt-4 sm:mt-0 sm:w-44 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <div className="text-right">
                      <span className="hidden text-xs uppercase tracking-[0.14em] text-[var(--muted)] sm:inline">
                        {property.photoCount} photographs
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-[var(--muted)]">Indicative nightly rate</span>
                      <PriceDisplay amountRwf={property.price} className="mt-1 block font-serif text-xl font-semibold text-[var(--ink)]" />
                      <Link
                        href={`/stays/${property.slug}`}
                        className="button-3d group/cta mt-3 inline-flex items-center gap-1.5 bg-[var(--ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[var(--ink-2)]"
                      >
                        View stay
                        <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>

          {!results.length && (
            <div className="surface-3d mt-6 p-12 text-center rounded-xl">
              <Search className="mx-auto text-[var(--gold-deep)] mb-4" />
              <h2 className="font-serif text-2xl text-[var(--ink)]">No residences match these filters</h2>
              <button
                onClick={() => {
                  setDestination("");
                  clearFilters();
                }}
                className="button-3d mt-5 bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>

      <PropertyQuickView
        slug={quickViewSlug}
        properties={properties}
        onClose={() => setQuickViewSlug(null)}
      />

    </div>
  );
}
