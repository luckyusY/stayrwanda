"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, ChevronDown, Heart, MapPin, SlidersHorizontal } from "lucide-react";
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
  const [mobileFilters, setMobileFilters] = useState(false);

  const results = useMemo(
    () =>
      properties.filter((property) => {
        const matchPlace =
          !destination ||
          `${property.location} ${property.neighborhood} ${property.title}`
            .toLowerCase()
            .includes(destination.toLowerCase());
        const matchType = !selectedTypes.length || selectedTypes.includes(property.type);
        return matchPlace && matchType;
      }),
    [properties, destination, selectedTypes],
  );

  const toggle = (type: string) =>
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--gold-deep)]">
          Home
        </Link>
        <span className="px-2">·</span>
        <span>Rwanda</span>
        <span className="px-2">·</span>
        <span className="text-[var(--ink)]">Search</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className={`${mobileFilters ? "block" : "hidden"} h-fit lg:block`}>
          <div className="border border-[var(--line)] bg-[var(--cream)] p-5">
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">Refine</h2>
            <label className="mt-4 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Destination
            </label>
            <div className="mt-1.5 flex items-center gap-2 border border-[var(--line)] bg-white px-3">
              <MapPin size={17} className="text-[var(--gold-deep)]" />
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="min-h-11 min-w-0 flex-1 text-sm outline-none"
              />
            </div>
            <label className="mt-4 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Check-in
            </label>
            <input type="date" className="mt-1.5 min-h-11 w-full border border-[var(--line)] bg-white px-3 text-sm outline-none" />
            <label className="mt-4 block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Check-out
            </label>
            <input type="date" className="mt-1.5 min-h-11 w-full border border-[var(--line)] bg-white px-3 text-sm outline-none" />
          </div>

          <div className="mt-5 border border-[var(--line)]">
            <h3 className="border-b border-[var(--line)] bg-[var(--parchment)] p-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
              Filter by
            </h3>
            <FilterGroup title="Property type" options={["Furnished apartment", "Serviced apartment", "Furnished home"]} selected={selectedTypes} toggle={toggle} />
            <FilterGroup title="Amenities" options={["Fully furnished", "Private parking", "Kitchen", "Balcony"]} selected={[]} toggle={() => {}} />
            <FilterGroup title="Neighbourhood" options={["Kibagabaga", "Kimironko", "Kagarama", "Kigali"]} selected={[]} toggle={() => {}} />
          </div>
        </aside>

        <section>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{results.length} residences</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">
                {destination || "Kigali"}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">Furnished stays matching your search</p>
            </div>
            <button
              onClick={() => setMobileFilters(!mobileFilters)}
              className="flex items-center gap-2 border border-[var(--gold)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between border border-[var(--line)] bg-[var(--parchment)] px-4 py-3">
            <span className="text-sm text-[var(--muted)]">Sorted by our recommendations</span>
            <button className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)]">
              Top picks <ChevronDown size={15} />
            </button>
          </div>

          <div className="mt-5 space-y-6">
            {results.map((property) => (
              <article
                key={property.slug}
                className="grid gap-5 border border-[var(--line)] bg-white p-5 card-shadow sm:grid-cols-[240px_1fr]"
              >
                <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-56">
                  <Image src={property.image} alt={property.title} fill className="object-cover" sizes="240px" />
                  <button
                    className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 shadow"
                    aria-label="Save property"
                  >
                    <Heart size={18} className="text-[var(--ink)]" />
                  </button>
                </div>
                <div className="flex min-w-0 flex-col sm:flex-row sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      <MapPin size={13} className="text-[var(--gold-deep)]" /> {property.neighborhood}
                    </p>
                    <Link
                      href={`/stays/${property.slug}`}
                      className="mt-2 block font-serif text-2xl font-semibold text-[var(--ink)] hover:text-[var(--gold-deep)]"
                    >
                      {property.title}
                    </Link>
                    <p className="mt-2 text-sm font-medium text-[var(--ink)]">{property.type}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{property.amenities.slice(0, 3).join(" · ")}</p>
                    <p className="mt-4 inline-block border-l-2 border-[var(--gold)] pl-3 text-sm text-[var(--gold-deep)]">
                      Free booking request · No prepayment
                    </p>
                  </div>
                  <div className="mt-5 flex shrink-0 flex-row items-end justify-between sm:mt-0 sm:w-44 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                        {property.photoCount} photographs
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-[var(--muted)]">Rates confirmed by host</span>
                      <strong className="mt-1 block font-serif text-xl text-[var(--ink)]">On request</strong>
                      <Link
                        href={`/stays/${property.slug}`}
                        className="mt-3 inline-flex items-center bg-[var(--ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[var(--ink-2)]"
                      >
                        View stay
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!results.length && (
            <div className="mt-6 border border-[var(--line)] bg-white p-12 text-center">
              <h2 className="font-serif text-2xl text-[var(--ink)]">No residences match these filters</h2>
              <button
                onClick={() => {
                  setDestination("");
                  setSelectedTypes([]);
                }}
                className="mt-5 bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  toggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  toggle: (option: string) => void;
}) {
  return (
    <div className="border-b border-[var(--line)] p-4 last:border-0">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">{title}</h4>
      <div className="mt-3 space-y-3">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2.5 text-sm">
            <button
              onClick={() => toggle(option)}
              className={`grid size-5 shrink-0 place-items-center border ${
                selected.includes(option)
                  ? "border-[var(--gold)] bg-[var(--gold)] text-white"
                  : "border-[var(--muted)]"
              }`}
              aria-label={`Filter by ${option}`}
            >
              {selected.includes(option) && <Check size={13} />}
            </button>
            <span className="text-[var(--foreground)]">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
