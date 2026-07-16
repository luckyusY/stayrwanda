import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const token = (await context.params).token;
  const hash = createHash("sha256").update(token).digest("hex");
  const db = await getDb();
  const booking = await db.collection("bookings").findOne({ publicAccessTokenHash: hash });
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ booking: {
    reference: booking.reference, status: booking.status, checkIn: booking.checkIn, checkOut: booking.checkOut,
    nights: booking.nights, guests: booking.guests, hotelId: booking.hotelId,
    pricing: booking.pricingSnapshot, updatedAt: booking.updatedAt,
  } });
}
