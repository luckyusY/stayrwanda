"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronLeft, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/properties";

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

  function update(key: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e7f5ea] text-[#008234]">
          <Check size={32} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Booking request sent</h1>
        <p className="mt-3 text-[#595959]">
          Your request for <strong>{property.title}</strong> has been received. The host will confirm
          availability and the final rate shortly.
        </p>
        <p className="mx-auto mt-5 inline-block rounded-lg bg-[#f0f6ff] px-5 py-3 text-sm font-bold text-[#006ce4]">
          Reference: {reference}
        </p>
        <div className="mt-6">
          <Link href="/account/bookings" className="inline-block rounded bg-[#006ce4] px-5 py-3 font-bold text-white">
            View booking requests
          </Link>
        </div>
      </div>
    );
  }

  const stayNights = nights(form.checkIn, form.checkOut);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href={`/stays/${property.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#006ce4]">
        <ChevronLeft size={17} /> Back to property
      </Link>
      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <h1 className="text-3xl font-extrabold">Enter your details</h1>
          <p className="mt-2 text-[#595959]">Almost done! The host will confirm availability and the final rate.</p>

          <div className="mt-6 rounded-lg border border-[#ddd] p-5">
            <h2 className="text-xl font-bold">Your information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="First name" placeholder="First name" value={form.firstName} onChange={(v) => update("firstName", v)} />
              <Field label="Last name" placeholder="Last name" value={form.lastName} onChange={(v) => update("lastName", v)} />
              <Field label="Email address" placeholder="name@example.com" type="email" value={form.email} onChange={(v) => update("email", v)} />
              <Field label="Phone number" placeholder="+250" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-[#ddd] p-5">
            <h2 className="text-xl font-bold">Your stay</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="Check-in" type="date" value={form.checkIn} onChange={(v) => update("checkIn", v)} />
              <Field label="Check-out" type="date" value={form.checkOut} onChange={(v) => update("checkOut", v)} />
              <Field label="Guests" type="number" value={form.guests} onChange={(v) => update("guests", v)} />
            </div>
            <label className="mt-5 block text-sm font-bold">
              Special requests <span className="font-normal text-[#595959]">(optional)</span>
              <textarea
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                className="mt-2 min-h-28 w-full rounded border border-[#868686] p-3 text-sm font-normal outline-none focus:border-[#006ce4]"
                placeholder="Arrival time, accessibility needs or other requests"
              />
            </label>
          </div>

          <div className="mt-5 rounded-lg border border-[#ddd] p-5">
            <h2 className="text-xl font-bold">Important information</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><Check size={18} className="text-[#008234]" /> No payment is collected for this request.</li>
              <li className="flex gap-2"><Check size={18} className="text-[#008234]" /> The host confirms pricing and cancellation terms.</li>
              <li className="flex gap-2"><LockKeyhole size={18} className="text-[#008234]" /> Your contact details remain private.</li>
            </ul>
          </div>

          {error && <p className="mt-5 rounded-lg bg-[#fdeced] px-4 py-3 text-sm font-semibold text-[#c00]">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#006ce4] px-5 py-4 text-lg font-bold text-white hover:bg-[#0057b8] disabled:opacity-60 sm:w-auto"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? "Sending…" : "Send booking request"}
          </button>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-5">
          <div className="rounded-lg border border-[#ddd] p-4">
            <div className="flex gap-3">
              <div className="relative size-24 shrink-0 overflow-hidden rounded">
                <Image src={property.image} alt={property.title} fill className="object-cover" sizes="96px" />
              </div>
              <div>
                <span className="text-xs text-[#595959]">{property.type}</span>
                <h2 className="mt-1 font-bold">{property.title}</h2>
                <p className="mt-1 text-xs">{property.neighborhood}, Kigali</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-[#ddd] p-4">
            <h3 className="font-bold">Your booking details</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-[#595959]">Check-in</span>
                <strong className="mt-1 block">{prettyDate(form.checkIn)}</strong>
              </div>
              <div className="border-l pl-4">
                <span className="text-xs text-[#595959]">Check-out</span>
                <strong className="mt-1 block">{prettyDate(form.checkOut)}</strong>
              </div>
            </div>
            <p className="mt-4 border-t pt-4 text-sm">
              {stayNights > 0 ? `${stayNights} night${stayNights === 1 ? "" : "s"} · ` : ""}
              {form.guests || 2} guest{Number(form.guests) === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-lg border border-[#ddd] p-4">
            <h3 className="font-bold">Price</h3>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-sm">Property rate</span>
              <strong className="text-xl">To be confirmed</strong>
            </div>
            <p className="mt-3 text-xs text-[#595959]">The property will provide a complete price before you commit.</p>
          </div>
          <div className="rounded-lg bg-[#ebf3ff] p-4 text-sm">
            <p className="flex gap-2 font-bold"><ShieldCheck size={19} /> Safe booking request</p>
            <p className="mt-2 text-[#474747]">StayRwanda keeps the request clear and gives you a local support contact.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={type === "number" ? 1 : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded border border-[#868686] px-3 font-normal outline-none focus:border-[#006ce4]"
      />
    </label>
  );
}
