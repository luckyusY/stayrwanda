"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, BedDouble, Building2, ChevronDown, Heart, Home, MapPin, Menu, Search, ShieldCheck, Sparkles, Star, Users, X } from "lucide-react";
import type { Property } from "@/lib/properties";

const locations = ["All Rwanda", "Kigali", "Musanze"];

export function HomeExperience({ properties }: { properties: Property[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Rwanda");
  const [type, setType] = useState("All stays");
  const [favourites, setFavourites] = useState<string[]>([]);

  const filtered = useMemo(() => properties.filter((property) => {
    const matchesQuery = `${property.title} ${property.location} ${property.neighborhood}`.toLowerCase().includes(query.toLowerCase());
    const matchesLocation = location === "All Rwanda" || property.location.includes(location);
    const matchesType = type === "All stays" || property.type === type;
    return matchesQuery && matchesLocation && matchesType;
  }), [properties, query, location, type]);

  const toggleFavourite = (slug: string) => setFavourites((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);

  return (
    <main className="overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-40 border-b border-white/15 text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" aria-label="StayRwanda home">
            <span className="grid size-9 place-items-center rounded-full bg-[#d9a441] text-[#102a43]"><Home size={18} strokeWidth={2.6} /></span>
            StayRwanda<span className="text-[#d9a441]">.</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Main navigation">
            <a href="#stays" className="hover:text-[#f3c86e]">Find a stay</a>
            <a href="#why" className="hover:text-[#f3c86e]">Why StayRwanda</a>
            <a href="#explore" className="hover:text-[#f3c86e]">Explore Rwanda</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/10">Sign in</button>
            <button className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#123b5d] hover:bg-[#f3c86e]">List your property</button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="grid size-11 place-items-center rounded-full bg-white/10 md:hidden" aria-label="Open menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="mx-4 rounded-2xl bg-white p-5 text-[#123b5d] shadow-xl md:hidden"><nav className="flex flex-col gap-4"><a href="#stays">Find a stay</a><a href="#why">Why StayRwanda</a><a href="#explore">Explore Rwanda</a><button className="rounded-xl bg-[#123b5d] px-4 py-3 text-white">List your property</button></nav></div>}
      </header>

      <section className="relative min-h-[760px] bg-[#102a43] text-white">
        <Image src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=2200&q=90" alt="Green hills and city landscape in Rwanda" fill priority className="object-cover opacity-55" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,48,.88)_0%,rgba(8,31,48,.46)_52%,rgba(8,31,48,.24)_100%)]" />
        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-24 pt-32 lg:px-8">
          <div className="max-w-3xl animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] backdrop-blur"><Sparkles size={14} className="text-[#f3c86e]" /> Rwanda&apos;s trusted stays</div>
            <h1 className="serif-display max-w-2xl text-5xl leading-[1.03] tracking-[-.035em] sm:text-6xl lg:text-7xl">Stay local.<br /><span className="text-[#f3c86e]">Feel at home.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">Discover verified apartments, guesthouses and remarkable homes across Rwanda — handpicked for the way you want to stay.</p>
            <div className="mt-10 grid max-w-4xl gap-2 rounded-2xl bg-white p-2 text-[#152536] soft-shadow sm:grid-cols-[1fr_1fr_auto] lg:grid-cols-[1.2fr_1fr_1fr_auto]">
              <label className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[#f7f5ef]">
                <Search size={19} className="text-[#d9a441]" /><span className="flex-1"><span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Where</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" placeholder="Neighborhood or stay" /></span>
              </label>
              <label className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[#f7f5ef]"><MapPin size={19} className="text-[#d9a441]" /><span className="flex-1"><span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</span><select value={location} onChange={(event) => setLocation(event.target.value)} className="w-full appearance-none bg-transparent text-sm font-semibold outline-none">{locations.map(item => <option key={item}>{item}</option>)}</select></span><ChevronDown size={15} /></label>
              <label className="hidden items-center gap-3 rounded-xl px-4 py-3 hover:bg-[#f7f5ef] lg:flex"><BedDouble size={19} className="text-[#d9a441]" /><span className="flex-1"><span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Stay type</span><select value={type} onChange={(event) => setType(event.target.value)} className="w-full appearance-none bg-transparent text-sm font-semibold outline-none"><option>All stays</option><option>Apartment</option><option>Villa</option><option>Loft</option><option>Guesthouse</option><option>House</option></select></span><ChevronDown size={15} /></label>
              <a href="#stays" className="flex min-h-14 items-center justify-center rounded-xl bg-[#d9a441] px-7 font-bold text-[#102a43] hover:bg-[#e8ba5c]">Search</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/75"><span className="flex items-center gap-2"><BadgeCheck size={17} className="text-[#f3c86e]" /> Verified homes</span><span className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#f3c86e]" /> Secure booking</span><span className="flex items-center gap-2"><Users size={17} className="text-[#f3c86e]" /> Local support</span></div>
          </div>
        </div>
      </section>

      <section id="stays" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#b27a16]">Made for memorable stays</p><h2 className="serif-display text-4xl tracking-tight text-[#102a43] md:text-5xl">Places guests love</h2><p className="mt-4 max-w-xl text-slate-600">Thoughtful homes, trusted hosts, and the best of Rwanda right outside your door.</p></div>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">{["All stays", "Apartment", "Villa", "Loft", "Guesthouse", "House"].map(item => <button key={item} onClick={() => setType(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${type === item ? "border-[#123b5d] bg-[#123b5d] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#d9a441]"}`}>{item}</button>)}</div>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <article key={property.slug} className="group min-w-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200">
                <Link href={`/stays/${property.slug}`}><Image src={property.image} alt={property.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" /></Link>
                {property.badge && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#123b5d] shadow-sm">{property.badge}</span>}
                <button onClick={() => toggleFavourite(property.slug)} aria-label="Save property" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-[#123b5d] hover:scale-105"><Heart size={18} fill={favourites.includes(property.slug) ? "#d9a441" : "transparent"} className={favourites.includes(property.slug) ? "text-[#d9a441]" : ""} /></button>
              </div>
              <div className="pt-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{property.neighborhood} · {property.type}</p><Link href={`/stays/${property.slug}`} className="mt-1 block text-lg font-bold text-[#102a43] group-hover:text-[#b27a16]">{property.title}</Link></div><span className="mt-1 flex items-center gap-1 text-sm font-semibold"><Star size={14} fill="#d9a441" className="text-[#d9a441]" />{property.rating}</span></div><div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3"><p><strong className="text-lg text-[#102a43]">${property.price}</strong><span className="text-sm text-slate-500"> / night</span></p><p className="text-xs text-slate-400">{property.bedrooms} bed · {property.baths} bath</p></div></div>
            </article>
          ))}
        </div>
        {!filtered.length && <div className="mt-12 rounded-3xl bg-[#edf3f5] p-12 text-center"><Search className="mx-auto text-[#d9a441]" /><h3 className="mt-4 text-xl font-bold text-[#102a43]">No stays match that search yet</h3><p className="mt-2 text-slate-500">Try another neighborhood or browse all stays.</p><button onClick={() => { setQuery(""); setLocation("All Rwanda"); setType("All stays"); }} className="mt-5 rounded-full bg-[#123b5d] px-5 py-2.5 text-sm font-bold text-white">Clear filters</button></div>}
      </section>

      <section id="why" className="bg-[#102a43] py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#f3c86e]">Local by design</p><h2 className="serif-display text-4xl leading-tight md:text-5xl">Rwanda is home.<br />We know how to host.</h2><p className="mt-6 max-w-lg leading-7 text-white/70">We pair technology with people on the ground. Every stay is reviewed, every host is known, and help is never far away.</p><a href="#explore" className="mt-8 inline-flex items-center gap-2 border-b border-[#d9a441] pb-1 font-bold text-[#f3c86e]">Our promise to you <ArrowRight size={17} /></a></div>
          <div className="grid gap-4 sm:grid-cols-3">{[
            [BadgeCheck, "Verified stays", "Real properties, reviewed by our local team."],
            [ShieldCheck, "Book confidently", "Clear pricing and secure booking from start to finish."],
            [Users, "People who care", "Responsive support from a team right here in Rwanda."],
          ].map(([Icon, title, copy]) => { const C = Icon as typeof BadgeCheck; return <div key={String(title)} className="rounded-2xl border border-white/10 bg-white/[.06] p-6"><span className="grid size-11 place-items-center rounded-full bg-[#d9a441] text-[#102a43]"><C size={21} /></span><h3 className="mt-6 font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-white/60">{String(copy)}</p></div>; })}</div>
        </div>
      </section>

      <section id="explore" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#efe8d8] lg:grid-cols-2">
          <div className="relative min-h-[420px]"><Image src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=85" alt="Lush Rwandan landscape" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /></div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#9a6815]">More than a place to sleep</p><h2 className="serif-display mt-4 text-4xl leading-tight text-[#102a43] md:text-5xl">Let Rwanda surprise you.</h2><p className="mt-5 leading-7 text-slate-600">From Kigali&apos;s creative energy to misty volcano trails and the calm shores of Lake Kivu — start with a stay, leave with a story.</p><div className="mt-8 grid grid-cols-3 gap-3 text-center"><div><strong className="block text-2xl text-[#123b5d]">30+</strong><span className="text-xs text-slate-500">Neighborhoods</span></div><div><strong className="block text-2xl text-[#123b5d]">100%</strong><span className="text-xs text-slate-500">Local team</span></div><div><strong className="block text-2xl text-[#123b5d]">24/7</strong><span className="text-xs text-slate-500">Guest care</span></div></div></div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 text-center md:flex-row md:text-left lg:px-8"><div><h2 className="serif-display text-3xl text-[#102a43]">Have a place guests would love?</h2><p className="mt-2 text-slate-500">Join Rwanda&apos;s trusted community of hosts.</p></div><button className="flex items-center gap-2 rounded-full bg-[#d9a441] px-6 py-3.5 font-bold text-[#102a43] hover:bg-[#e8ba5c]"><Building2 size={19} /> List your property</button></div></section>

      <footer className="bg-[#0b2234] py-14 text-white"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4"><div><div className="flex items-center gap-2 text-xl font-bold"><span className="grid size-9 place-items-center rounded-full bg-[#d9a441] text-[#102a43]"><Home size={18} /></span>StayRwanda.</div><p className="mt-4 max-w-xs text-sm leading-6 text-white/55">A better way to find your place in the land of a thousand hills.</p></div><FooterColumn title="Explore" links={["Kigali stays", "Musanze stays", "Lake Kivu", "All properties"]} /><FooterColumn title="Hosting" links={["List your property", "Host resources", "Community standards", "Host support"]} /><FooterColumn title="StayRwanda" links={["About us", "Trust & safety", "Help centre", "Contact"]} /></div><div className="flex flex-col justify-between gap-3 pt-7 text-xs text-white/40 sm:flex-row"><p>© {new Date().getFullYear()} StayRwanda. Made in Rwanda.</p><p>Privacy · Terms · Cookies</p></div></div></footer>
    </main>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return <div><h3 className="text-sm font-bold text-[#f3c86e]">{title}</h3><ul className="mt-4 space-y-3 text-sm text-white/55">{links.map(link => <li key={link}><a href="#" className="hover:text-white">{link}</a></li>)}</ul></div>;
}
