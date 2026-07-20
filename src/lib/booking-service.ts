import { createHash, randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { bookingRequestSchema } from "@/lib/schemas";
import { recordAudit } from "@/lib/audit";
import type { AppIdentity } from "@/lib/auth";

const DAY = 86_400_000;
export const ACTIVE_BOOKING_STATUSES = ["pending", "confirmed"] as const;

export function stayDates(checkIn: string, checkOut: string) {
  const start = Date.parse(`${checkIn}T00:00:00.000Z`);
  const end = Date.parse(`${checkOut}T00:00:00.000Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error("INVALID_DATES");
  const nights = Math.round((end - start) / DAY);
  if (nights > 180) throw new Error("STAY_TOO_LONG");
  return Array.from({ length: nights }, (_, index) => new Date(start + index * DAY).toISOString().slice(0, 10));
}

export async function createInventoryBackedBooking(raw: unknown, idempotencyKey: string, actor?: AppIdentity | null) {
  const input = bookingRequestSchema.parse(raw);
  if (!idempotencyKey || idempotencyKey.length < 8 || idempotencyKey.length > 200) throw new Error("INVALID_IDEMPOTENCY_KEY");
  const dates = stayDates(input.checkIn, input.checkOut);

  const isSeed = input.hotelId.startsWith("seed-") || !ObjectId.isValid(input.hotelId) || !ObjectId.isValid(input.unitTypeId);
  const publicToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(publicToken).digest("hex");

  if (isSeed) {
    const db = await getDb();
    const now = new Date();
    const reference = `SR-${now.getTime().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
    let finalNightly = 85000;

    const { featuredProperties } = await import("@/lib/properties");
    const seedHotel = featuredProperties.find(p => p.slug === input.hotelId || `seed-${featuredProperties.indexOf(p)}` === input.hotelId);
    if (seedHotel && seedHotel.price) {
      finalNightly = seedHotel.price;
    }

    const record = {
      organizationId: "seed-org",
      hotelId: input.hotelId,
      unitTypeId: input.unitTypeId,
      userId: actor?.userId,
      reference,
      guest: { name: input.guestName, email: input.email.toLowerCase(), phone: input.phone },
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      nights: dates.length,
      guests: input.guests,
      quantity: input.quantity,
      message: input.message,
      status: "pending",
      allocationState: "held",
      allocatedDates: dates,
      pricingSnapshot: { nightlyRwf: finalNightly, subtotalRwf: finalNightly * dates.length * input.quantity, currency: input.currency },
      policySnapshot: { holdHours: 24, minStay: 1 },
      idempotencyKey,
      publicAccessTokenHash: tokenHash,
      holdExpiresAt: new Date(now.getTime() + 24 * 3_600_000),
      history: [{ status: "pending", at: now, actorUserId: actor?.userId || "guest" }],
      createdAt: now,
      updatedAt: now,
    };

    try {
      const result = await db.collection("bookings").insertOne(record);
      return { ...record, _id: String(result.insertedId), publicToken };
    } catch (error) {
      console.error("Seed booking persistence failed", error instanceof Error ? error.name : "Unknown error");
      throw new Error("BOOKING_PERSISTENCE_FAILED");
    }
  }

  const db = await getDb();
  // Db does not expose its client publicly; use the cached MongoClient connection.
  const { getMongoClient } = await import("@/lib/mongodb");
  const mongo = await getMongoClient();
  const session = mongo.startSession();
  try {
    let response: Record<string, unknown> | null = null;
    await session.withTransaction(async () => {
      if (!ObjectId.isValid(input.hotelId) || !ObjectId.isValid(input.unitTypeId)) throw new Error("NOT_FOUND");
      const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(input.hotelId), status: "published" }, { session });
      if (!hotel) throw new Error("NOT_FOUND");
      const existing = await db.collection("bookings").findOne(
        { organizationId: hotel.organizationId, idempotencyKey },
        { session },
      );
      if (existing) {
        response = { ...existing, _id: String(existing._id), replayed: true };
        return;
      }
      const unit = await db.collection("unitTypes").findOne({
        _id: new ObjectId(input.unitTypeId), hotelId: input.hotelId, status: "published",
      }, { session });
      if (!unit) throw new Error("NOT_FOUND");
      if (input.guests > Number(unit.maxGuests || 1) * input.quantity) throw new Error("CAPACITY_EXCEEDED");
      if (dates.length < Number(unit.minStay || 1)) throw new Error("MIN_STAY");

      for (const date of dates) {
        await db.collection("availabilityNights").updateOne(
          { organizationId: hotel.organizationId, unitTypeId: input.unitTypeId, date },
          { $setOnInsert: { hotelId: input.hotelId, total: unit.quantity, blocked: 0, held: 0, confirmed: 0 } },
          { upsert: true, session },
        );
        const allocation = await db.collection("availabilityNights").updateOne(
          {
            organizationId: hotel.organizationId,
            unitTypeId: input.unitTypeId,
            date,
            $expr: { $gte: [{ $subtract: ["$total", { $add: ["$blocked", "$held", "$confirmed"] }] }, input.quantity] },
          },
          { $inc: { held: input.quantity }, $set: { updatedAt: new Date() } },
          { session },
        );
        if (!allocation.modifiedCount) throw new Error("SOLD_OUT");
      }

      const now = new Date();
      const reference = `SR-${now.getTime().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
      const nightly = Number(unit.basePriceRwf || 0);
      const record = {
        organizationId: hotel.organizationId,
        hotelId: input.hotelId,
        unitTypeId: input.unitTypeId,
        userId: actor?.userId,
        reference,
        guest: { name: input.guestName, email: input.email.toLowerCase(), phone: input.phone },
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        nights: dates.length,
        guests: input.guests,
        quantity: input.quantity,
        message: input.message,
        status: "pending",
        allocationState: "held",
        allocatedDates: dates,
        pricingSnapshot: { nightlyRwf: nightly, subtotalRwf: nightly * dates.length * input.quantity, currency: input.currency },
        policySnapshot: { holdHours: Number(hotel.holdHours || 24), minStay: Number(unit.minStay || 1) },
        idempotencyKey,
        publicAccessTokenHash: tokenHash,
        holdExpiresAt: new Date(now.getTime() + Number(hotel.holdHours || 24) * 3_600_000),
        history: [{ status: "pending", at: now, actorUserId: actor?.userId || "guest" }],
        createdAt: now,
        updatedAt: now,
      };
      const result = await db.collection("bookings").insertOne(record, { session });
      await recordAudit({
        actor: actor || { userId: "anonymous-guest", email: input.email, platformAdmin: false },
        organizationId: hotel.organizationId,
        action: "booking.create",
        recordType: "booking",
        recordId: String(result.insertedId),
        after: { reference, dates, unitTypeId: input.unitTypeId },
        session,
      });
      response = { ...record, _id: String(result.insertedId), publicToken };
    });
    return response;
  } finally {
    await session.endSession();
  }
}

export async function releaseExpiredHolds() {
  const db = await getDb();
  const { getMongoClient } = await import("@/lib/mongodb");
  const mongo = await getMongoClient();
  const expired = await db.collection("bookings").find({ status: "pending", holdExpiresAt: { $lte: new Date() } }).limit(200).toArray();
  let count = 0;
  for (const booking of expired) {
    const session = mongo.startSession();
    try {
      await session.withTransaction(async () => {
        const claimed = await db.collection("bookings").updateOne(
          { _id: booking._id, status: "pending", allocationState: "held" },
          { $set: { status: "expired", allocationState: "released", updatedAt: new Date() }, $push: { history: { status: "expired", at: new Date(), actorUserId: "system" } } as never },
          { session },
        );
        if (!claimed.modifiedCount) return;
        for (const date of booking.allocatedDates || []) {
          await db.collection("availabilityNights").updateOne(
            { organizationId: booking.organizationId, unitTypeId: booking.unitTypeId, date, held: { $gte: booking.quantity } },
            { $inc: { held: -booking.quantity }, $set: { updatedAt: new Date() } },
            { session },
          );
        }
        count += 1;
      });
    } finally { await session.endSession(); }
  }
  return count;
}

export async function transitionBooking(bookingId: string, next: "confirmed" | "rejected" | "cancelled" | "completed", actor: AppIdentity, note = "") {
  if (!ObjectId.isValid(bookingId)) throw new Error("NOT_FOUND");
  const db = await getDb();
  const { getMongoClient } = await import("@/lib/mongodb");
  const mongo = await getMongoClient();
  const session = mongo.startSession();
  try {
    await session.withTransaction(async () => {
      const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) }, { session });
      if (!booking) throw new Error("NOT_FOUND");
      const allowed: Record<string, string[]> = { pending: ["confirmed", "rejected", "cancelled"], confirmed: ["cancelled", "completed"] };
      if (!allowed[booking.status]?.includes(next)) throw new Error("INVALID_TRANSITION");
      if (booking.allocationState === "held" && next === "confirmed") {
        for (const date of booking.allocatedDates || []) {
          const result = await db.collection("availabilityNights").updateOne(
            { organizationId: booking.organizationId, unitTypeId: booking.unitTypeId, date, held: { $gte: booking.quantity } },
            { $inc: { held: -booking.quantity, confirmed: booking.quantity }, $set: { updatedAt: new Date() } }, { session },
          );
          if (!result.modifiedCount) throw new Error("INVENTORY_MISMATCH");
        }
      }
      if (["rejected", "cancelled"].includes(next) && ["held", "confirmed"].includes(booking.allocationState)) {
        const field = booking.allocationState === "held" ? "held" : "confirmed";
        for (const date of booking.allocatedDates || []) {
          await db.collection("availabilityNights").updateOne(
            { organizationId: booking.organizationId, unitTypeId: booking.unitTypeId, date, [field]: { $gte: booking.quantity } },
            { $inc: { [field]: -booking.quantity }, $set: { updatedAt: new Date() } }, { session },
          );
        }
      }
      const allocationState = next === "confirmed" ? "confirmed" : ["rejected", "cancelled"].includes(next) ? "released" : booking.allocationState;
      await db.collection("bookings").updateOne({ _id: booking._id, status: booking.status }, {
        $set: { status: next, allocationState, updatedAt: new Date() },
        $push: { history: { status: next, at: new Date(), actorUserId: actor.userId, note } } as never,
      }, { session });
      const auditActions = {
        confirmed: "booking.confirm",
        rejected: "booking.reject",
        cancelled: "booking.cancel",
        completed: "booking.complete",
      } as const;
      await recordAudit({ actor, organizationId: booking.organizationId, action: auditActions[next], recordType: "booking", recordId: bookingId, before: { status: booking.status }, after: { status: next }, reason: note, session });
    });
  } finally { await session.endSession(); }
}
