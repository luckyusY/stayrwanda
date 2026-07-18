"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarX,
  Check,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  Users2,
} from "lucide-react";
import type { Hotel, UnitType } from "@/lib/platform-types";
import { useCurrency } from "@/components/currency-provider";
import { useToast } from "@/components/toast";
import { CalendarPopout } from "@/components/calendar-popout";
import { Button } from "@/components/ui/button";
import { Popout } from "@/components/popout";
import { EASE } from "@/lib/motion";

const STEPS = [
  { id: "dates", label: "Dates" },
  { id: "guests", label: "Guests" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function prettyDate(value: string) {
  if (!value) return "Add date";
  return new Date(value + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function HotelBookingPanel({ hotel, unit }: { hotel: Hotel; unit: UnitType | null }) {
  const { currency, format } = useCurrency();
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState<StepId>("dates");
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  });
  const [state, setState] = useState<{ loading?: boolean; error?: string; reference?: string; token?: string }>({});

  const nights = useMemo(
    () =>
      form.checkIn && form.checkOut
        ? Math.max(0, Math.round((Date.parse(form.checkOut) - Date.parse(form.checkIn)) / 86400000))
        : 0,
    [form.checkIn, form.checkOut],
  );

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function validate(): string | null {
    if (step === "dates") {
      if (!form.checkIn || !form.checkOut) return "Please choose check-in and check-out dates.";
      if (nights < 1) return "Check-out must be after check-in.";
    }
    if (step === "guests" && Number(form.guests) < 1) return "At least one guest is required.";
    if (step === "details") {
      if (!form.guestName.trim() || !form.email.trim()) return "Please add your name and email.";
    }
    return null;
  }

  function goNext() {
    const err = validate();
    if (err) {
      setState({ error: err });
      return;
    }
    setState({});
    if (step === "dates") setStep("guests");
    else if (step === "guests") setStep("details");
    else if (step === "details") setStep("review");
  }

  function goBack() {
    setState({});
    if (step === "guests") setStep("dates");
    else if (step === "details") setStep("guests");
    else if (step === "review") setStep("details");
  }

  async function submit() {
    if (!unit) return;
    setState({ loading: true });
    const idempotencyKey = crypto.randomUUID();
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
      body: JSON.stringify({
        hotelId: hotel.id,
        unitTypeId: unit.id,
        guestName: form.guestName,
        email: form.email,
        phone: form.phone,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        quantity: 1,
        currency,
      }),
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

  function openWizard() {
    setStep("dates");
    setState({});
    setWizardOpen(true);
  }

  if (state.reference) {
    return (
      <aside className="surface-3d surface-3d-success rounded-xl bg-[var(--cream)] p-7 shadow-md">
        <span className="grid size-12 place-items-center rounded-full bg-[var(--gold)] text-white">
          <Check />
        </span>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-[var(--ink)]">Request received</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Reference {state.reference}. We have held the requested inventory while the host reviews it.
        </p>
        {state.token && (
          <Link
            href={`/bookings/${state.reference}?token=${encodeURIComponent(state.token)}`}
            className="button-3d mt-5 inline-block bg-[var(--ink)] px-5 py-3 text-xs font-semibold uppercase tracking-[.14em] text-white"
          >
            Track request
          </Link>
        )}
      </aside>
    );
  }

  return (
    <>
      <aside className="surface-3d form-card-3d h-fit rounded-xl bg-white p-6 shadow-md lg:sticky lg:top-24">
        <div className="mb-3 flex items-center gap-2">
          <Image
            src="/brand/stayrwanda-mark.png"
            alt=""
            width={32}
            height={32}
            className="size-8 object-contain"
          />
          <p className="eyebrow m-0 flex flex-1 items-center justify-between">
            <span>Request to book</span>
            <span className="flex items-center gap-1 text-[var(--rwanda-green)]" title="Verified Host">
              <ShieldCheck size={14} /> Verified
            </span>
          </p>
        </div>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-[var(--ink)]">
          {unit ? format(unit.basePriceRwf) : hotel.startingPriceRwf ? format(hotel.startingPriceRwf) : "Rate on request"}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <CreditCard size={13} className="text-[var(--gold-mid)]" />
          {unit ? "per night · no payment collected now" : hotel.startingPriceRwf ? "indicative nightly rate · contact the property for availability" : "Contact the property for current availability"}
        </p>
        <button
          type="button"
          disabled={!unit}
          onClick={openWizard}
          className="button-3d mt-5 flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--ink)] text-xs font-semibold uppercase tracking-[.16em] text-white transition-colors disabled:opacity-50"
        >
          {unit ? "Start booking request" : "Inventory coming soon"}
        </button>
        <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
          Multi-step request · soft hold · host confirmation
        </p>
      </aside>

      <Popout
        variant="dialog"
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title="Request to book"
        showLogo
        className="w-[95vw] max-w-lg rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-[var(--line)] bg-[var(--parchment)]/50 px-5 py-3">
          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--gold-deep)]">{hotel.category}</p>
          <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">{hotel.name}</h3>
          {nights > 0 && unit && (
            <p className="text-xs text-[var(--muted)]">
              {nights} night{nights === 1 ? "" : "s"} · est. {format(nights * unit.basePriceRwf)}
            </p>
          )}
        </div>

        <div className="px-5 pt-4">
          <div className="mb-3 flex justify-between gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-[10px] font-bold ${
                    i <= stepIndex ? "bg-[var(--ink)] text-white" : "bg-[var(--cream)] text-[var(--muted)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${
                    i <= stepIndex ? "text-[var(--ink)]" : "text-[var(--muted)]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[var(--cream-2)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--gold-deep)] via-[var(--gold-mid)] to-[var(--clay)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-5 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="space-y-4"
            >
              {step === "dates" && (
                <>
                  <p className="font-serif text-xl text-[var(--ink)]">Select your dates</p>
                  <CalendarPopout
                    checkIn={form.checkIn}
                    checkOut={form.checkOut}
                    onChange={(checkIn, checkOut) => setForm((prev) => ({ ...prev, checkIn, checkOut }))}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="search-field-well flex cursor-pointer flex-col justify-between p-3 transition-colors hover:bg-[var(--parchment)]">
                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          <CalendarCheck size={13} className="text-[var(--gold-deep)]" /> Check-in
                        </span>
                        <span className="mt-1 block text-sm font-medium text-[var(--ink)]">
                          {form.checkIn ? prettyDate(form.checkIn) : "Add date"}
                        </span>
                      </div>
                      <div className="search-field-well flex cursor-pointer flex-col justify-between p-3 transition-colors hover:bg-[var(--parchment)]">
                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          <CalendarX size={13} className="text-[var(--gold-deep)]" /> Check-out
                        </span>
                        <span className="mt-1 block text-sm font-medium text-[var(--ink)]">
                          {form.checkOut ? prettyDate(form.checkOut) : "Add date"}
                        </span>
                      </div>
                    </div>
                  </CalendarPopout>
                </>
              )}

              {step === "guests" && (
                <>
                  <p className="font-serif text-xl text-[var(--ink)]">How many guests?</p>
                  <div className="search-field-well flex items-center justify-between px-4 py-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                      <Users2 size={16} className="text-[var(--gold-deep)]" /> Guests
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            guests: String(Math.max(1, Number(prev.guests) - 1)),
                          }))
                        }
                        disabled={Number(form.guests) <= 1}
                        className="interactive-3d grid size-9 place-items-center disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2ch] text-center font-serif text-2xl font-semibold">
                        {form.guests}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            guests: String(Math.min(unit?.maxGuests || 20, Number(prev.guests) + 1)),
                          }))
                        }
                        className="interactive-3d grid size-9 place-items-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === "details" && (
                <>
                  <p className="font-serif text-xl text-[var(--ink)]">Your details</p>
                  <label className="block">
                    <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Full name
                    </span>
                    <span className="search-field-well block px-3 py-2.5">
                      <input
                        required
                        value={form.guestName}
                        onChange={(e) => setForm((prev) => ({ ...prev, guestName: e.target.value }))}
                        placeholder="Your full name"
                        className="search-field-input"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Email
                    </span>
                    <span className="search-field-well block px-3 py-2.5">
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="search-field-input"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Phone (optional)
                    </span>
                    <span className="search-field-well block px-3 py-2.5">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+250 …"
                        className="search-field-input"
                      />
                    </span>
                  </label>
                </>
              )}

              {step === "review" && (
                <>
                  <p className="font-serif text-xl text-[var(--ink)]">Review & submit</p>
                  <dl className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line)]">
                    {[
                      ["Property", hotel.name],
                      ["Check-in", prettyDate(form.checkIn)],
                      ["Check-out", prettyDate(form.checkOut)],
                      ["Guests", form.guests],
                      ["Name", form.guestName],
                      ["Email", form.email],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 px-4 py-2.5 text-sm">
                        <dt className="text-[var(--muted)]">{k}</dt>
                        <dd className="text-right font-medium text-[var(--ink)]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-xs text-[var(--muted)]">
                    No payment now. Inventory is soft-held while the host reviews.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {state.error && (
            <p className="surface-3d-error mt-4 rounded-[var(--radius-control)] border p-3 text-sm text-[#a33]">
              {state.error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={step === "dates" ? () => setWizardOpen(false) : goBack}
            disabled={state.loading}
          >
            {step === "dates" ? "Cancel" : "Back"}
          </Button>
          {step === "review" ? (
            <Button type="button" variant="primary" loading={!!state.loading} onClick={submit}>
              Submit request
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={goNext}>
              Continue
            </Button>
          )}
        </div>
      </Popout>
    </>
  );
}
