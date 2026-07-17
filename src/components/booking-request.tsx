"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, LockKeyhole, Mail, Send, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/properties";
import { Button, ButtonLink } from "@/components/ui/button";
import { FloatingField } from "@/components/ui/field";
import { EASE, softSpring } from "@/lib/motion";

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
  if (!value) return "Select date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Select date";
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

  const stayNights = nights(form.checkIn, form.checkOut);

  if (reference) {
    return (
      <main className="min-h-screen bg-[var(--parchment)] flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-lg bg-white rounded-xl border border-[var(--line)] p-8 text-center shadow-xl form-card-3d"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Animated paper airplane flying out from envelope */}
          <div className="relative mx-auto size-20 flex items-center justify-center rounded-full bg-[var(--parchment)] text-[var(--gold-deep)] overflow-hidden">
            <motion.div
              initial={{ x: -40, y: 40, opacity: 0 }}
              animate={{ x: 40, y: -40, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute text-[var(--gold)]"
            >
              <Send size={24} />
            </motion.div>
            <Mail size={32} className="relative z-10 text-[var(--ink)]" />
          </div>

          <p className="eyebrow mt-6">Request received</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">Your booking request is sent</h1>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Your request for <strong className="text-[var(--ink)]">{property.title}</strong> has been received.
            The host will review details and confirm availability shortly.
          </p>
          
          <div className="mx-auto mt-6 inline-block rounded border border-[var(--line)] bg-[var(--parchment)] px-6 py-3 text-sm font-semibold tracking-[0.14em] text-[var(--ink)]">
            Reference: <span className="font-mono text-[var(--gold-deep)]">{reference}</span>
          </div>

          <div className="mt-8 border-t border-[var(--line)] pt-6 flex justify-center">
            <ButtonLink href="/account/bookings" size="lg" withArrow>
              View requests
            </ButtonLink>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--parchment)] flex flex-col justify-between">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 flex flex-col">
        <Link
          href={`/stays/${property.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] hover:text-[var(--ink)] transition-colors"
        >
          <ChevronLeft size={16} /> Back to property
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] flex-1">
          {/* Left Visual Stay Info panel */}
          <aside className="relative rounded-xl overflow-hidden min-h-[300px] lg:min-h-0 flex flex-col justify-end shadow-md">
            <Image
              src={property.image}
              alt={property.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-black/30 to-transparent" />
            
            <div className="relative z-10 p-6 sm:p-8 text-white glass-ink border border-white/10 m-4 rounded-xl">
              <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--gold-pale)]">{property.type}</span>
              <h2 className="mt-2 font-display text-3xl font-light text-white leading-tight">{property.title}</h2>
              <p className="mt-1.5 text-xs text-white/80">{property.neighborhood}, Kigali</p>
              
              <div className="mt-5 border-t border-white/10 pt-4 flex gap-6 text-sm">
                <div>
                  <span className="text-[0.6rem] uppercase tracking-[0.14em] text-white/50 block">Check-in</span>
                  <strong className="mt-1 block font-medium text-white">{prettyDate(form.checkIn)}</strong>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <span className="text-[0.6rem] uppercase tracking-[0.14em] text-white/50 block">Check-out</span>
                  <strong className="mt-1 block font-medium text-white">{prettyDate(form.checkOut)}</strong>
                </div>
              </div>
              
              <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/70">
                {stayNights > 0 ? `${stayNights} night${stayNights === 1 ? "" : "s"} · ` : ""}
                {form.guests || 2} guest{Number(form.guests) === 1 ? "" : "s"}
              </p>
            </div>
          </aside>

          {/* Right Form panel in form-card-3d */}
          <section className="bg-white rounded-xl border border-[var(--line)] shadow-lg p-6 sm:p-8 flex flex-col justify-between form-card-3d">
            <div>
              <p className="eyebrow">Final step</p>
              <h1 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">Enter your details</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">The host will review details and confirm availability.</p>

              <div className="mt-6 space-y-4">
                <h2 className="font-serif text-lg font-semibold text-[var(--ink)]">Your information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatingField label="First name" value={form.firstName} onChange={update("firstName")} autoComplete="given-name" />
                  <FloatingField label="Last name" value={form.lastName} onChange={update("lastName")} autoComplete="family-name" />
                  <FloatingField label="Email address" type="email" value={form.email} onChange={update("email")} autoComplete="email" />
                  <FloatingField label="Phone number" type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h2 className="font-serif text-lg font-semibold text-[var(--ink)]">Your stay</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <FloatingField label="Check-in" type="date" value={form.checkIn} onChange={update("checkIn")} />
                  <FloatingField label="Check-out" type="date" value={form.checkOut} onChange={update("checkOut")} />
                  <FloatingField label="Guests" type="number" value={form.guests} onChange={update("guests")} />
                </div>
                <div className="mt-4">
                  <FloatingField label="Special requests (optional)" value={form.message} onChange={update("message")} multiline />
                </div>
              </div>

              <div className="mt-6 bg-[var(--parchment)] p-5 rounded-lg border border-[var(--line)]">
                <h3 className="font-serif text-base font-semibold text-[var(--ink)]">Good to know</h3>
                <ul className="mt-3 space-y-2.5 text-xs text-[var(--muted)]">
                  <li className="flex gap-2"><Check size={16} className="shrink-0 text-[var(--rwanda-green)]" /> No payment is collected for this request.</li>
                  <li className="flex gap-2"><Check size={16} className="shrink-0 text-[var(--rwanda-green)]" /> The host confirms pricing and cancellation terms.</li>
                  <li className="flex gap-2"><LockKeyhole size={16} className="shrink-0 text-[var(--gold-deep)]" /> Your contact details remain private.</li>
                </ul>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 border border-[#e3b4ae] bg-[#fbf0ee] px-4 py-3 text-xs font-medium text-[#b4453a] rounded-md"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div className="mt-6 border-t border-[var(--line)] pt-5">
              <Button onClick={submit} loading={loading} size="lg" withArrow className="w-full sm:w-auto">
                {loading ? "Sending request…" : "Send booking request"}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
