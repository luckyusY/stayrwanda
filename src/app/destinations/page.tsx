import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { destinations } from "@/lib/editorial";

export const metadata = { title: "Destinations" };

export default function DestinationsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="eyebrow">The land of a thousand hills</p>
        <h1 className="mt-3 font-serif text-6xl font-semibold text-[var(--ink)]">Where will Rwanda take you?</h1>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {destinations.map((item) => (
            <Link href={`/destinations/${item.slug}`} key={item.slug} className="surface-3d surface-3d-lift group p-8">
              <span className="text-xs uppercase tracking-[.16em] text-[var(--gold-deep)]">{item.kicker}</span>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">{item.name}</h2>
              <p className="mt-4 leading-7 text-[var(--muted)]">{item.copy}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)]">Explore <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
