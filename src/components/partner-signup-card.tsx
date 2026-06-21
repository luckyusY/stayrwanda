"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { FloatingField } from "@/components/ui/field";

export function PartnerSignupCard() {
  const [form, setForm] = useState({ property: "", email: "", phone: "" });
  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="border border-[var(--line)] bg-white p-7 text-[var(--foreground)] soft-shadow">
      <p className="eyebrow">Become a host</p>
      <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--ink)]">Get started</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">Create a partner account to begin.</p>
      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FloatingField label="Property name" value={form.property} onChange={set("property")} />
        <FloatingField label="Email address" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
        <FloatingField label="Phone number" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
        <ButtonLink href="/account" fullWidth size="lg" withArrow>
          Continue
        </ButtonLink>
      </form>
    </div>
  );
}
