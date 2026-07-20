"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarX,
  Check,
  CreditCard,
  MapPin,
  MessageCircle,
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
import { trackConversionEvent } from "@/lib/conversion-events";

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

export function HotelBookingPanel({ hotel, unit, whatsappNumber }: { hotel: Hotel; unit: UnitType | null; whatsappNumber?: string }) {
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
  const nightlyRwf = unit?.basePriceRwf || hotel.startingPriceRwf || 0;
  const subtotalRwf = nights * nightlyRwf;
  const totalRwf = subtotalRwf;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello StayRwanda, I am interested in ${hotel.name}${form.checkIn && form.checkOut ? ` from ${form.checkIn} to ${form.checkOut}` : ""}.`)}`
    : null;

  useEffect(() => {
    trackConversionEvent("property_viewed", { hotelSlug: hotel.slug, category: hotel.category });
  }, [hotel.category, hotel.slug]);

  function validate(): string | null {
    if (step === "dates") {
      if (!form.checkIn || !form.checkOut) return "Please choose check-in and check-out dates.";
      if (nights < 1) return "Check-out must be after check-in.";
    }
    if (step === "guests" && Number(form.guests) < 1) return "At least one guest is required.";
    if (step === "details") {
      if (!form.guestName.trim() || !form.email.trim()) return "Please add your name and email.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
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
    trackConversionEvent("booking_step_completed", { hotelSlug: hotel.slug, step });
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
    trackConversionEvent("booking_submitted", { hotelSlug: hotel.slug, nights, guests: Number(form.guests), currency });
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
      trackConversionEvent("booking_failed", { hotelSlug: hotel.slug, code: data.code || response.status });
      toast.error("Request Failed", errMsg);
      return setState({ error: errMsg });
    }
    toast.success("Request Received", `Reference: ${data.booking.reference}`);
    trackConversionEvent("booking_succeeded", { hotelSlug: hotel.slug, nights, currency });
    setState({ reference: data.booking.reference, token: data.booking.publicToken });
  }

  function openWizard() {
    setStep("dates");
    setState({});
    setWizardOpen(true);
    trackConversionEvent("booking_started", { hotelSlug: hotel.slug, nightlyRwf, currency });
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
            <span className="flex items-center gap-1 text-[var(--rwanda-green)]" title="Published StayRwanda listing">
              <ShieldCheck size={14} /> Published
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
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-[var(--ink)]">
          <span className="flex items-center gap-2 rounded-lg bg-[var(--parchment)] px-3 py-2"><ShieldCheck size={14} className="shrink-0 text-[var(--gold-deep)]" /> Tracked request</span>
          <span className="flex items-center gap-2 rounded-lg bg-[var(--parchment)] px-3 py-2"><MapPin size={14} className="shrink-0 text-[var(--gold-deep)]" /> Kigali listing</span>
        </div>
        <button
          type="button"
          disabled={!unit}
          onClick={openWizard}
          className="button-3d mt-5 flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--ink)] text-xs font-semibold uppercase tracking-[.16em] text-white transition-colors disabled:opacity-50"
        >
          {unit ? "Start booking request" : "Inventory coming soon"}
        </button>
        <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
          No payment now · dates held while the host reviews
        </p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversionEvent("concierge_opened", { hotelSlug: hotel.slug })}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] text-xs font-semibold text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold-deep)]"
          >
            <MessageCircle size={16} /> Ask StayRwanda on WhatsApp
          </a>
        )}
      </aside>

      {unit && !wizardOpen && (
        <div className="fixed inset-x-3 z-[34] lg:hidden bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px)+.65rem)]">
          <div className="surface-3d-floating flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white p-2.5 pl-4 shadow-[0_12px_34px_rgba(20,34,58,.24)]">
            <div className="min-w-0">
              <span className="block text-[9px] font-semibold uppercase tracking-[.13em] text-[var(--muted)]">From</span>
              <strong className="block truncate font-serif text-lg leading-tight text-[var(--ink)]">{format(nightlyRwf)}</strong>
              <span className="block text-[9px] text-[var(--muted)]">per night · no payment now</span>
            </div>
            <button type="button" onClick={openWizard} className="button-3d min-h-12 shrink-0 bg-[var(--ink)] px-4 text-[10px] font-semibold uppercase tracking-[.12em] text-white">
              Check dates
            </button>
          </div>
        </div>
      )}

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
            <p className="text-xs font-medium text-[var(--muted)]">
              {nights} night{nights === 1 ? "" : "s"} · {format(totalRwf)} total · no payment now
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
                        className="interactive-3d grid size-11 place-items-center disabled:opacity-40"
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
                        className="interactive-3d grid size-11 place-items-center"
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
                  <div className="rounded-xl bg-[var(--parchment)] p-4">
                    <div className="flex justify-between gap-3 text-sm text-[var(--ink)]">
                      <span>{format(nightlyRwf)} × {nights} night{nights === 1 ? "" : "s"}</span>
                      <strong>{format(subtotalRwf)}</strong>
                    </div>
                    <div className="mt-2 flex justify-between gap-3 text-sm text-[var(--muted)]"><span>StayRwanda service fee</span><span>{format(0)}</span></div>
                    <div className="mt-2 flex justify-between gap-3 text-sm text-[var(--muted)]"><span>Payment due now</span><span>{format(0)}</span></div>
                    <div className="mt-3 flex justify-between gap-3 border-t border-[var(--line)] pt-3 text-base text-[var(--ink)]"><strong>Total</strong><strong>{format(totalRwf)}</strong></div>
                  </div>
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--muted)]">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--gold-deep)]" />
                    No payment now. Your dates are held while the host reviews the request. You receive a reference immediately.
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

        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-[var(--line)] bg-white px-4 py-3 pb-[calc(.75rem+env(safe-area-inset-bottom,0px))] sm:px-5 sm:py-4">
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
              Send booking request
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
