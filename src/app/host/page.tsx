import Link from "next/link";
import { CrmHeading, Empty, Pill, Stat } from "@/components/crm-ui";
import { hostContext } from "@/lib/host-context";
import { hostDashboardData } from "@/lib/host-data";

export default async function HostDashboard() {
  const { organizationId } = await hostContext();
  const data = await hostDashboardData(organizationId!);
  const pending = data.bookings.filter((booking) => booking.status === "pending");
  return (
    <>
      <CrmHeading eyebrow="Operations" title="Overview" copy="Today’s hospitality activity across your organization." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Properties" value={data.hotels.length} detail={`${data.hotels.filter((hotel) => hotel.status === "published").length} live`} />
        <Stat label="Pending requests" value={pending.length} detail="Awaiting action" />
        <Stat label="Upcoming arrivals" value={data.bookings.filter((booking) => booking.status === "confirmed" && booking.checkIn >= new Date().toISOString().slice(0, 10)).length} detail="Confirmed stays" />
        <Stat label="Unit inventory" value={data.units.reduce((total, unit) => total + Number(unit.quantity || 0), 0)} detail="Across all unit types" />
      </div>
      <section className="surface-3d mt-7 overflow-hidden">
        <div className="flex items-center justify-between border-b p-5"><h2 className="font-serif text-2xl text-[var(--ink)]">Recent requests</h2><Link href="/host/reservations" className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)]">View all</Link></div>
        {data.bookings.length ? <div className="divide-y">{data.bookings.slice(0, 6).map((booking) => <div key={booking.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-[var(--parchment)]"><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{booking.guest?.name || booking.guestName}</strong><span className="text-xs text-[var(--muted)]">{booking.reference} · {booking.checkIn} to {booking.checkOut}</span></div><Pill value={booking.status} /></div>)}</div> : <Empty title="No booking requests yet" copy="New guest requests will appear here." />}
      </section>
    </>
  );
}
