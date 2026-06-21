import { CompactSearch, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SearchResults } from "@/components/search-results";
import { featuredProperties } from "@/lib/properties";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ destination?: string }> }) {
  const { destination = "Kigali" } = await searchParams;
  return <main><SiteHeader /><CompactSearch destination={destination} /><SearchResults properties={featuredProperties} initialDestination={destination} /><SiteFooter /></main>;
}
