import { Bath, BedDouble, BedSingle, MapPin, Users } from "lucide-react";

type PropertyFactsProps = {
  neighborhood: string;
  city?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  baths?: number;
  compact?: boolean;
  variant?: "pills" | "card";
};

export function propertyMapUrl(neighborhood: string, city = "Kigali") {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${neighborhood}, ${city}, Rwanda`)}`;
}

export function PropertyFacts({ neighborhood, city = "Kigali", guests, bedrooms, beds, baths, compact = false, variant = "pills" }: PropertyFactsProps) {
  if (variant === "card") {
    const facts = [
      guests ? { label: "Guests", value: guests, Icon: Users } : null,
      bedrooms ? { label: "Bedrooms", value: bedrooms, Icon: BedDouble } : null,
      beds ? { label: "Beds", value: beds, Icon: BedSingle } : null,
      baths ? { label: "Baths", value: baths, Icon: Bath } : null,
    ].filter(Boolean) as Array<{ label: string; value: number; Icon: typeof Users }>;

    return (
      <div aria-label="Property details">
        <a href={propertyMapUrl(neighborhood, city)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-[var(--gold-deep)] hover:text-[var(--ink)]" aria-label={`Open approximate location for ${neighborhood}, ${city} in Google Maps`}>
          <span className="grid size-7 place-items-center rounded-lg bg-[var(--gold-pale)]"><MapPin size={15} aria-hidden /></span>
          {neighborhood}, {city}
        </a>
        {!!facts.length && (
          <div className="mt-3 grid grid-cols-4 divide-x divide-[var(--line)] border-y border-[var(--line)] py-2.5">
            {facts.map(({ label, value, Icon }) => (
              <span key={label} className="flex min-w-0 flex-col items-center gap-1 px-1 text-center text-[var(--ink)]" title={label}>
                <Icon size={17} className="text-[var(--gold-deep)]" aria-hidden />
                <span className="text-xs font-bold leading-none">{value}</span>
                <span className="max-w-full truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">{label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

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
