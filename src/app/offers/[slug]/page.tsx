import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { offers } from "@/lib/editorial";

export function generateStaticParams() { return offers.map(({ slug }) => ({ slug })); }

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = offers.find((item) => item.slug === slug);
  if (!offer) notFound();
  return (
    <main>
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <p className="eyebrow">{offer.badge}</p>
        <h1 className="mt-4 font-serif text-6xl font-semibold text-[var(--ink)]">{offer.title}</h1>
        <p className="mt-8 text-xl leading-9 text-[var(--muted)]">{offer.copy}</p>
        <div className="surface-3d mt-10 bg-[var(--cream)] p-6 text-sm leading-7 text-[var(--muted)]">
          <strong className="block text-[var(--ink)]">How it works</strong>
          Select a participating property and send a booking request. The host confirms availability, eligibility and the complete price before you commit. Offers cannot be combined unless the property says otherwise.
        </div>
        <Link href="/stays" className="button-3d mt-8 inline-block bg-[var(--ink)] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white">Find a participating stay</Link>
      </article>
      <SiteFooter />
    </main>
  );
}
