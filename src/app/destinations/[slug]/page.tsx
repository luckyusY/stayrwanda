import { notFound } from "next/navigation";
import { HotelDirectory } from "@/components/hotel-directory";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { destinations } from "@/lib/editorial";
import { listPublishedHotels } from "@/lib/platform-data";

export function generateStaticParams() { return destinations.map(({ slug }) => ({ slug })); }

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);
  if (!destination) notFound();
  const all = await listPublishedHotels();
  const hotels = all.filter((hotel) => `${hotel.location.city} ${hotel.location.neighborhood}`.toLowerCase().includes(destination.name.toLowerCase()));
  return <main><SiteHeader /><section className="bg-[var(--ink)] px-4 py-20 text-center text-white"><p className="eyebrow !text-[var(--gold)]">{destination.kicker}</p><h1 className="mt-4 font-serif text-6xl font-semibold">{destination.name}</h1><p className="mx-auto mt-5 max-w-2xl text-white/70">{destination.copy}</p></section><HotelDirectory hotels={hotels} eyebrow="Places to stay" title={`Stay in ${destination.name}`} copy="Verified profiles with complete galleries and local support." /><SiteFooter /></main>;
}
