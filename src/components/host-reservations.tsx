/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pill } from "@/components/crm-ui";

export function HostReservations({ bookings }: { bookings: Array<Record<string, any>> }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState("");
  const rows = useMemo(() => bookings.filter((booking) => (status === "all" || booking.status === status) && `${booking.reference} ${booking.guest?.name || booking.guestName} ${booking.guest?.email || booking.email}`.toLowerCase().includes(query.toLowerCase())), [bookings, query, status]);
  async function transition(id: string, next: string) {
    setBusy(id);
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: next }) });
    router.refresh();
    setBusy("");
  }
  return (
    <>
      <div className="surface-3d mb-4 flex flex-wrap gap-3 p-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guest, email or reference" className="field-3d min-h-11 min-w-[260px] flex-1 px-3" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="field-3d px-3"><option value="all">All statuses</option><option>pending</option><option>confirmed</option><option>completed</option><option>cancelled</option><option>rejected</option></select>
      </div>
      <div className="surface-3d overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-[#f1efe9] text-xs uppercase tracking-wider"><tr><th className="p-4">Guest</th><th>Stay</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody className="divide-y">
            {rows.map((booking) => (
              <tr key={booking.id} className={busy === booking.id ? "opacity-50" : ""}>
                <td className="p-4"><strong>{booking.guest?.name || booking.guestName}</strong><small className="block text-[var(--muted)]">{booking.guest?.email || booking.email}<br />{booking.reference}</small></td>
                <td>{booking.nights} nights · {booking.guests} guests</td><td>{booking.checkIn} → {booking.checkOut}</td><td><Pill value={booking.status} /></td>
                <td><div className="flex flex-wrap gap-2">{booking.status === "pending" && <><button onClick={() => transition(booking.id, "confirmed")} className="interactive-3d border-green-700 px-3 py-1.5 text-xs text-green-700">Confirm</button><button onClick={() => transition(booking.id, "rejected")} className="interactive-3d border-red-700 px-3 py-1.5 text-xs text-red-700">Reject</button></>}{booking.status === "confirmed" && <><button onClick={() => transition(booking.id, "completed")} className="interactive-3d px-3 py-1.5 text-xs">Complete</button><button onClick={() => transition(booking.id, "cancelled")} className="interactive-3d border-red-700 px-3 py-1.5 text-xs text-red-700">Cancel</button></>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
