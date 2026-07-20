"use client";

import { useState, useMemo } from "react";
import { CalendarCheck } from "lucide-react";
import { BookingReceiptCard } from "@/components/booking-receipt-card";
import { EmptyState } from "@/components/account-shell";
import type { GuestBooking } from "@/lib/guest-account";

type Tab = "upcoming" | "past" | "requests";

const TAB_LABELS: Record<Tab, string> = {
  upcoming: "Upcoming",
  past:     "Completed",
  requests: "Requests",
};

export function GuestBookingList({ bookings }: { bookings: GuestBooking[] }) {
  const [tab, setTab] = useState<Tab>("upcoming");

  const todayStr = new Date().toISOString().slice(0, 10);

  const counts = useMemo(
    () => ({
      upcoming: bookings.filter(
        (b) => ["confirmed", "pending"].includes(b.status) && b.checkOut >= todayStr
      ).length,
      past: bookings.filter(
        (b) => b.status === "completed" || (b.status === "confirmed" && b.checkOut < todayStr)
      ).length,
      requests: bookings.filter((b) =>
        ["pending", "cancelled", "rejected", "expired"].includes(b.status)
      ).length,
    }),
    [bookings, todayStr]
  );

  const rows = useMemo(() => {
    if (tab === "upcoming")
      return bookings.filter(
        (b) => ["confirmed", "pending"].includes(b.status) && b.checkOut >= todayStr
      ).sort((a, b) => a.checkIn.localeCompare(b.checkIn));
    if (tab === "past")
      return bookings.filter(
        (b) => b.status === "completed" || (b.status === "confirmed" && b.checkOut < todayStr)
      ).sort((a, b) => b.checkOut.localeCompare(a.checkOut));
    return bookings
      .filter((b) => ["pending", "cancelled", "rejected", "expired"].includes(b.status))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, tab, todayStr]);

  return (
    <div className="space-y-5">
      {/* Pill tab bar */}
      <div className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(["upcoming", "past", "requests"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all sm:px-5 ${
              tab === t
                ? "bg-[var(--ink)] text-white shadow-sm"
                : "bg-white border border-[var(--line)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--ink)]"
            }`}
          >
            {TAB_LABELS[t]}
            <span
              className={`inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                tab === t
                  ? "bg-white/20 text-white"
                  : "bg-[var(--cream)] text-[var(--muted)]"
              }`}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      {rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map((booking) => (
            <BookingReceiptCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title={`No ${TAB_LABELS[tab].toLowerCase()} bookings`}
          copy={
            tab === "upcoming"
              ? "Your confirmed and upcoming stays will appear here."
              : tab === "past"
              ? "Completed stays will be listed here after your check-out."
              : "Booking requests and their current status will appear here."
          }
          action="Find a stay"
          href="/stays"
        />
      )}
    </div>
  );
}
