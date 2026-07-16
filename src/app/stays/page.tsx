import { SiteFooter, SiteHeader, CompactSearch } from "@/components/site-chrome";
import { HotelDirectory } from "@/components/hotel-directory";
import { listPublishedHotels } from "@/lib/platform-data";

export const revalidate = 300;
export const metadata = { title: "Stays across Rwanda", description: "Browse verified hotels, residences and guesthouses across Rwanda." };
export default async function StaysPage() { const hotels = await listPublishedHotels(); return <main><SiteHeader /><CompactSearch /><HotelDirectory hotels={hotels} eyebrow="Explore Rwanda" title="A stay for every way you travel" copy="Compare verified residences, hotels and guesthouses with clear details and direct booking requests." /><SiteFooter /></main>; }
