import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Hotel, Organization, UnitType } from "@/lib/platform-types";
import { getPublicCatalogue } from "@/lib/public-catalogue";

function clean<T>(row: Record<string, unknown>): T {
  const { _id, ...rest } = row;
  return { ...rest, id: String(_id) } as T;
}

export async function listPublishedHotels(category?: Hotel["category"]): Promise<Hotel[]> {
  const { hotels } = await getPublicCatalogue();
  return category ? hotels.filter((hotel) => hotel.category === category) : hotels;
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
