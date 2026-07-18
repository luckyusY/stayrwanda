"use client";

import Link from "next/link";

export default function AccountError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-[var(--parchment)] p-6 text-center">
      <div className="surface-3d max-w-md rounded-xl bg-white p-8 shadow-md">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 font-serif text-3xl text-[var(--ink)]">We could not load your account page</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          This is often caused by missing authentication or database configuration on the deployment.
          Try again, or return home.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="button-3d bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="button-3d border border-[var(--line)] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
