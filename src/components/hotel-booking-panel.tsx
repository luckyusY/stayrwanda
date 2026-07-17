"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, Loader2, Users } from "lucide-react";
import type { Hotel, UnitType } from "@/lib/platform-types";
import { useCurrency } from "@/components/currency-provider";
import { SlotCounter } from "@/components/slot-counter";
import { useToast } from "@/components/toast";

export function HotelBookingPanel({ hotel, unit }: { hotel: Hotel; unit: UnitType | null }) {
  const { currency, format } = useCurrency();
  const { toast } = useToast();
  const [form, setForm] = useState({ guestName: "", email: "", phone: "", checkIn: "", checkOut: "", guests: "2" });
  const [state, setState] = useState<{ loading?: boolean; error?: string; reference?: string; token?: string }>({});
  const nights = useMemo(() => form.checkIn && form.checkOut ? Math.max(0, Math.round((Date.parse(form.checkOut) - Date.parse(form.checkIn)) / 86400000)) : 0, [form.checkIn, form.checkOut]);

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
    if (!response.ok) {
      const errMsg = data.error || "Unable to send your request.";
      toast.error("Request Failed", errMsg);
      return setState({ error: errMsg });
    }
    toast.success("Request Received", `Reference: ${data.booking.reference}`);
    setState({ reference: data.booking.reference, token: data.booking.publicToken });
  }

  if (state.reference) return <aside className="surface-3d surface-3d-success bg-[var(--cream)] p-7 rounded-xl shadow-md">
    <span className="grid size-12 place-items-center rounded-full bg-[var(--gold)] text-white"><Check /></span>
    <h2 className="mt-5 font-serif text-2xl font-semibold text-[var(--ink)]">Request received</h2>
    <p className="mt-2 text-sm text-[var(--muted)]">Reference {state.reference}. We have held the requested inventory while the host reviews it.</p>
    {state.token && <Link href={`/bookings/${state.reference}?token=${encodeURIComponent(state.token)}`} className="button-3d mt-5 inline-block bg-[var(--ink)] px-5 py-3 text-xs font-semibold uppercase tracking-[.14em] text-white">Track request</Link>}
  </aside>;

  return <aside className="surface-3d form-card-3d h-fit p-6 lg:sticky lg:top-24 bg-white rounded-xl shadow-md">
    <p className="eyebrow">Request to book</p>
    <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--ink)]">{unit ? format(unit.basePriceRwf) : "Rate on request"}</h2>
    <p className="text-xs text-[var(--muted)]">{unit ? "per night · no payment collected now" : "Contact the property for current availability"}</p>
    
    <form className="mt-5 space-y-4" onSubmit={submit}>
      <div className="float-field">
        <input required value={form.guestName} onChange={(e) => setForm((prev) => ({ ...prev, guestName: e.target.value }))} placeholder=" " />
        <label>Full name</label>
      </div>

      <div className="float-field">
        <input required type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder=" " />
        <label>Email address</label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="field-3d p-2 text-[10px] uppercase tracking-wider text-[var(--muted)] flex flex-col justify-between">
          <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-[var(--gold-deep)]" /> Check-in</span>
          <input required type="date" value={form.checkIn} onChange={(e) => setForm((prev) => ({ ...prev, checkIn: e.target.value }))} className="mt-1 block w-full bg-transparent text-xs text-[var(--ink)] outline-none" />
        </label>
        <label className="field-3d p-2 text-[10px] uppercase tracking-wider text-[var(--muted)] flex flex-col justify-between">
          <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-[var(--gold-deep)]" /> Check-out</span>
          <input required type="date" value={form.checkOut} onChange={(e) => setForm((prev) => ({ ...prev, checkOut: e.target.value }))} className="mt-1 block w-full bg-transparent text-xs text-[var(--ink)] outline-none" />
        </label>
      </div>

      {/* Rebuilt Guest Selector counter widget */}
      <div className="flex items-center justify-between p-3 border border-[var(--line)] rounded-lg bg-white">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-2">
          <Users size={15} className="text-[var(--gold-deep)]" /> Guests
        </span>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, guests: String(Math.max(1, Number(prev.guests) - 1)) }))}
            disabled={Number(form.guests) <= 1}
            className="interactive-3d flex size-7 items-center justify-center !border-[var(--gold)] text-[var(--gold-deep)] disabled:border-[#ccc] disabled:text-[#ccc] disabled:shadow-none transition-colors"
          >
            -
          </button>
          <SlotCounter value={Number(form.guests)} />
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, guests: String(Math.min(unit?.maxGuests || 20, Number(prev.guests) + 1)) }))}
            disabled={Number(form.guests) >= (unit?.maxGuests || 20)}
            className="interactive-3d flex size-7 items-center justify-center !border-[var(--gold)] text-[var(--gold-deep)] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {state.error && <p className="surface-3d-error rounded-[var(--radius-control)] border p-3 text-sm text-[#a33]">{state.error}</p>}
      
      <button disabled={!unit || state.loading} className="button-3d flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--ink)] text-xs font-semibold uppercase tracking-[.16em] text-white disabled:opacity-50 transition-colors">
        {state.loading && <Loader2 className="animate-spin" size={16} />}
        {unit ? "Send booking request" : "Inventory coming soon"}
      </button>
    </form>
    
    {nights > 0 && unit && (
      <div className="mt-4 border-t border-[var(--line)] pt-3">
        <details className="group">
          <summary className="flex justify-between items-center text-xs text-[var(--muted)] cursor-pointer select-none outline-none hover:text-[var(--ink)] transition-colors">
            <span>{nights} nights summary</span>
            <span className="text-[10px] text-[var(--gold-deep)] font-semibold uppercase tracking-wider group-open:hidden">View breakdown</span>
            <span className="text-[10px] text-[var(--gold-deep)] font-semibold uppercase tracking-wider hidden group-open:inline">Hide breakdown</span>
          </summary>
          <div className="mt-2.5 space-y-2 text-xs text-[var(--muted)] bg-[var(--parchment)] p-3 rounded-lg border border-[var(--line)]">
            <div className="flex justify-between">
              <span>Base rate ({nights} × {format(unit.basePriceRwf)})</span>
              <span>{format(nights * unit.basePriceRwf)}</span>
            </div>
            <div className="flex justify-between">
              <span>Local Service fee</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-[var(--line)] pt-2 font-semibold text-[var(--ink)]">
              <span>Estimated total</span>
              <span>{format(nights * unit.basePriceRwf)}</span>
            </div>
          </div>
        </details>
      </div>
    )}
  </aside>;
}
