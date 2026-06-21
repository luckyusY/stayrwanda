import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Database,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/admin-ui";
import { CountUp } from "@/components/count-up";
import { dashboardStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { stats, bookings, properties } = await dashboardStats();
  const recentBookings = bookings.slice(0, 6);
  const pendingProperties = properties.filter((p) => p.status === "pending").slice(0, 5);

  const cards = [
    { label: "Properties", value: stats.totalProperties, sub: `${stats.activeProperties} live`, icon: Building2, tint: "#006ce4" },
    { label: "Reservations", value: stats.totalBookings, sub: `${stats.confirmedBookings} confirmed`, icon: CalendarCheck, tint: "#008234" },
    { label: "Pending requests", value: stats.pendingBookings, sub: "Awaiting your action", icon: Clock, tint: "#b25e00" },
    { label: "Guests booked", value: stats.totalGuests, sub: "Across all stays", icon: Users, tint: "#6a37c9" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Your StayRwanda operations at a glance">
      {!stats.dbConnected && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#ffe1b8] bg-[#fff7ec] p-4 text-sm">
          <AlertTriangle className="mt-0.5 shrink-0 text-[#b25e00]" size={18} />
          <p>
            <strong>Demo mode:</strong> the database is not reachable, so listings fall back to the
            bundled catalogue and changes won&apos;t persist. Set <code>MONGODB_URI</code> to enable
            full management.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, sub, icon: Icon, tint }) => (
          <div key={label} className="rounded-2xl border border-[#e4e7ec] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#667085]">{label}</span>
              <span
                className="grid size-9 place-items-center rounded-lg"
                style={{ background: `${tint}1a`, color: tint }}
              >
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold">
              <CountUp value={value} />
            </p>
            <p className="mt-1 text-xs text-[#667085]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent reservations */}
        <section className="rounded-2xl border border-[#e4e7ec] bg-white">
          <div className="flex items-center justify-between border-b border-[#e4e7ec] px-5 py-4">
            <h2 className="font-bold">Recent reservations</h2>
            <Link href="/admin/bookings" className="text-sm font-bold text-[#006ce4] hover:underline">
              View all
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-[#667085]">
              <CalendarCheck className="mx-auto mb-3 text-[#cbd2dd]" size={32} />
              No reservations yet. Requests from guests will appear here.
            </div>
          ) : (
            <ul className="divide-y divide-[#eef1f5]">
              {recentBookings.map((booking) => (
                <li key={booking.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{booking.guestName}</p>
                    <p className="truncate text-xs text-[#667085]">
                      {booking.propertyTitle} · {booking.nights} night{booking.nights === 1 ? "" : "s"}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Listings needing review */}
        <section className="rounded-2xl border border-[#e4e7ec] bg-white">
          <div className="flex items-center justify-between border-b border-[#e4e7ec] px-5 py-4">
            <h2 className="font-bold">Listings to review</h2>
            <Link href="/admin/properties" className="text-sm font-bold text-[#006ce4] hover:underline">
              Manage
            </Link>
          </div>
          {pendingProperties.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-[#667085]">
              <CheckCircle2 className="mx-auto mb-3 text-[#cbd2dd]" size={32} />
              Nothing pending. All listings are reviewed.
            </div>
          ) : (
            <ul className="divide-y divide-[#eef1f5]">
              {pendingProperties.map((property) => (
                <li key={property.slug} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{property.title}</p>
                    <p className="truncate text-xs text-[#667085]">{property.neighborhood}</p>
                  </div>
                  <StatusBadge status="pending" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-[#667085]">
        <Database size={14} />
        {stats.dbConnected ? "Connected to MongoDB" : "Database offline — demo data"}
      </p>
    </AdminShell>
  );
}
