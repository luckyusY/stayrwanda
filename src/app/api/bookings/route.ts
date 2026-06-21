import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createBooking, listBookings } from "@/lib/data";

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const bookings = await listBookings();
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const guestName = String(body.guestName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const checkIn = String(body.checkIn ?? "").trim();
  const checkOut = String(body.checkOut ?? "").trim();
  const propertySlug = String(body.propertySlug ?? "").trim();

  if (!guestName || !email || !checkIn || !checkOut || !propertySlug) {
    return NextResponse.json(
      { error: "Name, email, dates and property are required." },
      { status: 400 },
    );
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
  }

  try {
    const booking = await createBooking({
      propertySlug,
      propertyTitle: String(body.propertyTitle ?? propertySlug),
      guestName,
      email,
      phone: String(body.phone ?? ""),
      checkIn,
      checkOut,
      guests: Number(body.guests) || 1,
      message: String(body.message ?? ""),
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to submit booking request." }, { status: 500 });
  }
}
