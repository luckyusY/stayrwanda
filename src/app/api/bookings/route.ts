import { NextResponse } from "next/server";
import { currentIdentity, requireIdentity } from "@/lib/auth";
import { createInventoryBackedBooking } from "@/lib/booking-service";
import { getDb } from "@/lib/mongodb";
import { ZodError } from "zod";

export async function GET() {
  const identity = await requireIdentity();
  const db = await getDb();
  const bookings = identity.platformAdmin
    ? await db.collection("bookings").find({}).sort({ createdAt: -1 }).limit(100).toArray()
    : await db.collection("bookings").find({ userId: identity.userId }).sort({ createdAt: -1 }).limit(100).toArray();
  return NextResponse.json({ bookings: bookings.map((booking) => { const safe = { ...booking }; delete safe.publicAccessTokenHash; return { ...safe, _id: String(booking._id) }; }) });
}

export async function POST(request: Request) {
  try {
    const key = request.headers.get("idempotency-key") || "";
    const booking = await createInventoryBackedBooking(await request.json(), key, await currentIdentity());
    return NextResponse.json({ booking }, { status: booking && "replayed" in booking ? 200 : 201 });
  } catch (error) {
    const rawCode = error instanceof Error ? error.message : "UNKNOWN";
    const databaseUnavailable = rawCode.includes("MONGODB_URI") || rawCode === "BOOKING_PERSISTENCE_FAILED" || (error instanceof Error && error.name.startsWith("Mongo"));
    const code = error instanceof ZodError ? "INVALID_BOOKING_DETAILS" : databaseUnavailable ? "BOOKING_SERVICE_UNAVAILABLE" : rawCode;
    const status = code === "SOLD_OUT" ? 409 : code === "NOT_FOUND" ? 404 : code === "BOOKING_SERVICE_UNAVAILABLE" ? 503 : 400;
    const message = code === "SOLD_OUT"
      ? "Those dates are no longer available."
      : code === "BOOKING_SERVICE_UNAVAILABLE"
        ? "Booking requests are temporarily unavailable. Please try again shortly."
        : code === "INVALID_BOOKING_DETAILS"
          ? "Please review your booking details and try again."
          : "Unable to create booking request.";
    console.error("Booking request rejected", { code, status });
    return NextResponse.json({ error: message, code }, { status });
  }
}
