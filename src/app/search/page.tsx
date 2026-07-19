import { CompactSearch, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SearchResults } from "@/components/search-results";
import { listPublicProperties, type StoredProperty } from "@/lib/data";

export const revalidate = 300;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const { destination = "Kigali" } = await searchParams;
  let properties: StoredProperty[] = [];
  try {
    properties = await listPublicProperties();
  } catch (error) {
    console.error("Search catalogue failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    properties = [];
  }

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden">
      <SiteHeader />
      <CompactSearch destination={destination} />
      <SearchResults properties={properties} initialDestination={destination} />
      <SiteFooter />
    </main>
  );
}
