"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { StatusBadge } from "@/components/admin-ui";
import type { Booking } from "@/lib/data";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
] as const;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function AdminBookings({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: bookings.length };
    for (const booking of bookings) map[booking.status] = (map[booking.status] || 0) + 1;
    return map;
  }, [bookings]);

  const rows = bookings.filter((booking) => {
    if (tab !== "all" && booking.status !== tab) return false;
    if (!query.trim()) return true;
    const haystack = `${booking.guestName} ${booking.email} ${booking.propertyTitle} ${booking.reference}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  async function setStatus(id: string, status: string) {
    setBusy(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setBusy(null);
  }

  return (
    <div>
      <div className="surface-3d mb-4 flex items-center gap-2 px-3">
        <Search size={18} className="text-[#667085]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by guest, email, reference or property"
          className="min-h-11 w-full text-sm outline-none"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-[#e4e7ec]">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold ${
              tab === key
                ? "border-[#006ce4] text-[#006ce4]"
                : "border-transparent text-[#667085] hover:text-[#1a1a1a]"
            }`}
          >
            {label}
            <span className="ml-1.5 rounded-full bg-[#f2f4f7] px-1.5 py-0.5 text-xs text-[#475467]">
              {counts[key] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="surface-3d overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-[#667085]">
            No reservations in this view yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-[#667085]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Guest</th>
                  <th className="px-3 py-3 font-semibold">Property</th>
                  <th className="px-3 py-3 font-semibold">Dates</th>
                  <th className="px-3 py-3 font-semibold">Guests</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef1f5]">
                {rows.map((booking) => (
                  <tr key={booking.id} className={busy === booking.id ? "opacity-50" : "hover:bg-[#f9fafb]"}>
                    <td className="px-5 py-3">
                      <p className="font-semibold">{booking.guestName}</p>
                      <p className="text-xs text-[#667085]">{booking.email}</p>
                      <p className="text-xs text-[#98a2b3]">{booking.reference}</p>
                    </td>
                    <td className="px-3 py-3 text-[#475467]">{booking.propertyTitle}</td>
                    <td className="px-3 py-3 text-[#475467]">
                      <p>
                        {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                      </p>
                      <p className="text-xs text-[#98a2b3]">
                        {booking.nights} night{booking.nights === 1 ? "" : "s"}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-[#475467]">{booking.guests}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {(booking.status === "pending" || booking.status === "cancelled") && (
                          <button
                            onClick={() => setStatus(booking.id, "confirmed")}
                            className="interactive-3d flex h-8 items-center gap-1 !border-[#bfe3c9] px-2.5 text-xs font-bold text-[#008234] hover:bg-[#e7f5ea]"
                          >
                            <Check size={14} /> Confirm
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => setStatus(booking.id, "completed")}
                            className="interactive-3d flex h-8 items-center gap-1 !border-[#d0d5dd] px-2.5 text-xs font-bold text-[#475467] hover:bg-[#f2f4f7]"
                          >
                            Mark complete
                          </button>
                        )}
                        {booking.status !== "cancelled" && booking.status !== "completed" && (
                          <button
                            onClick={() => setStatus(booking.id, "cancelled")}
                            className="interactive-3d flex h-8 items-center gap-1 !border-[#f2c1c1] px-2.5 text-xs font-bold text-[#c00] hover:bg-[#fdeced]"
                          >
                            <X size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
