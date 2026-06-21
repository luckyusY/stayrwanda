import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { updateBookingStatus, type BookingStatus } from "@/lib/data";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

export async function PATCH(request: Request, ctx: RouteContext<"/api/bookings/[id]">) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await ctx.params;
  let status: string;
  try {
    status = String((await request.json()).status ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!STATUSES.includes(status as BookingStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const ok = await updateBookingStatus(id, status as BookingStatus);
  if (!ok) return NextResponse.json({ error: "Not found or database unavailable." }, { status: 404 });
  return NextResponse.json({ ok: true, status });
}
