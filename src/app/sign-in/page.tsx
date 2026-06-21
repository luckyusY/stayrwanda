"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ButtonLink } from "@/components/ui/button";
import { FloatingField } from "@/components/ui/field";
import { EASE } from "@/lib/motion";

export default function SignInPage() {
  const [email, setEmail] = useState("");

  return (
    <main className="bg-white">
      <SiteHeader />
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">Sign in</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Access your saved residences and follow your booking requests.
          </p>

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FloatingField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              icon={<Mail size={18} />}
            />
            <ButtonLink href="/account" fullWidth size="lg" withArrow>
              Continue with email
            </ButtonLink>
          </form>

          <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            <span className="h-px flex-1 bg-[var(--line)]" />
            or
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Google", "Facebook", "Apple"].map((provider) => (
              <button
                key={provider}
                className="border border-[var(--line)] py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-deep)]"
              >
                {provider[0]}
              </button>
            ))}
          </div>

          <p className="mt-8 border-t border-[var(--line)] pt-6 text-center text-xs leading-5 text-[var(--muted)]">
            By signing in, you agree to our Terms and Privacy Statement.
          </p>
          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            New here?{" "}
            <Link href="/register" className="font-semibold text-[var(--gold-deep)] hover:text-[var(--ink)]">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
      <SiteFooter />
    </main>
  );
}
