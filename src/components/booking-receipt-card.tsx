"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Users, Clock3, ChevronDown, ChevronUp, ArrowRight, Bed } from "lucide-react";
import { formatRwf, formatDate } from "@/lib/pricing";
import { CountdownBadge } from "@/components/countdown-badge";
import type { GuestBooking } from "@/lib/guest-account";

const STATUS_CONFIG: Record<string, { label: string; colour: string; dot: string }> = {
  pending:   { label: "Pending",   colour: "bg-[var(--gold-pale)] text-[var(--gold-deep)] border-[var(--gold)]/20",           dot: "bg-[var(--gold)]" },
  confirmed: { label: "Confirmed", colour: "bg-[var(--green-light)] text-[var(--rwanda-green)] border-[var(--rwanda-green)]/20", dot: "bg-[var(--rwanda-green)]" },
  completed: { label: "Completed", colour: "bg-[var(--mist)] text-[var(--muted)] border-[var(--line)]",                        dot: "bg-[var(--muted)]" },
  cancelled: { label: "Cancelled", colour: "bg-red-50 text-[var(--terracotta)] border-[var(--terracotta)]/20",                 dot: "bg-[var(--terracotta)]" },
  rejected:  { label: "Rejected",  colour: "bg-red-50 text-[var(--terracotta)] border-[var(--terracotta)]/20",                 dot: "bg-[var(--terracotta)]" },
  expired:   { label: "Expired",   colour: "bg-[var(--mist)] text-[var(--muted)] border-[var(--line)]",                        dot: "bg-[var(--muted)]" },
};

export function BookingReceiptCard({ booking }: { booking: GuestBooking }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG["pending"];
  const nights = booking.nights || 1;
  const isUpcomingSoon = booking.isUpcoming;

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
        isUpcomingSoon ? "border-[var(--gold)]/40" : "border-[var(--line)]"
      }`}
    >
      {/* Upcoming stripe */}
      {isUpcomingSoon && (
        <div className="h-0.5 w-full bg-gradient-to-r from-[var(--gold)] via-[var(--gold-mid)] to-[var(--cream)]" />
      )}

      <div className="flex flex-col sm:flex-row">
        {/* Property image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[var(--cream)] sm:h-auto sm:w-52">
          {booking.propertyImage ? (
            <Image
              src={booking.propertyImage}
              alt={booking.propertyName}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 640px) 100vw, 208px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--gold-deep)]">
              <Bed size={36} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${status.colour}`}>
                  <span className={`size-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <CountdownBadge checkIn={booking.checkIn} />
              </div>
              <span className="font-mono text-[10px] text-[var(--muted)]">{booking.reference}</span>
            </div>

            {/* Property name */}
            <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-[var(--ink)]">
              {booking.propertyName}
            </h3>

            {/* Date + guests row */}
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-[var(--gold-deep)]" />
                {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-[var(--gold-deep)]" />
                {booking.guests} guest{booking.guests > 1 ? "s" : ""} · {nights} night{nights > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Footer row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <div>
              {booking.totalRwf ? (
                <p className="font-serif text-lg font-semibold text-[var(--ink)]">
                  {formatRwf(booking.totalRwf)}
                  <span className="ml-1 text-xs font-normal text-[var(--muted)]">total</span>
                </p>
              ) : null}
              {booking.nightlyRwf ? (
                <p className="text-xs text-[var(--muted)]">{formatRwf(booking.nightlyRwf)} / night</p>
              ) : null}
              {!booking.totalRwf && !booking.nightlyRwf && (
                <p className="text-sm text-[var(--muted)]">Price confirmed by host</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold-deep)]"
                aria-expanded={expanded}
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {expanded ? "Less" : "Details"}
              </button>
              <Link
                href={`/bookings/${booking.reference}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[var(--ink-2)]"
              >
                View <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Expanded details drawer */}
          {expanded && (
            <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--parchment)] p-4 text-xs">
              <p className="mb-2 font-bold uppercase tracking-wider text-[var(--ink)]">Booking snapshot</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[var(--muted)]">
                <span>Reference</span>
                <span className="font-mono font-semibold text-[var(--ink)]">{booking.reference}</span>
                <span>Check-in</span>
                <span className="font-semibold text-[var(--ink)]">{formatDate(booking.checkIn)}</span>
                <span>Check-out</span>
                <span className="font-semibold text-[var(--ink)]">{formatDate(booking.checkOut)}</span>
                <span>Nights</span>
                <span className="font-semibold text-[var(--ink)]">{nights}</span>
                <span>Guests</span>
                <span className="font-semibold text-[var(--ink)]">{booking.guests}</span>
                {booking.nightlyRwf ? (
                  <>
                    <span>Nightly rate</span>
                    <span className="font-semibold text-[var(--ink)]">{formatRwf(booking.nightlyRwf)}</span>
                  </>
                ) : null}
                {booking.totalRwf ? (
                  <>
                    <span>Total (snapshot)</span>
                    <span className="font-semibold text-[var(--gold-deep)]">{formatRwf(booking.totalRwf)}</span>
                  </>
                ) : null}
              </div>
              <p className="mt-3 text-[10px] text-[var(--muted)]">
                Prices are locked at the time of booking. Final amounts confirmed by your host.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
