"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, ChevronDown, Heart, MapPin, SlidersHorizontal, Star } from "lucide-react";
import type { Property } from "@/lib/properties";

export function SearchResults({ properties, initialDestination }: { properties: Property[]; initialDestination: string }) {
  const [destination, setDestination] = useState(initialDestination);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [mobileFilters, setMobileFilters] = useState(false);
  const results = useMemo(() => properties.filter((property) => {
    const matchPlace = !destination || `${property.location} ${property.neighborhood} ${property.title}`.toLowerCase().includes(destination.toLowerCase());
    const matchType = !selectedTypes.length || selectedTypes.includes(property.type);
    return matchPlace && matchType;
  }), [properties, destination, selectedTypes]);

  const toggle = (type: string) => setSelectedTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]);

  return <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
    <nav className="mb-5 text-xs text-[#006ce4]"><Link href="/">Home</Link><span className="px-2 text-[#777]">›</span><span>Kigali</span><span className="px-2 text-[#777]">›</span><span className="text-[#1a1a1a]">Search results</span></nav>
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className={`${mobileFilters ? "block" : "hidden"} h-fit lg:block`}>
        <div className="rounded-lg bg-[#febb02] p-4"><h2 className="text-xl font-bold">Search</h2><label className="mt-3 block text-xs font-bold">Destination/property name</label><div className="mt-1 flex items-center gap-2 rounded bg-white px-3"><MapPin size={18} /><input value={destination} onChange={(event) => setDestination(event.target.value)} className="min-h-10 min-w-0 flex-1 text-sm outline-none" /></div><label className="mt-3 block text-xs font-bold">Check-in date</label><input type="date" className="mt-1 min-h-10 w-full rounded border-0 px-3 text-sm" /><label className="mt-3 block text-xs font-bold">Check-out date</label><input type="date" className="mt-1 min-h-10 w-full rounded border-0 px-3 text-sm" /><button className="mt-3 w-full rounded bg-[#006ce4] py-3 font-bold text-white">Search</button></div>
        <div className="mt-4 rounded-lg border border-[#ddd]"><h3 className="border-b border-[#ddd] p-4 font-bold">Filter by:</h3><FilterGroup title="Property type" options={["Furnished apartment", "Serviced apartment", "Furnished home"]} selected={selectedTypes} toggle={toggle} /><FilterGroup title="Popular filters" options={["Fully furnished", "Private parking", "Kitchen", "Balcony"]} selected={[]} toggle={() => {}} /><FilterGroup title="Neighborhood" options={["Kibagabaga", "Kimironko", "Kagarama", "Kigali"]} selected={[]} toggle={() => {}} /></div>
      </aside>

      <section>
        <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-extrabold">{destination || "Kigali"}: {results.length} properties found</h1><p className="mt-1 text-sm text-[#595959]">Furnished stays matching your search</p></div><button onClick={() => setMobileFilters(!mobileFilters)} className="flex items-center gap-2 rounded border border-[#006ce4] px-3 py-2 text-sm font-bold text-[#006ce4] lg:hidden"><SlidersHorizontal size={17} /> Filters</button></div>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-[#ddd] px-4 py-3"><span className="text-sm">Sort by our top picks</span><button className="flex items-center gap-2 text-sm font-bold text-[#006ce4]">Top picks <ChevronDown size={16} /></button></div>
        <div className="mt-4 space-y-4">
          {results.map((property) => <article key={property.slug} className="grid gap-4 rounded-lg border border-[#ddd] p-4 shadow-sm sm:grid-cols-[220px_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md sm:aspect-auto sm:min-h-52"><Image src={property.image} alt={property.title} fill className="object-cover" sizes="220px" /><button className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white shadow" aria-label="Save property"><Heart size={20} /></button></div>
            <div className="flex min-w-0 flex-col sm:flex-row sm:justify-between sm:gap-5">
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Link href={`/stays/${property.slug}`} className="text-xl font-bold text-[#006ce4] hover:underline">{property.title}</Link><span className="rounded bg-[#008234] px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span></div><p className="mt-1 text-xs"><button className="text-[#006ce4] underline">{property.neighborhood}</button><span className="px-1">·</span><button className="text-[#006ce4] underline">Show on map</button></p><p className="mt-3 text-sm font-bold">{property.type}</p><p className="mt-1 text-sm text-[#595959]">{property.amenities.slice(0, 3).join(" · ")}</p><p className="mt-3 border-l-2 border-[#008234] pl-2 text-sm font-semibold text-[#008234]">Free booking request · No payment required</p></div>
              <div className="mt-4 flex shrink-0 flex-row items-end justify-between sm:mt-0 sm:w-40 sm:flex-col"><div className="flex items-center gap-2"><div className="text-right"><strong className="block text-sm">New listing</strong><span className="text-xs text-[#595959]">{property.photoCount} photos</span></div><span className="grid size-9 place-items-center rounded-[6px_6px_6px_0] bg-[#003b95] text-white"><Star size={15} fill="white" /></span></div><div className="text-right"><span className="text-xs text-[#595959]">Rates confirmed by host</span><strong className="mt-1 block">Request price</strong><Link href={`/stays/${property.slug}`} className="mt-3 inline-flex items-center rounded bg-[#006ce4] px-4 py-2.5 text-sm font-bold text-white">See availability</Link></div></div>
            </div>
          </article>)}
        </div>
        {!results.length && <div className="mt-5 rounded-lg border border-[#ddd] p-10 text-center"><h2 className="text-xl font-bold">No properties match these filters</h2><button onClick={() => { setDestination(""); setSelectedTypes([]); }} className="mt-4 rounded bg-[#006ce4] px-4 py-2 text-sm font-bold text-white">Clear filters</button></div>}
      </section>
    </div>
  </div>;
}

function FilterGroup({ title, options, selected, toggle }: { title: string; options: string[]; selected: string[]; toggle: (option: string) => void }) {
  return <div className="border-b border-[#ddd] p-4 last:border-0"><h4 className="font-bold">{title}</h4><div className="mt-3 space-y-3">{options.map((option) => <label key={option} className="flex cursor-pointer items-center gap-2 text-sm"><button onClick={() => toggle(option)} className={`grid size-5 place-items-center rounded-sm border ${selected.includes(option) ? "border-[#006ce4] bg-[#006ce4] text-white" : "border-[#868686]"}`} aria-label={`Filter by ${option}`}>{selected.includes(option) && <Check size={14} />}</button><span>{option}</span></label>)}</div></div>;
}
