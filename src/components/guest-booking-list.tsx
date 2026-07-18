"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarCheck, Clock3 } from "lucide-react";
import { formatRwf } from "@/lib/pricing";
import type { GuestBooking } from "@/lib/guest-account";
import { EmptyState } from "@/components/account-shell";

type Filter = "upcoming" | "past" | "requests";

export function GuestBookingList({ bookings }: { bookings: GuestBooking[] }) {
  const [filter, setFilter] = useState<Filter>("upcoming");
  const rows = useMemo(() => bookings.filter((booking) => {
    if (filter === "upcoming") return booking.isUpcoming && ["pending", "confirmed"].includes(booking.status);
    if (filter === "requests") return ["pending", "rejected", "cancelled", "expired"].includes(booking.status);
    return !booking.isUpcoming || booking.status === "completed";
  }), [bookings, filter]);

  return <div className="space-y-5">
    <div className="surface-3d flex flex-wrap gap-2 bg-white p-2">
      {(["upcoming", "past", "requests"] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${filter === item ? "bg-[var(--ink)] text-white" : "text-[var(--muted)] hover:bg-[var(--parchment)] hover:text-[var(--ink)]"}`}>{item}</button>)}
    </div>
    {rows.length ? rows.map((booking) => <article key={booking.id} className="surface-3d surface-3d-lift overflow-hidden bg-white sm:grid sm:grid-cols-[170px_1fr]">
      <div className="relative min-h-40 bg-[var(--cream)]">{booking.propertyImage ? <Image src={booking.propertyImage} alt={booking.propertyName} fill className="object-cover" sizes="(max-width: 640px) 100vw, 170px" /> : <CalendarCheck className="absolute inset-0 m-auto text-[var(--gold-deep)]" size={32} />}</div>
      <div className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">{booking.reference}</p><h2 className="mt-1 font-serif text-2xl font-semibold text-[var(--ink)]">{booking.propertyName}</h2></div><span className="rounded-full bg-[var(--gold-pale)] px-3 py-1 text-xs font-bold capitalize text-[var(--gold-deep)]">{booking.status}</span></div>
        <p className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]"><Clock3 size={15} /> {booking.checkIn} → {booking.checkOut} · {booking.nights || "—"} nights · {booking.guests || "—"} guests</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--line)] pt-4"><div><p className="text-xs text-[var(--muted)]">Booking price snapshot</p><p className="mt-1 font-serif text-lg font-semibold text-[var(--ink)]">{booking.totalRwf ? formatRwf(booking.totalRwf) : "Price confirmed by host"}</p>{booking.nightlyRwf && <p className="text-xs text-[var(--muted)]">{formatRwf(booking.nightlyRwf)} / night</p>}</div><Link href={`/bookings/${booking.reference}`} className="button-3d bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[.14em] text-white">View details</Link></div>
      </div>
    </article>) : <EmptyState icon={CalendarCheck} title={`No ${filter} bookings`} copy="Your booking requests and confirmed stays will appear here." action="Find a stay" href="/stays" />}
  </div>;
}
