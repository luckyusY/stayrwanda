import { BarChart3, CalendarCheck, Check, CircleDollarSign, HousePlus, ShieldCheck, Users } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { PartnerSignupCard } from "@/components/partner-signup-card";
import { Reveal } from "@/components/reveal";

export const metadata = { title: "List your property" };

const features = [
  [HousePlus, "Easy listing", "Add property details and upload complete galleries."],
  [CalendarCheck, "Calendar control", "Choose exactly when guests can request."],
  [CircleDollarSign, "Flexible rates", "Set nightly, weekly or monthly pricing."],
  [ShieldCheck, "Trusted requests", "Review guest details before confirming."],
] as const;

const assurances = [
  [Users, "Reach local and international guests"],
  [BarChart3, "Track views and booking requests"],
  [ShieldCheck, "Get Rwanda-based host support"],
] as const;

export default function ListPropertyPage() {
  return (
    <main className="bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[var(--ink)] py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_440px]">
          <div>
            <p className="eyebrow !text-[var(--gold)]">Partner with StayRwanda</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05]">
              List your property,
              <br /> host with confidence
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Reach guests searching for trusted furnished stays across Rwanda.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Local support from listing to checkout",
                "You control availability and house rules",
                "No charge to start your listing",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <Check size={18} className="text-[var(--gold)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <PartnerSignupCard />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="text-center">
          <p className="eyebrow">Everything you need</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">Built for effortless hosting</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, title, copy]) => {
            const C = Icon as typeof HousePlus;
            return (
              <Reveal key={title} className="lift border border-[var(--line)] bg-white p-6">
                <span className="grid size-12 place-items-center rounded-full border border-[var(--gold)]/40 text-[var(--gold-deep)]">
                  <C size={22} />
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 border border-[var(--line)] bg-[var(--cream)] p-10 md:grid-cols-3">
          {assurances.map(([Icon, label]) => {
            const C = Icon as typeof Users;
            return (
              <div key={label} className="flex items-center gap-4">
                <C className="shrink-0 text-[var(--gold-deep)]" />
                <strong className="font-medium text-[var(--ink)]">{label}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
