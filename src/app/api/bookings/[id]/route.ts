import { NextResponse } from "next/server";
import { currentIdentity, requireMembership } from "@/lib/auth";
import { transitionBooking } from "@/lib/booking-service";
import { bookingStatusSchema } from "@/lib/schemas";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const input = bookingStatusSchema.parse(await request.json());
    const db = await getDb();
    const booking = ObjectId.isValid(id) ? await db.collection("bookings").findOne({ _id: new ObjectId(id) }) : null;
    if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const identity = await currentIdentity();
    if (!identity) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (!identity.platformAdmin) await requireMembership(booking.organizationId, ["organization_owner", "organization_manager", "reservations_agent"]);
    await transitionBooking(id, input.status, identity, input.note);
    return NextResponse.json({ ok: true, status: input.status });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: "Unable to update booking.", code }, { status: code === "FORBIDDEN" ? 403 : 400 });
  }
}
