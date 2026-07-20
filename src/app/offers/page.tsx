import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { offers } from "@/lib/editorial";
import { FlipCard } from "@/components/flip-card";
import { Reveal, RevealGroup } from "@/components/reveal";

export const metadata = { title: "Offers" };

export default function OffersPage() {
  return (
    <main className="bg-[var(--parchment)] min-h-screen">
      <SiteHeader />
      
      <section className="relative overflow-hidden bg-[var(--ink)] px-4 py-14 text-center text-white sm:py-20">
        {/* Decorative backdrop */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px"
        }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <Tag className="mx-auto text-[var(--gold)] size-8" />
          <p className="eyebrow mt-4 !text-[var(--gold)]">Seasonal value</p>
          <h1 className="mt-3 font-serif text-4xl font-light leading-tight sm:text-6xl">
            Offers <span className="italic text-gradient-gold font-normal">worth staying</span> for
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/70 text-sm sm:text-base leading-relaxed">
            Curated plans to stay longer and experience more, confirmed directly with participating properties.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <RevealGroup className="grid gap-6 sm:grid-cols-3">
          {offers.map((offer) => {
            const front = (
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[.18em] text-[var(--gold-deep)] bg-[var(--parchment)] px-2.5 py-1 rounded font-semibold border border-[var(--line)]">
                    {offer.badge}
                  </span>
                  <h2 className="mt-6 font-serif text-3xl font-semibold text-[var(--ink)] leading-snug">
                    {offer.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                    {offer.copy}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] group-hover:text-[var(--ink)] transition-colors">
                  Hover to flip <ArrowRight size={13} />
                </span>
              </div>
            );

            const back = (
              <div className="p-8 h-full flex flex-col justify-between bg-[var(--ink)] text-white select-none">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--gold)] font-bold">
                    Offer details
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-semibold leading-snug">
                    What is included
                  </h3>
                  <ul className="mt-5 space-y-3 text-xs text-white/80">
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-[var(--gold)]" />
                      Direct confirmation with host
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-[var(--gold)]" />
                      Dedicated local host support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1 rounded-full bg-[var(--gold)]" />
                      Complimentary request submission
                    </li>
                  </ul>
                </div>
                <Link
                  href={`/offers/${offer.slug}`}
                  className="button-3d block text-center bg-[var(--gold)] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-gold"
                  data-cursor="explore"
                >
                  View details
                </Link>
              </div>
            );

            return (
              <Reveal key={offer.slug} variant="depth" as="div">
                <FlipCard
                  front={front}
                  back={back}
                  className="h-96 w-full cursor-pointer"
                />
              </Reveal>
            );
          })}
        </RevealGroup>
      </section>

      <SiteFooter />
    </main>
  );
}
