"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ButtonLink } from "@/components/ui/button";
import { FloatingField } from "@/components/ui/field";
import { EASE } from "@/lib/motion";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <main className="bg-white">
      <SiteHeader />
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="eyebrow">Join StayRwanda</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">Create your account</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            One account across every StayRwanda booking and saved residence.
          </p>

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingField label="First name" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" />
              <FloatingField label="Last name" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
            </div>
            <FloatingField label="Email address" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
            <FloatingField label="Phone number" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
            <FloatingField label="Create password" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />

            <label className="flex items-start gap-3 pt-1 text-sm text-[var(--muted)]">
              <input type="checkbox" className="mt-0.5 size-4 accent-[var(--gold)]" />
              Send me members-only offers and travel inspiration.
            </label>

            <ButtonLink href="/account" fullWidth size="lg" withArrow className="mt-2">
              Create account
            </ButtonLink>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already registered?{" "}
            <Link href="/sign-in" className="font-semibold text-[var(--gold-deep)] hover:text-[var(--ink)]">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
      <SiteFooter />
    </main>
  );
}
