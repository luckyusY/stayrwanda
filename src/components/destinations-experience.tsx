"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { TiltCard } from "@/components/tilt-card";
import { Reveal, RevealGroup } from "@/components/reveal";
import { SmartImage } from "@/components/smart-image";

type DestinationItem = {
  slug: string;
  name: string;
  kicker: string;
  copy: string;
  image?: string;
};

export function DestinationsExperience({
  destinations,
  properties,
}: {
  destinations: DestinationItem[];
  properties: any[];
}) {
  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      <SiteHeader />
      
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="eyebrow">The land of a thousand hills</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl font-light text-[var(--ink)] leading-tight">
            Where will <span className="italic text-gradient-gold font-normal">Rwanda</span> take you?
          </h1>
          <p className="mt-4 text-[var(--muted)] text-sm sm:text-base leading-relaxed">
            From the creative neighborhoods of Kigali to peaceful residential pockets, discover stay locations across the country.
          </p>
        </div>

        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {destinations.map((item, index) => {
            const correspondingProperty = properties?.length
              ? properties.find((p) => {
                  const neigh = p.location?.neighborhood?.toLowerCase() || "";
                  const city = p.location?.city?.toLowerCase() || "";
                  const matchName = item.name.toLowerCase();
                  return neigh.includes(matchName) || city.includes(matchName);
                }) ?? properties[index % properties.length]
              : null;

            const displayImage = correspondingProperty?.heroImage;

            return (
              <Reveal key={item.slug} variant="depth" as="div">
                <TiltCard strength={6} className="h-full">
                  <div className="surface-3d surface-3d-lift h-full overflow-hidden flex flex-col justify-between bg-white rounded-xl shadow-sm border border-[var(--line)] group">
                    <div className="relative h-60 w-full overflow-hidden bg-[var(--cream)]">
                      {displayImage ? (
                        <SmartImage
                          src={displayImage}
                          alt={item.name}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--cream)] flex items-center justify-center text-[var(--gold-deep)] text-xs uppercase tracking-wider font-semibold">
                          StayRwanda
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <span className="absolute left-4 top-4 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--ink)] rounded shadow-sm">
                        {item.kicker}
                      </span>
                      <h2 className="absolute bottom-4 left-5 font-serif text-3xl font-semibold text-white">
                        {item.name}
                      </h2>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <p className="text-sm leading-relaxed text-[var(--muted)] mb-6">
                        {item.copy}
                      </p>
                      <Link
                        href={`/destinations/${item.slug}`}
                        className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] hover:text-[var(--ink)] transition-colors mt-auto"
                        data-cursor="explore"
                      >
                        Explore stays <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </RevealGroup>
      </section>

      {/* Neighbourhood Stats Ticker */}
      <section className="bg-[var(--ink)] py-8 overflow-hidden border-y border-white/10 select-none">
        <div className="ticker-track">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center text-sm font-serif italic text-[var(--gold-pale)]">
              {destinations.map((d) => (
                <span key={d.slug} className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-[var(--gold)]" />
                  <span>{d.name} · {d.kicker}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
