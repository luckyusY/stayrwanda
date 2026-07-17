"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  Home,
  Mail,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import type { Property } from "@/lib/properties";
import { Button, ButtonLink } from "@/components/ui/button";
import { FloatingField } from "@/components/ui/field";
import { Popout } from "@/components/popout";
import { EASE } from "@/lib/motion";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message: string;
};

const EMPTY: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  checkIn: "",
  checkOut: "",
  guests: "2",
  message: "",
};

const STEPS = [
  { id: "dates", label: "Dates" },
  { id: "guests", label: "Guests" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
] as const;

type StepId = (typeof STEPS)[number]["id"] | "success";

function nights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.round((end - start) / 86_400_000);
}

function prettyDate(value: string) {
  if (!value) return "Add date";
  const date = new Date(value + (value.includes("T") ? "" : "T00:00:00"));
  if (Number.isNaN(date.getTime())) return "Add date";
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function BookingWizard({
  property,
  open,
  onClose,
  mode = "dialog",
}: {
  property: Property;
  open?: boolean;
  onClose?: () => void;
  mode?: "dialog" | "page";
}) {
  const [step, setStep] = useState<StepId>("dates");
  const [form, setForm] = useState<Form>(EMPTY);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const stayNights = useMemo(() => nights(form.checkIn, form.checkOut), [form.checkIn, form.checkOut]);
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const update = (key: keyof Form) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  function validateCurrent(): string | null {
    if (step === "dates") {
      if (!form.checkIn || !form.checkOut) return "Please choose check-in and check-out dates.";
      if (stayNights < 1) return "Check-out must be after check-in.";
    }
    if (step === "guests") {
      if (Number(form.guests) < 1) return "At least one guest is required.";
    }
    if (step === "details") {
      if (!form.firstName.trim() || !form.email.trim()) return "Please add your name and email.";
    }
    return null;
  }

  function goNext() {
    const err = validateCurrent();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (step === "dates") setStep("guests");
    else if (step === "guests") setStep("details");
    else if (step === "details") setStep("review");
  }

  function goBack() {
    setError("");
    if (step === "guests") setStep("dates");
    else if (step === "details") setStep("guests");
    else if (step === "review") setStep("details");
  }

  async function submit() {
    setError("");
    if (!form.firstName || !form.email || !form.checkIn || !form.checkOut) {
      setError("Please add your name, email and stay dates.");
      return;
    }
    if (stayNights < 1) {
      setError("Check-out must be after check-in.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertySlug: property.slug,
        propertyTitle: property.title,
        guestName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests) || 1,
        message: form.message,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok && data.booking) {
      setReference(data.booking.reference);
      setStep("success");
      return;
    }
    setError(data.error || "We couldn't submit your request. Please try again.");
  }

  const progress = step === "success" ? 100 : ((stepIndex + 1) / STEPS.length) * 100;

  const body = (
    <div className={mode === "page" ? "mx-auto w-full max-w-2xl" : ""}>
      {/* Property chip */}
      <div className="flex gap-3 border-b border-[var(--line)] bg-[var(--parchment)]/50 px-5 py-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-[var(--cream)]">
          <Image src={property.image} alt={property.title} fill className="object-cover" sizes="64px" />
        </div>
        <div className="min-w-0">
          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--gold-deep)]">{property.type}</p>
          <h3 className="truncate font-serif text-lg font-semibold text-[var(--ink)]">{property.title}</h3>
          <p className="text-xs text-[var(--muted)]">
            {property.neighborhood}
            {stayNights > 0 ? ` · ${stayNights} night${stayNights === 1 ? "" : "s"}` : ""}
          </p>
        </div>
      </div>

      {/* Progress */}
      {step !== "success" && (
        <div className="px-5 pt-4">
          <div className="mb-3 flex justify-between gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-[10px] font-bold ${
                    i <= stepIndex
                      ? "bg-[var(--ink)] text-white"
                      : "bg-[var(--cream)] text-[var(--muted)]"
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
      )}

      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {step === "dates" && (
              <div className="space-y-4">
                <p className="font-serif text-xl text-[var(--ink)]">When would you like to stay?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Check-in
                    </span>
                    <span className="search-field-well block px-3 py-2.5">
                      <input
                        type="date"
                        value={form.checkIn}
                        onChange={(e) => update("checkIn")(e.target.value)}
                        className="search-field-input"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Check-out
                    </span>
                    <span className="search-field-well block px-3 py-2.5">
                      <input
                        type="date"
                        value={form.checkOut}
                        onChange={(e) => update("checkOut")(e.target.value)}
                        className="search-field-input"
                      />
                    </span>
                  </label>
                </div>
                {stayNights > 0 && (
                  <p className="text-sm text-[var(--muted)]">
                    {stayNights} night{stayNights === 1 ? "" : "s"} · {prettyDate(form.checkIn)} →{" "}
                    {prettyDate(form.checkOut)}
                  </p>
                )}
              </div>
            )}

            {step === "guests" && (
              <div className="space-y-4">
                <p className="font-serif text-xl text-[var(--ink)]">How many guests?</p>
                <div className="search-field-well flex items-center justify-between px-4 py-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                    <Users size={18} className="text-[var(--gold-deep)]" /> Guests
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, guests: String(Math.max(1, Number(p.guests) - 1)) }))
                      }
                      className="interactive-3d grid size-9 place-items-center"
                      aria-label="Decrease guests"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[2ch] text-center font-serif text-2xl font-semibold text-[var(--ink)]">
                      {form.guests}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, guests: String(Math.min(20, Number(p.guests) + 1)) }))
                      }
                      className="interactive-3d grid size-9 place-items-center"
                      aria-label="Increase guests"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "details" && (
              <div className="space-y-4">
                <p className="font-serif text-xl text-[var(--ink)]">Your details</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FloatingField label="First name" value={form.firstName} onChange={update("firstName")} />
                  <FloatingField label="Last name" value={form.lastName} onChange={update("lastName")} />
                </div>
                <FloatingField label="Email" type="email" value={form.email} onChange={update("email")} />
                <FloatingField label="Phone (optional)" type="tel" value={form.phone} onChange={update("phone")} />
                <FloatingField
                  label="Message to host (optional)"
                  value={form.message}
                  onChange={update("message")}
                  multiline
                />
              </div>
            )}

            {step === "review" && (
              <div className="space-y-4">
                <p className="font-serif text-xl text-[var(--ink)]">Review your request</p>
                <dl className="divide-y divide-[var(--line)] rounded-xl border border-[var(--line)] bg-white">
                  {[
                    ["Stay", property.title],
                    ["Check-in", prettyDate(form.checkIn)],
                    ["Check-out", prettyDate(form.checkOut)],
                    ["Guests", form.guests],
                    ["Name", `${form.firstName} ${form.lastName}`.trim()],
                    ["Email", form.email],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                      <dt className="text-[var(--muted)]">{k}</dt>
                      <dd className="text-right font-medium text-[var(--ink)]">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-xs leading-relaxed text-[var(--muted)]">
                  No payment is collected now. Dates are soft-held while the host reviews your request
                  (usually within 24 hours).
                </p>
              </div>
            )}

            {step === "success" && reference && (
              <div className="text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full border border-[var(--rwanda-green)]/30 bg-white text-[var(--rwanda-green)] shadow-sm">
                  <CheckCircle2 size={32} />
                </div>
                <p className="eyebrow mt-5 text-[var(--rwanda-green)]">Request received</p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-[var(--ink)]">
                  Your request is confirmed
                </h3>
                <div className="mx-auto mt-4 inline-block rounded-full border border-[var(--gold)] bg-[var(--gold-pale)] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold-deep)]">
                  Reference: <span className="ml-1 font-mono">{reference}</span>
                </div>
                <div className="mt-6 space-y-0 text-left">
                  {[
                    { icon: Mail, text: "Confirmation sent to your email" },
                    { icon: Clock, text: "Host reviews within 24 hours" },
                    { icon: CalendarCheck, text: "Dates are soft-held" },
                    { icon: CreditCard, text: "No payment collected yet" },
                  ].map((item) => (
                    <div key={item.text} className="confirm-step">
                      <div className="confirm-step-icon">
                        <item.icon size={18} />
                      </div>
                      <div className="pt-2">
                        <span className="text-sm font-medium text-[var(--ink)]">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <ButtonLink href="/account/bookings" variant="outline" fullWidth>
                    <ClipboardList size={16} /> Track booking
                  </ButtonLink>
                  <ButtonLink href="/" variant="primary" fullWidth>
                    <Home size={16} /> Back to stays
                  </ButtonLink>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="surface-3d-error mt-4 rounded-[var(--radius-control)] border px-3 py-2.5 text-sm text-[#b4453a]">
            {error}
          </p>
        )}
      </div>

      {step !== "success" && (
        <div className="flex items-center justify-between gap-3 border-t border-[var(--line)] px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={step === "dates" ? onClose : goBack}
            disabled={loading}
          >
            {step === "dates" ? (mode === "dialog" ? "Cancel" : "Close") : "Back"}
          </Button>
          {step === "review" ? (
            <Button type="button" variant="primary" loading={loading} onClick={submit}>
              Submit request
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={goNext}>
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (mode === "page") {
    return (
      <main className="min-h-screen bg-[var(--parchment)] py-8 sm:py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Link
            href={`/hotels/${property.slug}`}
            className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] hover:text-[var(--ink)]"
          >
            ← Back to property
          </Link>
          <div className="surface-3d-floating overflow-hidden bg-white">
            <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--parchment)] px-5 py-3.5">
              <Image
                src="/brand/stayrwanda-logo.png"
                alt="StayRwanda"
                width={1093}
                height={607}
                className="h-8 w-auto object-contain"
              />
              <h1 className="font-serif text-lg font-semibold text-[var(--ink)]">Request to book</h1>
            </div>
            {body}
          </div>
        </div>
      </main>
    );
  }

  return (
    <Popout
      variant="dialog"
      isOpen={open}
      onClose={onClose}
      title="Request to book"
      showLogo
      className="w-[95vw] max-w-xl rounded-2xl bg-white shadow-2xl"
      hideHeader={false}
    >
      {body}
    </Popout>
  );
}
