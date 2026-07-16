import { NextResponse } from "next/server";
import { currentIdentity, requireIdentity } from "@/lib/auth";
import { createInventoryBackedBooking } from "@/lib/booking-service";
import { getDb } from "@/lib/mongodb";

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
    const code = error instanceof Error ? error.message : "UNKNOWN";
    const status = code === "SOLD_OUT" ? 409 : code === "NOT_FOUND" ? 404 : 400;
    return NextResponse.json({ error: code === "SOLD_OUT" ? "Those dates are no longer available." : "Unable to create booking request.", code }, { status });
  }
}
