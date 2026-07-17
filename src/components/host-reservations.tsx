/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pill } from "@/components/crm-ui";
import { Search } from "lucide-react";

export function HostReservations({ bookings }: { bookings: Array<Record<string, any>> }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [busy, setBusy] = useState("");

  const rows = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          (status === "all" || booking.status === status) &&
          `${booking.reference} ${booking.guest?.name || booking.guestName} ${
            booking.guest?.email || booking.email
          }`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [bookings, query, status]
  );

  async function transition(id: string, next: string) {
    setBusy(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
    setBusy("");
  }

  return (
    <>
      <div className="surface-3d mb-5 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white shadow-sm border border-[var(--line)]">
        <div className="flex flex-wrap flex-1 gap-3 items-center">
          <div className="min-w-[260px] flex-1 max-w-sm flex items-center gap-2 border border-[var(--line)] rounded-lg px-3 bg-[#faf9f6]">
            <Search size={16} className="text-[var(--muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search guest, email or reference"
              className="min-h-11 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          {viewMode === "table" && (
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="field-3d px-3 bg-white border border-[var(--line)] rounded-lg text-sm min-h-11"
            >
              <option value="all">All statuses</option>
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
              <option value="rejected">rejected</option>
            </select>
          )}
        </div>

        <div className="flex border border-[var(--line)] rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              viewMode === "table" ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)] hover:bg-[var(--cream)]"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              viewMode === "kanban" ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink)] hover:bg-[var(--cream)]"
            }`}
          >
            Board
          </button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
          {["pending", "confirmed", "completed", "cancelled"].map((colStatus) => {
            const colRows = rows.filter((r) => 
              colStatus === "cancelled" ? r.status === "cancelled" || r.status === "rejected" : r.status === colStatus
            );

            return (
              <div key={colStatus} className="kanban-col shrink-0 w-[270px]">
                <div className="kanban-col-header text-[var(--ink)] border-b border-[var(--line)] pb-2">
                  <span className="capitalize">{colStatus}</span>
                  <span className="ml-auto bg-[var(--gold-mid)] text-white size-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {colRows.length}
                  </span>
                </div>
                
                <div className="mt-4 space-y-3 min-h-[350px]">
                  {colRows.map((booking) => (
                    <div 
                      key={booking.id} 
                      className={`kanban-card transition-opacity ${busy === booking.id ? "opacity-50" : ""}`}
                    >
                      <strong className="text-[var(--ink)] text-sm block">
                        {booking.guest?.name || booking.guestName}
                      </strong>
                      <span className="block font-mono text-[10px] text-[var(--gold-deep)] mt-1">
                        {booking.reference}
                      </span>
                      <p className="text-xs text-[var(--muted)] mt-2">
                        {booking.nights} nights · {booking.guests} guests
                      </p>
                      <p className="text-[10px] text-[var(--muted)] font-medium mt-1">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                      
                      {/* Action buttons inside card */}
                      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--line)] pt-3">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => transition(booking.id, "confirmed")}
                              className="border border-green-700 bg-green-50/50 hover:bg-green-100/50 px-2.5 py-1 text-[10px] text-green-700 font-bold rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => transition(booking.id, "rejected")}
                              className="border border-red-700 bg-red-50/50 hover:bg-red-100/50 px-2.5 py-1 text-[10px] text-red-700 font-bold rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => transition(booking.id, "completed")}
                              className="border border-[var(--gold)] hover:bg-[var(--cream)] px-2.5 py-1 text-[10px] text-[var(--gold-deep)] font-bold rounded"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => transition(booking.id, "cancelled")}
                              className="border border-red-700 bg-red-50/50 hover:bg-red-100/50 px-2.5 py-1 text-[10px] text-red-700 font-bold rounded"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {!colRows.length && (
                    <div className="text-center py-8 text-xs text-[var(--muted)] italic border-2 border-dashed border-[var(--line)] rounded-lg bg-white/50">
                      No bookings
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="surface-3d overflow-hidden rounded-xl bg-white border border-[var(--line)] shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[var(--parchment)] text-xs uppercase tracking-wider text-[var(--ink)] border-b border-[var(--line)]">
                <tr>
                  <th className="p-4 font-semibold">Guest</th>
                  <th className="font-semibold">Stay</th>
                  <th className="font-semibold">Dates</th>
                  <th className="font-semibold">Status</th>
                  <th className="p-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rows.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`transition-colors duration-200 hover:bg-[var(--cream)]/40 ${
                      busy === booking.id ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-4">
                      <strong className="text-[var(--ink)]">{booking.guest?.name || booking.guestName}</strong>
                      <small className="block text-[var(--muted)] mt-1">
                        {booking.guest?.email || booking.email}
                        <br />
                        <span className="font-mono text-xs text-[var(--gold-deep)]">{booking.reference}</span>
                      </small>
                    </td>
                    <td>
                      {booking.nights} nights · {booking.guests} guests
                    </td>
                    <td>
                      {booking.checkIn} → {booking.checkOut}
                    </td>
                    <td>
                      <Pill value={booking.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => transition(booking.id, "confirmed")}
                              className="interactive-3d border-green-700 bg-green-50/50 hover:bg-green-100/50 px-3 py-1.5 text-xs text-green-700 font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => transition(booking.id, "rejected")}
                              className="interactive-3d border-red-700 bg-red-50/50 hover:bg-red-100/50 px-3 py-1.5 text-xs text-red-700 font-bold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <button
                              onClick={() => transition(booking.id, "completed")}
                              className="interactive-3d px-3 py-1.5 text-xs font-bold"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => transition(booking.id, "cancelled")}
                              className="interactive-3d border-red-700 bg-red-50/50 hover:bg-red-100/50 px-3 py-1.5 text-xs text-red-700 font-bold"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
