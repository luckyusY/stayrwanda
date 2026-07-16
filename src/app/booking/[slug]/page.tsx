import { permanentRedirect } from "next/navigation";
export default async function LegacyBooking({params}:{params:Promise<{slug:string}>}){permanentRedirect(`/hotels/${(await params).slug}`)}
