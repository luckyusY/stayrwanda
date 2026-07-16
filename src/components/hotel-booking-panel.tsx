"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, Loader2, Users } from "lucide-react";
import type { Hotel, UnitType } from "@/lib/platform-types";
import { useCurrency } from "@/components/currency-provider";

export function HotelBookingPanel({ hotel, unit }: { hotel: Hotel; unit: UnitType | null }) {
  const { currency, format } = useCurrency();
  const [form, setForm] = useState({ guestName: "", email: "", phone: "", checkIn: "", checkOut: "", guests: "2" });
  const [state, setState] = useState<{ loading?: boolean; error?: string; reference?: string; token?: string }>({});
  const nights = useMemo(() => form.checkIn && form.checkOut ? Math.max(0, Math.round((Date.parse(form.checkOut) - Date.parse(form.checkIn)) / 86400000)) : 0, [form.checkIn, form.checkOut]);
  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => setForm((old) => ({ ...old, [key]: event.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!unit) return;
    setState({ loading: true });
    const idempotencyKey = crypto.randomUUID();
    const response = await fetch("/api/bookings", {
      method: "POST", headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
      body: JSON.stringify({ hotelId: hotel.id, unitTypeId: unit.id, guestName: form.guestName, email: form.email, phone: form.phone, checkIn: form.checkIn, checkOut: form.checkOut, guests: Number(form.guests), quantity: 1, currency }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return setState({ error: data.error || "Unable to send your request." });
    setState({ reference: data.booking.reference, token: data.booking.publicToken });
  }

  if (state.reference) return <aside className="border border-[var(--gold)] bg-[var(--cream)] p-7">
    <span className="grid size-12 place-items-center rounded-full bg-[var(--gold)] text-white"><Check /></span>
    <h2 className="mt-5 font-serif text-2xl font-semibold text-[var(--ink)]">Request received</h2>
    <p className="mt-2 text-sm text-[var(--muted)]">Reference {state.reference}. We have held the requested inventory while the host reviews it.</p>
    {state.token && <Link href={`/bookings/${state.reference}?token=${encodeURIComponent(state.token)}`} className="mt-5 inline-block bg-[var(--ink)] px-5 py-3 text-xs font-semibold uppercase tracking-[.14em] text-white">Track request</Link>}
  </aside>;

  return <aside className="h-fit border border-[var(--line)] bg-white p-6 card-shadow lg:sticky lg:top-24">
    <p className="eyebrow">Request to book</p>
    <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--ink)]">{unit ? format(unit.basePriceRwf) : "Rate on request"}</h2>
    <p className="text-xs text-[var(--muted)]">{unit ? "per night · no payment collected now" : "Contact the property for current availability"}</p>
    <form className="mt-5 space-y-3" onSubmit={submit}>
      <input required value={form.guestName} onChange={set("guestName")} placeholder="Full name" className="min-h-11 w-full border border-[var(--line)] px-3 text-sm outline-none focus:border-[var(--gold)]" />
      <input required type="email" value={form.email} onChange={set("email")} placeholder="Email address" className="min-h-11 w-full border border-[var(--line)] px-3 text-sm outline-none focus:border-[var(--gold)]" />
      <div className="grid grid-cols-2 gap-2"><label className="border border-[var(--line)] p-2 text-[10px] uppercase tracking-wider text-[var(--muted)]"><CalendarDays size={14} className="mb-1" />Check-in<input required type="date" value={form.checkIn} onChange={set("checkIn")} className="mt-1 block w-full text-xs text-[var(--ink)] outline-none" /></label><label className="border border-[var(--line)] p-2 text-[10px] uppercase tracking-wider text-[var(--muted)]"><CalendarDays size={14} className="mb-1" />Check-out<input required type="date" value={form.checkOut} onChange={set("checkOut")} className="mt-1 block w-full text-xs text-[var(--ink)] outline-none" /></label></div>
      <label className="flex min-h-11 items-center gap-2 border border-[var(--line)] px-3"><Users size={16} /><input required min="1" max={unit?.maxGuests || 20} type="number" value={form.guests} onChange={set("guests")} className="w-full text-sm outline-none" /></label>
      {state.error && <p className="bg-[#fbf0ee] p-3 text-sm text-[#a33]">{state.error}</p>}
      <button disabled={!unit || state.loading} className="flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--ink)] text-xs font-semibold uppercase tracking-[.16em] text-white disabled:opacity-50">{state.loading && <Loader2 className="animate-spin" size={16} />}{unit ? "Send booking request" : "Inventory coming soon"}</button>
    </form>
    {nights > 0 && unit && <p className="mt-4 text-center text-xs text-[var(--muted)]">{nights} nights · estimated {format(nights * unit.basePriceRwf)}</p>}
  </aside>;
}
