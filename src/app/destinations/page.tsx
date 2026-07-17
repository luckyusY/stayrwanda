import { DestinationsExperience } from "@/components/destinations-experience";
import { destinations } from "@/lib/editorial";
import { listPublishedHotels } from "@/lib/platform-data";

export const metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  const properties = await listPublishedHotels();
  return (
    <DestinationsExperience
      destinations={destinations}
      properties={properties}
    />
  );
}
