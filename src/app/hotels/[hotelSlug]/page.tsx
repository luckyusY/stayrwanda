import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, MapPin } from "lucide-react";
import { HotelBookingPanel } from "@/components/hotel-booking-panel";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getPublishedHotel, getUnitForHotel } from "@/lib/platform-data";
import { PriceDisplay } from "@/components/price-display";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ hotelSlug: string }> }): Promise<Metadata> {
  const hotel = await getPublishedHotel((await params).hotelSlug);
  return hotel ? { title: hotel.name, description: hotel.description, openGraph: { images: hotel.heroImage ? [hotel.heroImage] : [] } } : {};
}

export default async function HotelProfilePage({ params }: { params: Promise<{ hotelSlug: string }> }) {
  const hotel = await getPublishedHotel((await params).hotelSlug);
  if (!hotel) notFound();
  
  const dbUnit = hotel.id.startsWith("seed-") ? null : await getUnitForHotel(hotel.id);
  const unit = dbUnit || (hotel.startingPriceRwf ? {
    id: `unit-${hotel.id}`,
    organizationId: "seed",
    hotelId: hotel.id,
    name: "Entire residence",
    quantity: 1,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    basePriceRwf: hotel.startingPriceRwf,
    minStay: 1,
    status: "published" as const,
    amenities: ["Kitchen", "Parking", "WiFi"],
    images: hotel.gallery,
  } : null);

  const palette = hotel.template === "modern" ? "bg-[#f4f1eb]" : hotel.template === "editorial" ? "bg-[#f8f3ea]" : "bg-white";

  return (
    <main className={palette}>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-5 text-xs uppercase tracking-[.14em] text-[var(--muted)]">
        <Link href="/hotels">Hotels</Link> <ChevronRight className="inline" size={12} /> {hotel.location.neighborhood} <ChevronRight className="inline" size={12} /> <span className="text-[var(--ink)]">{hotel.name}</span>
      </div>
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <p className="eyebrow">{hotel.category} · {hotel.template} collection</p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold text-[var(--ink)] sm:text-6xl">{hotel.name}</h1>
        <p className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]"><MapPin size={16} className="text-[var(--gold-deep)]" />{hotel.location.address}, {hotel.location.city}, {hotel.location.country}</p>
        <div className="mt-8 grid h-[520px] gap-2 overflow-hidden rounded-[var(--radius-panel)] md:grid-cols-2">
          <div className="relative">{hotel.gallery[0] && <Image src={hotel.gallery[0]} alt={hotel.name} fill priority className="object-cover" sizes="50vw" />}</div>
          <div className="hidden grid-cols-2 gap-2 md:grid">{hotel.gallery.slice(1, 5).map((image, index) => <div className="relative" key={image}><Image src={image} alt={`${hotel.name} view ${index + 2}`} fill className="object-cover" sizes="25vw" /></div>)}</div>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div>
          <section id="overview">
            <p className="eyebrow">Overview</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">A considered stay in {hotel.location.neighborhood}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{hotel.description}</p>
            
            {/* Host Card */}
            <div className="mt-8 flex items-center gap-4 bg-white border border-[var(--line)] p-4 rounded-xl max-w-md shadow-sm">
              <div className="size-11 rounded-full bg-[var(--cream)] text-[var(--gold-deep)] border border-[var(--gold)] flex items-center justify-center font-bold text-lg select-none">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-semibold text-[var(--ink)]">StayRwanda Partner</strong>
                  <span className="bg-[#d4edda] text-[#1a4731] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                    Verified Host
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-0.5">Professional hospitality partner</p>
              </div>
            </div>
          </section>

          <section id="rooms" className="mt-14 border-t border-[var(--line)] pt-12">
            <p className="eyebrow">Rooms & residences</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">{unit?.name || "Accommodation"}</h2>
            {unit && (
              <div className="surface-3d surface-3d-lift mt-6 p-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <strong className="font-serif text-xl text-[var(--ink)]">{unit.name}</strong>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Up to {unit.maxGuests} guests · {unit.bedrooms} bedrooms · {unit.baths} bathrooms
                    </p>
                  </div>
                  <PriceDisplay amountRwf={unit.basePriceRwf} prefix="" className="font-serif text-lg font-semibold text-[var(--gold-deep)]" />
                </div>
              </div>
            )}
            {!unit && hotel.startingPriceRwf && (
              <div className="surface-3d mt-6 p-6">
                <p className="text-sm text-[var(--muted)]">Indicative nightly rate</p>
                <PriceDisplay amountRwf={hotel.startingPriceRwf} className="mt-2 block font-serif text-2xl font-semibold text-[var(--gold-deep)]" />
              </div>
            )}
          </section>

          <section id="amenities" className="mt-14 border-t border-[var(--line)] pt-12">
            <p className="eyebrow">Amenities</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {hotel.amenities.map((item) => (
                <span key={item} className="flex gap-3 text-[var(--muted)] text-sm items-center">
                  <span className="grid size-6 place-items-center rounded-full bg-[var(--cream)] text-[var(--gold-deep)]">
                    <Check size={13} />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section id="location" className="mt-14 border-t border-[var(--line)] pt-12">
            <p className="eyebrow">Location</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-[var(--ink)] font-semibold">
                <MapPin size={18} className="text-[var(--gold-deep)]" />
                <span>{hotel.location.neighborhood}, {hotel.location.city}</span>
              </div>
              
              {hotel.location.lat && hotel.location.lng ? (
                <div className="relative h-72 w-full rounded-xl overflow-hidden shadow-md border border-[var(--line)]">
                  <iframe
                    title="Property Map Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://maps.google.com/maps?q=${hotel.location.lat},${hotel.location.lng}&z=15&output=embed`}
                    style={{ filter: "grayscale(0.65) contrast(1.1) brightness(0.92)", pointerEvents: "none" }}
                  />
                  <div className="absolute bottom-4 right-4 z-10">
                    <a 
                      className="button-3d inline-block bg-[var(--ink)] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-white" 
                      href={`https://www.google.com/maps?q=${hotel.location.lat},${hotel.location.lng}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              ) : (
                <div className="surface-3d p-6 text-center">
                  <MapPin className="mx-auto text-[var(--gold-deep)]" />
                  <strong className="mt-2 block font-serif text-xl">{hotel.location.neighborhood}, {hotel.location.city}</strong>
                </div>
              )}
            </div>
          </section>
        </div>
        <HotelBookingPanel hotel={hotel} unit={unit} />
      </div>
      <SiteFooter />
    </main>
  );
}
