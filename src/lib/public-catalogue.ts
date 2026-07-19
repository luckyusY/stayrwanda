import { revalidateTag, unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { featuredProperties, type Property } from "@/lib/properties";
import type { Hotel, UnitSummary } from "@/lib/platform-types";
import { seededNightlyRateRwf } from "@/lib/pricing";

export const PUBLIC_CATALOGUE_TAGS = ["public-catalogue", "hotels", "properties", "units", "galleries", "prices"] as const;

type Catalogue = { hotels: Hotel[]; properties: Property[] };

const DEFAULT_UNIT: UnitSummary = { maxGuests: 4, bedrooms: 2, beds: 2, baths: 2 };

function seedCatalogue(): Catalogue {
  const hotels = featuredProperties.map((property, index): Hotel => ({
    id: `seed-${index}`,
    organizationId: "seed",
    slug: property.slug,
    legacySlug: property.slug,
    name: property.title,
    category: "residence",
    status: "published",
    template: index % 3 === 0 ? "editorial" : index % 3 === 1 ? "classic" : "modern",
    location: { address: property.neighborhood, neighborhood: property.neighborhood, city: "Kigali", country: "Rwanda" },
    heroImage: property.image,
    gallery: property.images,
    amenities: property.amenities,
    description: property.description,
    startingPriceRwf: property.price || seededNightlyRateRwf(property.slug),
    unitSummary: {
      maxGuests: property.guests || DEFAULT_UNIT.maxGuests,
      bedrooms: property.bedrooms || DEFAULT_UNIT.bedrooms,
      beds: property.beds || DEFAULT_UNIT.beds,
      baths: property.baths || DEFAULT_UNIT.baths,
    },
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  }));
  return { hotels, properties: featuredProperties };
}

function asDateString(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date(0).toISOString();
}

async function loadCatalogueFromMongo(): Promise<Catalogue> {
  const db = await getDb();
  const [hotelRows, unitRows] = await Promise.all([
    db.collection("hotels").find({ status: "published" }).sort({ publishedAt: -1, name: 1 }).toArray(),
    db.collection("unitTypes").find({ status: "published" }).sort({ basePriceRwf: 1 }).toArray(),
  ]);
  if (!hotelRows.length) return seedCatalogue();

  const unitsByHotel = new Map<string, typeof unitRows>();
  for (const unit of unitRows) {
    const hotelId = String(unit.hotelId || "");
    const current = unitsByHotel.get(hotelId) || [];
    current.push(unit);
    unitsByHotel.set(hotelId, current);
  }

  const seeds = new Map(featuredProperties.map((property) => [property.slug, property]));
  const hotels = hotelRows.map((row): Hotel => {
    const id = String(row._id);
    const units = unitsByHotel.get(id) || [];
    const unit = units.find((candidate) => Number(candidate.basePriceRwf) > 0) || units[0];
    const seed = seeds.get(String(row.slug));
    return {
      id,
      organizationId: String(row.organizationId || ""),
      slug: String(row.slug),
      legacySlug: typeof row.legacySlug === "string" ? row.legacySlug : undefined,
      name: String(row.name),
      category: row.category === "hotel" || row.category === "guesthouse" ? row.category : "residence",
      status: "published",
      template: row.template === "classic" || row.template === "modern" ? row.template : "editorial",
      location: {
        address: String(row.location?.address || row.location?.neighborhood || "Kigali"),
        neighborhood: String(row.location?.neighborhood || "Kigali"),
        city: String(row.location?.city || "Kigali"),
        country: String(row.location?.country || "Rwanda"),
        ...(Number.isFinite(row.location?.lat) ? { lat: Number(row.location.lat) } : {}),
        ...(Number.isFinite(row.location?.lng) ? { lng: Number(row.location.lng) } : {}),
      },
      heroImage: String(row.heroImage || seed?.image || ""),
      gallery: Array.isArray(row.gallery) && row.gallery.length ? row.gallery.map(String) : seed?.images || [],
      amenities: Array.isArray(row.amenities) ? row.amenities.map(String) : seed?.amenities || [],
      description: String(row.description || seed?.description || ""),
      startingPriceRwf: Number(unit?.basePriceRwf || seededNightlyRateRwf(String(row.slug)) || seed?.price || 0) || undefined,
      unitSummary: unit ? {
        maxGuests: Number(unit.maxGuests || DEFAULT_UNIT.maxGuests),
        bedrooms: Number(unit.bedrooms || DEFAULT_UNIT.bedrooms),
        beds: Number(unit.beds || DEFAULT_UNIT.beds),
        baths: Number(unit.baths || DEFAULT_UNIT.baths),
      } : seed ? {
        maxGuests: seed.guests || DEFAULT_UNIT.maxGuests,
        bedrooms: seed.bedrooms || DEFAULT_UNIT.bedrooms,
        beds: seed.beds || DEFAULT_UNIT.beds,
        baths: seed.baths || DEFAULT_UNIT.baths,
      } : undefined,
      publishedVersionId: typeof row.publishedVersionId === "string" ? row.publishedVersionId : undefined,
      draftVersionId: typeof row.draftVersionId === "string" ? row.draftVersionId : undefined,
      createdAt: asDateString(row.createdAt),
      updatedAt: asDateString(row.updatedAt),
    };
  });

  const properties = hotels.map((hotel): Property => ({
    slug: hotel.slug,
    title: hotel.name,
    location: `${hotel.location.city}, ${hotel.location.country}`,
    neighborhood: hotel.location.neighborhood,
    type: hotel.category === "hotel" ? "Hotel room" : hotel.category === "guesthouse" ? "Guesthouse room" : "Furnished residence",
    price: hotel.startingPriceRwf,
    guests: hotel.unitSummary?.maxGuests,
    bedrooms: hotel.unitSummary?.bedrooms,
    beds: hotel.unitSummary?.beds,
    baths: hotel.unitSummary?.baths,
    image: hotel.heroImage || "",
    images: hotel.gallery,
    badge: seeds.get(hotel.slug)?.badge,
    amenities: hotel.amenities,
    description: hotel.description,
    host: "StayRwanda Hospitality Partner",
    sourceUrl: seeds.get(hotel.slug)?.sourceUrl || "",
    photoCount: hotel.gallery.length,
  }));
  return { hotels, properties };
}

async function loadPublicCatalogue(): Promise<Catalogue> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      loadCatalogueFromMongo(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Public catalogue timed out")), 5_000);
      }),
    ]);
  } catch (error) {
    console.error("Public catalogue fallback activated", error instanceof Error ? error.message : "Unknown error");
    return seedCatalogue();
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

const cachedCatalogue = unstable_cache(loadPublicCatalogue, ["public-catalogue-v2"], {
  revalidate: 300,
  tags: [...PUBLIC_CATALOGUE_TAGS],
});

export async function getPublicCatalogue() {
  return cachedCatalogue();
}

export function invalidatePublicCatalogue() {
  for (const tag of PUBLIC_CATALOGUE_TAGS) revalidateTag(tag, "max");
}
