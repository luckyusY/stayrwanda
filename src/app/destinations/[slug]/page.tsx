import { notFound } from "next/navigation";
import { HotelCard } from "@/components/hotel-card";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { destinations } from "@/lib/editorial";
import { listPublishedHotels } from "@/lib/platform-data";
import { Reveal, RevealGroup } from "@/components/reveal";
import { MapPin } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return destinations.map(({ slug }) => ({ slug }));
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);
  if (!destination) notFound();
  
  const all = await listPublishedHotels();
  const hotels = all.filter((hotel) =>
    `${hotel.location.city} ${hotel.location.neighborhood}`.toLowerCase().includes(destination.name.toLowerCase())
  );

  const averagePrice = hotels.length
    ? Math.round(hotels.reduce((sum, h) => sum + (h.id.startsWith("seed-") ? 85000 : 95000), 0) / hotels.length)
    : 0;

  return (
    <main className="bg-[var(--parchment)] min-h-screen">
      <SiteHeader />
      
      {/* Cinematic Hero */}
      <section className="relative bg-[var(--ink)] py-24 text-center text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: "repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)",
          backgroundSize: "15px 15px"
        }} />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <p className="eyebrow !text-[var(--gold)]">{destination.kicker}</p>
          <h1 className="mt-6 font-display text-5xl sm:text-7xl md:text-8xl font-light leading-none tracking-tight">
            <span className="block">{destination.name}</span>
            <span className="block text-gradient-gold italic mt-2">Kigali, Rwanda</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-white/70 text-sm sm:text-base leading-relaxed">
            {destination.copy}
          </p>

          {/* Stats Bar */}
          <div className="mx-auto mt-10 max-w-lg border-t border-white/10 pt-6 grid grid-cols-2 divide-x divide-white/10">
            <div>
              <strong className="block text-3xl font-serif text-[var(--gold-pale)]">{hotels.length}</strong>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block mt-1">Available properties</span>
            </div>
            <div>
              <strong className="block text-3xl font-serif text-[var(--gold-pale)]">
                {averagePrice ? `RWF ${averagePrice.toLocaleString()}` : "On request"}
              </strong>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block mt-1">Average rate / night</span>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="eyebrow">Places to stay</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl sm:text-5xl font-semibold text-[var(--ink)]">
          Stay in {destination.name}
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-[var(--muted)] text-sm">
          Verified profiles with complete galleries, active calendars, and local support.
        </p>

        {/* Masonry-Style Layout Grid */}
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Reveal key={hotel.id} variant="depth" as="div">
              <HotelCard hotel={hotel} />
            </Reveal>
          ))}
        </RevealGroup>

        {!hotels.length && (
          <div className="surface-3d mt-12 bg-white p-12 text-center rounded-xl border border-[var(--line)] max-w-md mx-auto">
            <MapPin className="mx-auto text-[var(--gold-deep)] size-8" />
            <h2 className="mt-4 font-serif text-2xl text-[var(--ink)]">More properties coming soon</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Our local vetting team is preparing new residence profiles in {destination.name} now.
            </p>
            <Link href="/hotels" className="button-3d mt-6 inline-block bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white">
              Browse all stay options
            </Link>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
