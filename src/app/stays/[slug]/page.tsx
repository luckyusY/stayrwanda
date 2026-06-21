import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, CalendarDays, Check, ChevronRight, CircleParking, CookingPot, ExternalLink, Heart, Images, MapPin, Share2, ShieldCheck, Star, Trees, Users, Wifi } from "lucide-react";
import { CompactSearch, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { featuredProperties } from "@/lib/properties";
import { getPropertyBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export function generateStaticParams() { return featuredProperties.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const property = await getPropertyBySlug((await params).slug);
  return property ? { title: property.title, description: property.description } : {};
}

export default async function StayPage({ params }: { params: Promise<{ slug: string }> }) {
  const property = await getPropertyBySlug((await params).slug);
  if (!property) notFound();
  const heroImages = property.images.slice(0, 5);

  return <main className="min-h-screen bg-white text-[#1a1a1a]">
    <SiteHeader compact />
    <CompactSearch destination={property.neighborhood} />

    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <nav className="flex flex-wrap items-center gap-1 py-4 text-xs text-[#006ce4]"><Link href="/">Home</Link><ChevronRight size={13} className="text-[#777]" /><Link href="/search">Rwanda</Link><ChevronRight size={13} className="text-[#777]" /><Link href={`/search?destination=${property.neighborhood}`}>{property.neighborhood}</Link><ChevronRight size={13} className="text-[#777]" /><span className="text-[#1a1a1a]">{property.title}</span></nav>

      <nav className="sticky top-0 z-30 grid grid-cols-3 border-y border-[#ddd] bg-white text-center text-xs font-bold text-[#006ce4] sm:grid-cols-6 sm:text-sm">
        {[['Overview','#overview'],['Info & prices','#availability'],['Facilities','#facilities'],['House rules','#rules'],['Fine print','#fine-print'],['Guest reviews','#reviews']].map(([label, href]) => <a key={label} href={href} className="border-b-2 border-transparent px-2 py-4 hover:border-[#006ce4] hover:bg-[#f0f6ff]">{label}</a>)}
      </nav>

      <section id="overview" className="scroll-mt-20 pt-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div><div className="flex items-center gap-2"><span className="rounded bg-[#003b95] px-2 py-1 text-xs font-bold text-white">{property.type}</span><span className="flex text-[#f9b90f]">{[1,2,3,4].map((item) => <Star key={item} size={14} fill="currentColor" />)}</span></div><h1 className="mt-2 text-3xl font-extrabold tracking-tight">{property.title}</h1><p className="mt-2 flex items-start gap-2 text-sm"><MapPin size={17} className="mt-0.5 shrink-0" /><span>{property.neighborhood}, {property.location} · <button className="font-bold text-[#006ce4]">Excellent location — show map</button></span></p></div>
          <div className="flex items-center gap-2"><button className="grid size-10 place-items-center rounded text-[#006ce4] hover:bg-[#f0f6ff]" aria-label="Save"><Heart /></button><button className="grid size-10 place-items-center rounded text-[#006ce4] hover:bg-[#f0f6ff]" aria-label="Share"><Share2 /></button><Link href={`/booking/${property.slug}`} className="rounded bg-[#006ce4] px-5 py-3 text-sm font-bold text-white hover:bg-[#0057b8]">Reserve</Link></div>
        </div>

        <div className="relative mt-5 grid h-[520px] grid-cols-2 gap-1 overflow-hidden rounded-lg md:grid-cols-4">
          {heroImages.map((image, index) => <div key={image} className={`relative overflow-hidden ${index === 0 ? "col-span-2 row-span-2" : ""}`}><Image src={image} alt={`${property.title} photo ${index + 1}`} fill priority={index === 0} className="object-cover transition duration-300 hover:brightness-90" sizes={index === 0 ? "50vw" : "25vw"} /></div>)}
          <a href="#gallery" className="absolute bottom-4 right-4 flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-bold shadow"><Images size={18} /> Show all {property.photoCount} photos</a>
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div><h2 className="text-2xl font-bold">Stay in the heart of {property.neighborhood}</h2><p className="mt-4 max-w-3xl leading-7 text-[#474747]">{property.description}</p><p className="mt-4 max-w-3xl leading-7 text-[#474747]">This property is presented with its complete original photo gallery. Send a booking request to confirm room configuration, current rates and availability directly with the local host.</p><p className="mt-5 text-sm">Hosted by <strong>{property.host}</strong></p></div>
          <aside className="rounded-lg bg-[#ebf3ff] p-5"><h3 className="text-lg font-bold">Property highlights</h3><p className="mt-3 flex gap-2 text-sm"><MapPin size={19} /> Great location in {property.neighborhood}</p><p className="mt-3 flex gap-2 text-sm"><CircleParking size={19} /> On-site parking available</p><h4 className="mt-5 text-sm font-bold">Top reasons to book</h4><ul className="mt-3 space-y-2 text-sm"><li className="flex gap-2"><Check className="text-[#008234]" size={18} /> Fully photographed property</li><li className="flex gap-2"><Check className="text-[#008234]" size={18} /> No payment to request</li><li className="flex gap-2"><Check className="text-[#008234]" size={18} /> Rwanda-based support</li></ul><Link href={`/booking/${property.slug}`} className="mt-5 block rounded bg-[#006ce4] px-4 py-3 text-center text-sm font-bold text-white">Reserve your stay</Link></aside>
        </div>
      </section>

      <section id="facilities" className="scroll-mt-20 border-t border-[#ddd] py-10"><h2 className="text-2xl font-bold">Most popular facilities</h2><div className="mt-6 grid grid-cols-2 gap-5 text-sm sm:grid-cols-3 lg:grid-cols-6">{[[Wifi,'Free WiFi'],[CircleParking,'Free parking'],[CookingPot,'Kitchen'],[Trees,'Outdoor space'],[Users,'Family rooms'],[ShieldCheck,'Secure stay']].map(([Icon,label]) => { const C = Icon as typeof Wifi; return <div key={String(label)} className="flex items-center gap-3"><C size={23} className="text-[#008234]" /><span>{String(label)}</span></div>; })}</div><div className="mt-8 grid gap-6 md:grid-cols-3">{['Property amenities','Room features','Services'].map((title,index) => <div key={title}><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-3 text-sm text-[#474747]">{property.amenities.slice(index,index+4).map((item) => <li key={item} className="flex gap-2"><Check size={17} />{item}</li>)}</ul></div>)}</div></section>

      <section id="availability" className="scroll-mt-20 border-t border-[#ddd] py-10"><h2 className="text-2xl font-bold">Availability</h2><p className="mt-2 text-sm text-[#595959]">Select dates to request the latest rates and room details.</p><div className="mt-5 grid gap-2 rounded bg-[#febb02] p-1 sm:grid-cols-[1fr_1fr_auto]"><label className="flex items-center gap-2 rounded bg-white px-3"><CalendarDays size={19} /><input type="date" className="min-h-12 flex-1 text-sm outline-none" /></label><label className="flex items-center gap-2 rounded bg-white px-3"><CalendarDays size={19} /><input type="date" className="min-h-12 flex-1 text-sm outline-none" /></label><button className="rounded bg-[#006ce4] px-6 py-3 font-bold text-white">Check availability</button></div>
        <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead className="bg-[#003b95] text-white"><tr><th className="border border-white/30 p-3">Accommodation type</th><th className="border border-white/30 p-3">Sleeps</th><th className="border border-white/30 p-3">Today&apos;s price</th><th className="border border-white/30 p-3">Your choices</th><th className="border border-white/30 p-3">Select</th></tr></thead><tbody><tr className="align-top"><td className="border border-[#aab7c4] p-4"><Link href="#gallery" className="font-bold text-[#006ce4] underline">Entire {property.type.toLowerCase()}</Link><p className="mt-2 flex gap-2"><BedDouble size={17} /> Bed configuration confirmed by host</p><p className="mt-2 flex gap-2"><Bath size={17} /> Private bathroom</p></td><td className="border border-[#aab7c4] p-4"><Users /></td><td className="border border-[#aab7c4] p-4"><strong>Request rate</strong><p className="mt-1 text-xs text-[#595959]">Includes taxes when confirmed</p></td><td className="border border-[#aab7c4] p-4"><p className="font-bold text-[#008234]">✓ No prepayment</p><p className="mt-2 font-bold text-[#008234]">✓ Request is free</p></td><td className="border border-[#aab7c4] p-4"><select className="rounded border p-2"><option>1</option><option>2</option></select><Link href={`/booking/${property.slug}`} className="mt-3 block rounded bg-[#006ce4] px-4 py-2 text-center font-bold text-white">I&apos;ll reserve</Link></td></tr></tbody></table></div>
      </section>

      <section id="reviews" className="scroll-mt-20 border-t border-[#ddd] py-10"><div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Guest reviews</h2><div className="flex items-center gap-3"><div className="text-right"><strong className="block">New to StayRwanda</strong><span className="text-sm text-[#595959]">Be among the first guests</span></div><span className="grid size-11 place-items-center rounded-[8px_8px_8px_0] bg-[#003b95] text-white"><Star size={18} fill="white" /></span></div></div><div className="mt-6 rounded-lg border border-[#ddd] p-6"><p className="font-bold">No verified guest reviews yet</p><p className="mt-2 text-sm text-[#595959]">After completed stays, guests can review cleanliness, comfort, location, facilities, staff and value for money.</p></div></section>

      <section className="border-t border-[#ddd] py-10"><h2 className="text-2xl font-bold">Property location</h2><div className="mt-5 grid min-h-72 place-items-center rounded-lg bg-[linear-gradient(45deg,#dcebf2_25%,transparent_25%),linear-gradient(-45deg,#dcebf2_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#dcebf2_75%),linear-gradient(-45deg,transparent_75%,#dcebf2_75%)] bg-[length:36px_36px] bg-[position:0_0,0_18px,18px_-18px,-18px_0px]"><div className="rounded-lg bg-white p-5 text-center shadow-lg"><MapPin className="mx-auto text-[#006ce4]" /><strong className="mt-2 block">{property.neighborhood}, Kigali</strong><button className="mt-3 rounded bg-[#006ce4] px-4 py-2 text-sm font-bold text-white">Show on map</button></div></div></section>

      <section id="rules" className="scroll-mt-20 border-t border-[#ddd] py-10"><h2 className="text-2xl font-bold">House rules</h2><p className="mt-2 text-sm text-[#595959]">{property.title} takes special requests — add them during booking.</p><div className="mt-6 divide-y divide-[#ddd] rounded-lg border border-[#ddd]">{[['Check-in','From 15:00 — tell the property your arrival time'],['Check-out','Until 11:00'],['Cancellation','Policies are confirmed with your rate'],['Children and beds','Children of all ages are welcome'],['Smoking','Smoking is not allowed indoors'],['Pets','Confirm pet requests with the property']].map(([label,value]) => <div key={label} className="grid gap-2 p-4 sm:grid-cols-[200px_1fr]"><strong>{label}</strong><span className="text-sm text-[#474747]">{value}</span></div>)}</div></section>

      <section id="fine-print" className="scroll-mt-20 border-t border-[#ddd] py-10"><h2 className="text-2xl font-bold">The fine print</h2><p className="mt-4 max-w-4xl text-sm leading-6 text-[#474747]">Please inform the property of your expected arrival time and confirm final rates, occupancy, cancellation terms and payment instructions before completing a booking. StayRwanda does not display unverified pricing.</p><a href={property.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#006ce4] underline">View source property gallery <ExternalLink size={15} /></a></section>

      <section id="gallery" className="scroll-mt-20 border-t border-[#ddd] py-10"><div className="flex items-end justify-between"><h2 className="text-2xl font-bold">All property photos</h2><span className="text-sm text-[#595959]">{property.photoCount} photos</span></div><div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3">{property.images.map((image,index) => <div key={image} className="relative aspect-[4/3] overflow-hidden rounded"><Image src={image} alt={`${property.title} photo ${index+1}`} fill className="object-cover transition duration-300 hover:scale-105" sizes="(max-width:640px) 100vw, 33vw" /></div>)}</div></section>
    </div>
    <SiteFooter />
  </main>;
}
