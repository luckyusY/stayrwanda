import { Bath, BedDouble, MapPin, Users } from "lucide-react";

type PropertyFactsProps = {
  neighborhood: string;
  city?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  baths?: number;
  compact?: boolean;
};

export function propertyMapUrl(neighborhood: string, city = "Kigali") {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${neighborhood}, ${city}, Rwanda`)}`;
}

export function PropertyFacts({ neighborhood, city = "Kigali", guests, bedrooms, beds, baths, compact = false }: PropertyFactsProps) {
  const itemClass = `inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--parchment)] px-2.5 text-[var(--ink)] ${compact ? "text-[10px]" : "text-xs"}`;
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Property details">
      <a href={propertyMapUrl(neighborhood, city)} target="_blank" rel="noopener noreferrer" className={`${itemClass} font-semibold text-[var(--gold-deep)] hover:border-[var(--gold)]`} aria-label={`Open approximate location for ${neighborhood}, ${city} in Google Maps`}>
        <MapPin size={13} aria-hidden /> {neighborhood}, {city}
      </a>
      {!!guests && <span className={itemClass} title="Maximum guests"><Users size={13} className="text-[var(--gold-deep)]" aria-hidden /> {guests} guests</span>}
      {!!(bedrooms || beds) && <span className={itemClass} title="Bedrooms and beds"><BedDouble size={13} className="text-[var(--gold-deep)]" aria-hidden /> {bedrooms || beds} {bedrooms ? "bedrooms" : "beds"}</span>}
      {!!baths && <span className={itemClass} title="Bathrooms"><Bath size={13} className="text-[var(--gold-deep)]" aria-hidden /> {baths} baths</span>}
    </div>
  );
}
