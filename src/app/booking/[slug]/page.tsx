import { notFound } from "next/navigation";
import { BookingRequest } from "@/components/booking-request";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { featuredProperties, getProperty } from "@/lib/properties";

export function generateStaticParams() { return featuredProperties.map(({ slug }) => ({ slug })); }
export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) { const property = getProperty((await params).slug); if (!property) notFound(); return <main><SiteHeader compact /><BookingRequest property={property} /><SiteFooter /></main>; }
