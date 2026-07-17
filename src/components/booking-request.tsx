"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/properties";
import { Button, ButtonLink } from "@/components/ui/button";
import { FloatingField } from "@/components/ui/field";
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

function nights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.round((end - start) / 86_400_000);
}

function prettyDate(value: string) {
  if (!value) return "Select a date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Select a date";
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function BookingRequest({ property }: { property: Property }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof Form) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit() {
    setError("");
    if (!form.firstName || !form.email || !form.checkIn || !form.checkOut) {
      setError("Please add your name, email and stay dates.");
      return;
    }
    if (nights(form.checkIn, form.checkOut) < 1) {
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
    if (res.ok && data.booking) {
      setReference(data.booking.reference);
      return;
    }
    setError(data.error || "We couldn't submit your request. Please try again.");
    setLoading(false);
  }

  if (reference) {
    return (
      <motion.div
        className="mx-auto max-w-2xl px-4 py-24 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--cream)] text-[var(--gold-deep)]">
          <Check size={32} />
        </span>
        <p className="eyebrow mt-6">Request received</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">Your booking request is sent</h1>
        <p className="mt-4 text-[var(--muted)]">
          Your request for <strong className="text-[var(--ink)]">{property.title}</strong> has been received.
          The host will confirm availability and the final rate shortly.
        </p>
        <p className="mx-auto mt-6 inline-block border border-[var(--line)] bg-[var(--cream)] px-6 py-3 text-sm font-semibold tracking-[0.14em] text-[var(--ink)]">
          Reference · {reference}
        </p>
        <div className="mt-8">
          <ButtonLink href="/account/bookings" size="lg" withArrow>
            View booking requests
          </ButtonLink>
        </div>
      </motion.div>
    );
  }

  const stayNights = nights(form.checkIn, form.checkOut);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href={`/stays/${property.slug}`}
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] hover:text-[var(--ink)]"
      >
        <ChevronLeft size={16} /> Back to property
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
        <section>
          <p className="eyebrow">Final step</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">Enter your details</h1>
          <p className="mt-3 text-[var(--muted)]">The host will confirm availability and the final rate.</p>

          <div className="surface-3d mt-8 p-6">
            <h2 className="font-serif text-xl font-semibold text-[var(--ink)]">Your information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FloatingField label="First name" value={form.firstName} onChange={update("firstName")} autoComplete="given-name" />
              <FloatingField label="Last name" value={form.lastName} onChange={update("lastName")} autoComplete="family-name" />
              <FloatingField label="Email address" type="email" value={form.email} onChange={update("email")} autoComplete="email" />
              <FloatingField label="Phone number" type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" />
            </div>
          </div>

          <div className="surface-3d mt-5 p-6">
            <h2 className="font-serif text-xl font-semibold text-[var(--ink)]">Your stay</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <FloatingField label="Check-in" type="date" value={form.checkIn} onChange={update("checkIn")} />
              <FloatingField label="Check-out" type="date" value={form.checkOut} onChange={update("checkOut")} />
              <FloatingField label="Guests" type="number" value={form.guests} onChange={update("guests")} />
            </div>
            <div className="mt-4">
              <FloatingField label="Special requests (optional)" value={form.message} onChange={update("message")} multiline />
            </div>
          </div>

          <div className="surface-3d mt-5 bg-[var(--cream)] p-6">
            <h2 className="font-serif text-xl font-semibold text-[var(--ink)]">Good to know</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-[var(--gold-deep)]" /> No payment is collected for this request.</li>
              <li className="flex gap-2"><Check size={18} className="shrink-0 text-[var(--gold-deep)]" /> The host confirms pricing and cancellation terms.</li>
              <li className="flex gap-2"><LockKeyhole size={18} className="shrink-0 text-[var(--gold-deep)]" /> Your contact details remain private.</li>
            </ul>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 border border-[#e3b4ae] bg-[#fbf0ee] px-4 py-3 text-sm font-medium text-[#b4453a]"
            >
              {error}
            </motion.p>
          )}

          <Button onClick={submit} loading={loading} size="lg" withArrow className="mt-6">
            {loading ? "Sending…" : "Send booking request"}
          </Button>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-28">
          <div className="surface-3d surface-3d-lift p-4">
            <div className="flex gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden">
                <Image src={property.image} alt={property.title} fill className="object-cover" sizes="96px" />
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">{property.type}</span>
                <h2 className="mt-1 font-serif text-lg font-semibold text-[var(--ink)]">{property.title}</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">{property.neighborhood}, Kigali</p>
              </div>
            </div>
          </div>

          <div className="surface-3d p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">Your booking</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">Check-in</span>
                <strong className="mt-1 block font-medium text-[var(--ink)]">{prettyDate(form.checkIn)}</strong>
              </div>
              <div className="border-l border-[var(--line)] pl-4">
                <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]">Check-out</span>
                <strong className="mt-1 block font-medium text-[var(--ink)]">{prettyDate(form.checkOut)}</strong>
              </div>
            </div>
            <p className="mt-4 border-t border-[var(--line)] pt-4 text-sm text-[var(--muted)]">
              {stayNights > 0 ? `${stayNights} night${stayNights === 1 ? "" : "s"} · ` : ""}
              {form.guests || 2} guest{Number(form.guests) === 1 ? "" : "s"}
            </p>
          </div>

          <div className="surface-3d p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">Price</h3>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-sm text-[var(--muted)]">Property rate</span>
              <strong className="font-serif text-xl text-[var(--ink)]">On request</strong>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              The property will provide a complete price before you commit.
            </p>
          </div>

          <div className="surface-3d bg-[var(--cream)] p-5 text-sm">
            <p className="flex items-center gap-2 font-semibold text-[var(--ink)]">
              <ShieldCheck size={19} className="text-[var(--gold-deep)]" /> Safe booking request
            </p>
            <p className="mt-2 text-[var(--muted)]">
              StayRwanda keeps the request clear and gives you a local support contact.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
