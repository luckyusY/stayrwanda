import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { HotelDirectory } from "@/components/hotel-directory";
import { listPublishedHotels } from "@/lib/platform-data";

export const revalidate = 300;
export const metadata = { title: "Furnished residences", description: "Editorially selected furnished residences for short and extended stays in Rwanda." };
export default async function ResidencesPage() { return <main><SiteHeader /><div className="bg-[var(--cream)] py-16"><HotelDirectory hotels={await listPublishedHotels("residence")} eyebrow="Live beautifully" title="Residences that feel considered" copy="Independent homes with full galleries, practical amenities and room to settle into Rwanda at your own pace." /></div><SiteFooter /></main>; }
