import { HomeExperience } from "@/components/home-experience";
import { listPublicProperties } from "@/lib/data";

export const revalidate = 300;

export default async function Home() {
  const properties = await listPublicProperties();
  return <HomeExperience properties={properties} />;
}
