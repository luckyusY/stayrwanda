import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export default async function BookingsPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");
  const db = await getDb();
  const bookings = await db.collection("bookings").find({ userId: identity.userId }).sort({ createdAt: -1 }).toArray();

  return (
    <AccountShell title="Bookings and requests">
      {bookings.length ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={String(booking._id)} className="surface-3d surface-3d-lift p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <span className="text-xs text-[#667085]">{booking.reference}</span>
                  <h2 className="mt-1 text-lg font-bold">{booking.checkIn} → {booking.checkOut}</h2>
                  <p className="mt-1 text-sm text-[#595959]">{booking.nights} nights · {booking.guests} guests</p>
                </div>
                <span className="h-fit rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold capitalize text-[#064f9d]">{booking.status}</span>
              </div>
              <Link href={`/bookings/${booking.reference}`} className="mt-4 inline-block text-sm font-bold text-[#006ce4]">View details</Link>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState icon={CalendarCheck} title="No booking requests yet" copy="When you request a property, its confirmation status appears here." action="Find a stay" href="/stays" />
      )}
    </AccountShell>
  );
}
