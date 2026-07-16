import { CompactSearch, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SearchResults } from "@/components/search-results";
import { listPublicProperties } from "@/lib/data";

export const revalidate = 300;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination = "Kigali" } = await searchParams;
  const properties = await listPublicProperties();
  return <main><SiteHeader /><CompactSearch destination={destination} /><SearchResults properties={properties} initialDestination={destination} /><SiteFooter /></main>;
}
