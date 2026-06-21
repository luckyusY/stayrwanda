import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  ChevronRight,
  CircleParking,
  CookingPot,
  ExternalLink,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  Trees,
  Users,
  Wifi,
} from "lucide-react";
import { CompactSearch, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StayHeroGallery, StayPhotoGrid } from "@/components/stay-gallery";
import { StayReserveBar, StaySectionNav } from "@/components/stay-chrome";
import { featuredProperties } from "@/lib/properties";
import { getPropertyBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return featuredProperties.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const property = await getPropertyBySlug((await params).slug);
  return property ? { title: property.title, description: property.description } : {};
}

export default async function StayPage({ params }: { params: Promise<{ slug: string }> }) {
  const property = await getPropertyBySlug((await params).slug);
  if (!property) notFound();

  return (
    <main className="min-h-screen bg-white text-[var(--foreground)]">
      <SiteHeader />
      <CompactSearch destination={property.neighborhood} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="flex flex-wrap items-center gap-1 py-5 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--gold-deep)]">Home</Link>
          <ChevronRight size={12} />
          <Link href="/search" className="hover:text-[var(--gold-deep)]">Rwanda</Link>
          <ChevronRight size={12} />
          <Link href={`/search?destination=${property.neighborhood}`} className="hover:text-[var(--gold-deep)]">
            {property.neighborhood}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[var(--ink)]">{property.title}</span>
        </nav>

        <StaySectionNav />

        {/* Overview */}
        <section id="overview" className="scroll-mt-36 pt-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">{property.type}</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
                {property.title}
              </h1>
              <p className="mt-3 flex items-start gap-2 text-sm text-[var(--muted)]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--gold-deep)]" />
                <span>
                  {property.neighborhood}, {property.location} ·{" "}
                  <button className="font-medium text-[var(--gold-deep)]">Excellent location — show map</button>
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid size-11 place-items-center border border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]" aria-label="Save">
                <Heart size={18} />
              </button>
              <button className="grid size-11 place-items-center border border-[var(--line)] text-[var(--ink)] hover:border-[var(--gold)]" aria-label="Share">
                <Share2 size={18} />
              </button>
              <Link
                href={`/booking/${property.slug}`}
                className="bg-[var(--ink)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-2)]"
              >
                Reserve
              </Link>
            </div>
          </div>

          <StayHeroGallery images={property.images} title={property.title} photoCount={property.photoCount} />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-[var(--ink)]">
                Stay in the heart of {property.neighborhood}
              </h2>
              <div className="mt-4 rule-gold" />
              <p className="mt-6 max-w-3xl leading-8 text-[var(--muted)]">{property.description}</p>
              <p className="mt-4 max-w-3xl leading-8 text-[var(--muted)]">
                This residence is presented with its complete original photo gallery. Send a booking
                request to confirm room configuration, current rates and availability directly with the
                local host.
              </p>
              <p className="mt-6 text-sm text-[var(--ink)]">
                Hosted by <strong className="font-semibold">{property.host}</strong>
              </p>
            </div>
            <aside className="h-fit border border-[var(--line)] bg-[var(--cream)] p-6">
              <h3 className="font-serif text-xl font-semibold text-[var(--ink)]">Highlights</h3>
              <p className="mt-4 flex gap-2 text-sm text-[var(--muted)]">
                <MapPin size={18} className="text-[var(--gold-deep)]" /> Great location in {property.neighborhood}
              </p>
              <p className="mt-3 flex gap-2 text-sm text-[var(--muted)]">
                <CircleParking size={18} className="text-[var(--gold-deep)]" /> On-site parking available
              </p>
              <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
                Reasons to book
              </h4>
              <ul className="mt-3 space-y-2.5 text-sm text-[var(--muted)]">
                <li className="flex gap-2"><Check className="text-[var(--gold-deep)]" size={17} /> Fully photographed residence</li>
                <li className="flex gap-2"><Check className="text-[var(--gold-deep)]" size={17} /> No payment to request</li>
                <li className="flex gap-2"><Check className="text-[var(--gold-deep)]" size={17} /> Rwanda-based support</li>
              </ul>
              <Link
                href={`/booking/${property.slug}`}
                className="mt-6 block bg-[var(--ink)] px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[var(--ink-2)]"
              >
                Reserve your stay
              </Link>
            </aside>
          </div>
        </section>

        {/* Facilities */}
        <section id="facilities" className="scroll-mt-36 border-t border-[var(--line)] py-14">
          <p className="eyebrow">Comfort</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">Most popular facilities</h2>
          <div className="mt-7 grid grid-cols-2 gap-5 text-sm sm:grid-cols-3 lg:grid-cols-6">
            {[
              [Wifi, "Free WiFi"],
              [CircleParking, "Free parking"],
              [CookingPot, "Kitchen"],
              [Trees, "Outdoor space"],
              [Users, "Family rooms"],
              [ShieldCheck, "Secure stay"],
            ].map(([Icon, label]) => {
              const C = Icon as typeof Wifi;
              return (
                <div key={String(label)} className="flex items-center gap-3 text-[var(--ink)]">
                  <C size={22} className="text-[var(--gold-deep)]" />
                  <span>{String(label)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-9 grid gap-8 md:grid-cols-3">
            {["Property amenities", "Room features", "Services"].map((title, index) => (
              <div key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">{title}</h3>
                <ul className="mt-3 space-y-3 text-sm text-[var(--muted)]">
                  {property.amenities.slice(index, index + 4).map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check size={16} className="text-[var(--gold-deep)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Availability */}
        <section id="availability" className="scroll-mt-36 border-t border-[var(--line)] py-14">
          <p className="eyebrow">Reserve</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">Rates &amp; availability</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Select dates to request the latest rates and room details.
          </p>
          <div className="mt-6 grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-[1fr_1fr_auto]">
            <label className="flex items-center gap-2 bg-white px-4">
              <CalendarDays size={18} className="text-[var(--gold-deep)]" />
              <input type="date" className="min-h-13 flex-1 text-sm outline-none" />
            </label>
            <label className="flex items-center gap-2 bg-white px-4">
              <CalendarDays size={18} className="text-[var(--gold-deep)]" />
              <input type="date" className="min-h-13 flex-1 text-sm outline-none" />
            </label>
            <button className="bg-[var(--ink)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Check availability
            </button>
          </div>
          <div className="mt-7 overflow-x-auto border border-[var(--line)]">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[var(--ink)] text-white">
                <tr>
                  <th className="p-4 font-medium">Accommodation</th>
                  <th className="p-4 font-medium">Sleeps</th>
                  <th className="p-4 font-medium">Rate</th>
                  <th className="p-4 font-medium">Your choices</th>
                  <th className="p-4 font-medium">Select</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="border-t border-[var(--line)] p-4">
                    <Link href="#gallery" className="font-serif text-lg font-semibold text-[var(--gold-deep)]">
                      Entire {property.type.toLowerCase()}
                    </Link>
                    <p className="mt-2 flex gap-2 text-[var(--muted)]"><BedDouble size={16} /> Bed configuration confirmed by host</p>
                    <p className="mt-2 flex gap-2 text-[var(--muted)]"><Bath size={16} /> Private bathroom</p>
                  </td>
                  <td className="border-t border-[var(--line)] p-4 text-[var(--muted)]"><Users /></td>
                  <td className="border-t border-[var(--line)] p-4">
                    <strong className="font-serif text-lg text-[var(--ink)]">On request</strong>
                    <p className="mt-1 text-xs text-[var(--muted)]">Includes taxes when confirmed</p>
                  </td>
                  <td className="border-t border-[var(--line)] p-4 text-[var(--gold-deep)]">
                    <p>✓ No prepayment</p>
                    <p className="mt-2">✓ Request is free</p>
                  </td>
                  <td className="border-t border-[var(--line)] p-4">
                    <Link
                      href={`/booking/${property.slug}`}
                      className="block bg-[var(--ink)] px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white"
                    >
                      Reserve
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="scroll-mt-36 border-t border-[var(--line)] py-14">
          <p className="eyebrow">Guest reviews</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">What guests will say</h2>
          <div className="mt-6 border border-[var(--line)] bg-[var(--cream)] p-7">
            <p className="font-serif text-xl text-[var(--ink)]">New to StayRwanda — be among the first guests</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              After completed stays, guests can review cleanliness, comfort, location, facilities, staff
              and value for money.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="border-t border-[var(--line)] py-14">
          <p className="eyebrow">Setting</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">Property location</h2>
          <div className="mt-6 grid min-h-72 place-items-center border border-[var(--line)] bg-[var(--cream)]">
            <div className="bg-white p-6 text-center card-shadow">
              <MapPin className="mx-auto text-[var(--gold-deep)]" />
              <strong className="mt-2 block font-serif text-lg text-[var(--ink)]">
                {property.neighborhood}, Kigali
              </strong>
              <button className="mt-3 bg-[var(--ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                Show on map
              </button>
            </div>
          </div>
        </section>

        {/* House rules */}
        <section id="rules" className="scroll-mt-36 border-t border-[var(--line)] py-14">
          <p className="eyebrow">Good to know</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">House rules</h2>
          <div className="mt-6 divide-y divide-[var(--line)] border border-[var(--line)]">
            {[
              ["Check-in", "From 15:00 — tell the property your arrival time"],
              ["Check-out", "Until 11:00"],
              ["Cancellation", "Policies are confirmed with your rate"],
              ["Children and beds", "Children of all ages are welcome"],
              ["Smoking", "Smoking is not allowed indoors"],
              ["Pets", "Confirm pet requests with the property"],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-2 p-4 sm:grid-cols-[200px_1fr]">
                <strong className="font-medium text-[var(--ink)]">{label}</strong>
                <span className="text-sm text-[var(--muted)]">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Fine print */}
        <section id="fine-print" className="scroll-mt-36 border-t border-[var(--line)] py-14">
          <p className="eyebrow">The fine print</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">Before you book</h2>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            Please inform the property of your expected arrival time and confirm final rates, occupancy,
            cancellation terms and payment instructions before completing a booking. StayRwanda does not
            display unverified pricing.
          </p>
          <a
            href={property.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold-deep)]"
          >
            View source property gallery <ExternalLink size={14} />
          </a>
        </section>

        {/* Gallery */}
        <section id="gallery" className="scroll-mt-36 border-t border-[var(--line)] py-14">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">Every photograph</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              {property.photoCount} photos
            </span>
          </div>
          <StayPhotoGrid images={property.images} title={property.title} />
        </section>
      </div>
      <StayReserveBar slug={property.slug} title={property.title} neighborhood={property.neighborhood} />
      <SiteFooter />
    </main>
  );
}
