import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { HotelDirectory } from "@/components/hotel-directory";
import { listPublishedHotels } from "@/lib/platform-data";

export const revalidate = 300;
export const metadata = { title: "Hotels", description: "Discover verified hotels and hospitality profiles across Rwanda." };
export default async function HotelsPage() { return <main><SiteHeader /><section className="bg-[var(--ink)] px-4 py-20 text-center text-white"><p className="eyebrow !text-[var(--gold)]">StayRwanda hotel collection</p><h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl font-semibold">Hospitality with a distinctly Rwandan welcome</h1></section><HotelDirectory hotels={await listPublishedHotels()} eyebrow="Verified profiles" title="Hotels and hosted residences" copy="Each profile is controlled by its hospitality team and reviewed by StayRwanda before publication." /><SiteFooter /></main>; }
