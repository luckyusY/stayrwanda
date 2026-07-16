import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Hotel, Organization, UnitType } from "@/lib/platform-types";
import { featuredProperties } from "@/lib/properties";

function clean<T>(row: Record<string, unknown>): T {
  const { _id, ...rest } = row;
  return { ...rest, id: String(_id) } as T;
}

export async function listPublishedHotels(category?: Hotel["category"]): Promise<Hotel[]> {
  try {
    const db = await getDb();
    const rows = await db.collection("hotels").find({
      status: "published",
      ...(category ? { category } : {}),
    }).sort({ publishedAt: -1, name: 1 }).toArray();
    if (rows.length) return rows.map((row) => clean<Hotel>(row));
  } catch (error) {
    const isConfigured = process.env.MONGODB_URI?.startsWith("mongodb://") || process.env.MONGODB_URI?.startsWith("mongodb+srv://");
    if (process.env.NODE_ENV === "production" && isConfigured) throw error;
  }
  return featuredProperties.map((property, index) => ({
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
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  }));
}

export async function getPublishedHotel(slug: string): Promise<Hotel | null> {
  const hotels = await listPublishedHotels();
  return hotels.find((hotel) => hotel.slug === slug || hotel.legacySlug === slug) ?? null;
}

export async function listOrganizations(): Promise<Organization[]> {
  const db = await getDb();
  return (await db.collection("organizations").find({}).sort({ name: 1 }).toArray())
    .map((row) => clean<Organization>(row));
}

export async function listHotelsForOrganization(organizationId: string): Promise<Hotel[]> {
  const db = await getDb();
  return (await db.collection("hotels").find({ organizationId }).sort({ updatedAt: -1 }).toArray())
    .map((row) => clean<Hotel>(row));
}

export async function listUnitsForOrganization(organizationId: string): Promise<UnitType[]> {
  const db = await getDb();
  return (await db.collection("unitTypes").find({ organizationId }).sort({ name: 1 }).toArray())
    .map((row) => clean<UnitType>(row));
}

export async function getUnitForHotel(hotelId: string) {
  const db = await getDb();
  const query = ObjectId.isValid(hotelId) ? { hotelId: { $in: [hotelId, new ObjectId(hotelId)] } } : { hotelId };
  const row = await db.collection("unitTypes").findOne({ ...query, status: "published" });
  return row ? clean<UnitType>(row) : null;
}
