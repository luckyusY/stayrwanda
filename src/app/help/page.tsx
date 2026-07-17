import Link from "next/link";
import { CalendarX, CircleHelp, CreditCard, House, MessageCircle, Search, ShieldCheck, UserRound } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function HelpPage() {
  const topics = [
    [CalendarX, "Cancellations"],
    [CreditCard, "Payments"],
    [House, "Property information"],
    [UserRound, "Account"],
    [ShieldCheck, "Safety"],
    [MessageCircle, "Contact support"],
  ] as const;

  return (
    <main>
      <SiteHeader />
      <section className="bg-[var(--ink)] py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <CircleHelp className="mx-auto text-[var(--gold-mid)]" size={36} />
          <h1 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">How can we help?</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
            Browse topics or search for guidance on bookings, stays and your StayRwanda account.
          </p>
          <div className="surface-3d-floating mx-auto mt-7 flex max-w-2xl items-center gap-3 px-4 text-[var(--ink)]">
            <Search className="text-[var(--gold-deep)]" size={20} />
            <input
              className="search-field-input min-h-14 flex-1"
              placeholder="Search help topics…"
            />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">Help topics</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map(([Icon, label]) => (
            <button
              key={label}
              className="surface-3d surface-3d-lift flex items-center gap-4 p-5 text-left hover:border-[var(--gold)]"
            >
              <span className="icon-halo !size-11">
                <Icon size={20} className="text-[var(--gold-deep)]" />
              </span>
              <span className="font-semibold text-[var(--ink)]">{label}</span>
            </button>
          ))}
        </div>
        <div className="surface-3d mt-12 bg-[var(--gold-pale)] p-8 text-center">
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">Still need help?</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in to contact our Rwanda-based support team about a booking or property.
          </p>
          <Link
            href="/sign-in"
            className="button-3d mt-5 inline-block bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[var(--ink-2)]"
          >
            Sign in for support
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
