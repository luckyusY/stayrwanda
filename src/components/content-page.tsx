import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export function ContentPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: Array<{ title: string; body: string }> }) {
  return (
    <main>
      <SiteHeader />
      <article className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-6xl font-semibold text-[var(--ink)]">{title}</h1>
        <p className="mt-6 text-xl leading-9 text-[var(--muted)]">{intro}</p>
        <div className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {sections.map((section) => (
            <section className="py-8" key={section.title}>
              <h2 className="font-serif text-3xl font-semibold text-[var(--ink)]">{section.title}</h2>
              <p className="mt-4 leading-8 text-[var(--muted)]">{section.body}</p>
            </section>
          ))}
        </div>
        <Link href="/contact" className="button-3d mt-9 inline-block bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white">Contact StayRwanda</Link>
      </article>
      <SiteFooter />
    </main>
  );
}
