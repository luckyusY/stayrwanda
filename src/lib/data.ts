import type { Db } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { featuredProperties, type Property } from "@/lib/properties";

export type PropertyStatus = "active" | "pending" | "inactive" | "rejected";

export type StoredProperty = Property & {
  status: PropertyStatus;
  featured?: boolean;
  createdAt?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Booking = {
  id: string;
  reference: string;
  propertySlug: string;
  propertyTitle: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  message?: string;
  status: BookingStatus;
  createdAt: string;
};

const PROPERTIES = "properties";
const BOOKINGS = "bookings";

/** Returns a connected Db, or null if Mongo is not configured/reachable. */
async function tryDb(): Promise<Db | null> {
  try {
    return await getDb();
  } catch {
    return null;
  }
}

function seedProperties(): StoredProperty[] {
  return featuredProperties.map((property) => ({
    ...property,
    status: "active" as const,
    featured: true,
  }));
}

/** Seeds the catalogue from the bundled galleries the first time the DB is empty. */
async function ensureSeeded(db: Db) {
  const count = await db.collection(PROPERTIES).countDocuments();
  if (count > 0) return;
  await db.collection(PROPERTIES).insertMany(
    seedProperties().map((property) => ({ ...property, createdAt: new Date().toISOString() })),
  );
}

function normalizeProperty(doc: Record<string, unknown>): StoredProperty {
  const rest = { ...doc };
  delete rest._id;
  return {
    ...(rest as unknown as StoredProperty),
    status: (rest.status as PropertyStatus) || "active",
  };
}

/** Admin view: every listing regardless of status, seed fallback when offline. */
export async function listProperties(): Promise<StoredProperty[]> {
  const db = await tryDb();
  if (!db) return seedProperties();
  await ensureSeeded(db);
  const docs = await db.collection(PROPERTIES).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => normalizeProperty(doc as Record<string, unknown>));
}

/** Public view: only listings that are live. */
export async function listPublicProperties(): Promise<StoredProperty[]> {
  const all = await listProperties();
  const live = all.filter((property) => property.status === "active");
  return live.length ? live : seedProperties();
}

export async function getPropertyBySlug(slug: string): Promise<StoredProperty | null> {
  const db = await tryDb();
  if (!db) return seedProperties().find((property) => property.slug === slug) ?? null;
  await ensureSeeded(db);
  const doc = await db.collection(PROPERTIES).findOne({ slug });
  if (!doc) return null;
  return normalizeProperty(doc as Record<string, unknown>);
}

export async function updatePropertyStatus(slug: string, status: PropertyStatus) {
  const db = await tryDb();
  if (!db) return false;
  const result = await db.collection(PROPERTIES).updateOne({ slug }, { $set: { status } });
  return result.matchedCount > 0;
}

export async function deletePropertyBySlug(slug: string) {
  const db = await tryDb();
  if (!db) return false;
  const result = await db.collection(PROPERTIES).deleteOne({ slug });
  return result.deletedCount > 0;
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.round((end - start) / 86_400_000);
}

function bookingReference() {
  return `SR-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(Math.random() * 900 + 100)}`;
}

function normalizeBooking(doc: Record<string, unknown>): Booking {
  const { _id, ...rest } = doc;
  return { ...(rest as Omit<Booking, "id">), id: String(_id) };
}

export type NewBooking = {
  propertySlug: string;
  propertyTitle: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
};

export async function createBooking(input: NewBooking): Promise<Booking> {
  const record = {
    reference: bookingReference(),
    propertySlug: input.propertySlug,
    propertyTitle: input.propertyTitle,
    guestName: input.guestName,
    email: input.email,
    phone: input.phone,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    nights: nightsBetween(input.checkIn, input.checkOut),
    message: input.message ?? "",
    status: "pending" as BookingStatus,
    createdAt: new Date().toISOString(),
  };
  const db = await tryDb();
  if (!db) return { ...record, id: record.reference };
  const result = await db.collection(BOOKINGS).insertOne(record);
  return { ...record, id: String(result.insertedId) };
}

export async function listBookings(): Promise<Booking[]> {
  const db = await tryDb();
  if (!db) return [];
  const docs = await db.collection(BOOKINGS).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => normalizeBooking(doc as Record<string, unknown>));
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const db = await tryDb();
  if (!db) return false;
  const { ObjectId } = await import("mongodb");
  let _id: unknown = id;
  try {
    _id = new ObjectId(id);
  } catch {
    return false;
  }
  const result = await db.collection(BOOKINGS).updateOne({ _id } as never, { $set: { status } });
  return result.matchedCount > 0;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export type DashboardStats = {
  totalProperties: number;
  activeProperties: number;
  pendingProperties: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalGuests: number;
  dbConnected: boolean;
};

export async function dashboardStats(): Promise<{
  stats: DashboardStats;
  properties: StoredProperty[];
  bookings: Booking[];
}> {
  const db = await tryDb();
  const properties = await listProperties();
  const bookings = await listBookings();
  return {
    properties,
    bookings,
    stats: {
      totalProperties: properties.length,
      activeProperties: properties.filter((p) => p.status === "active").length,
      pendingProperties: properties.filter((p) => p.status === "pending").length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
      totalGuests: bookings.reduce((sum, b) => sum + (b.guests || 0), 0),
      dbConnected: Boolean(db),
    },
  };
}
