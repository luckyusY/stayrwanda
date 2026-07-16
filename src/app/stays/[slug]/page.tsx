import { permanentRedirect } from "next/navigation";
export default async function LegacyStayPage({ params }: { params: Promise<{ slug: string }> }) { permanentRedirect(`/hotels/${(await params).slug}`); }
