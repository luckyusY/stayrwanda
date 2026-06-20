import { HomeExperience } from "@/components/home-experience";
import { featuredProperties } from "@/lib/properties";

export default function Home() {
  return <HomeExperience properties={featuredProperties} />;
}
