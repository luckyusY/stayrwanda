"use client";

import Link from "next/link";
import { AlertCircle, RotateCw } from "lucide-react";

export default function SearchError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[70dvh] place-items-center bg-[var(--parchment)] px-4 py-16">
      <section className="surface-3d-floating w-full max-w-md bg-white p-6 text-center sm:p-10">
        <AlertCircle className="mx-auto text-[var(--gold-deep)]" size={38} />
        <h1 className="mt-4 font-serif text-3xl font-semibold text-[var(--ink)]">Stays are taking longer than expected</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Try once more or browse the complete StayRwanda collection.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={reset} className="button-3d flex min-h-12 items-center justify-center gap-2 bg-[var(--ink)] px-5 text-xs font-semibold uppercase tracking-wider text-white"><RotateCw size={15} /> Retry</button><Link href="/stays" className="interactive-3d flex min-h-12 items-center justify-center px-5 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">Browse all stays</Link></div>
      </section>
    </main>
  );
}
