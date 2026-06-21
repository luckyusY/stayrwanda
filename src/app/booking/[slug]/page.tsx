import { notFound } from "next/navigation";
import { BookingRequest } from "@/components/booking-request";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { featuredProperties } from "@/lib/properties";
import { getPropertyBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export function generateStaticParams() { return featuredProperties.map(({ slug }) => ({ slug })); }
export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) { const property = await getPropertyBySlug((await params).slug); if (!property) notFound(); return <main><SiteHeader compact /><BookingRequest property={property} /><SiteFooter /></main>; }
