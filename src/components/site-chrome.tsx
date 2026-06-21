"use client";

import Link from "next/link";
import { useState } from "react";
import { BedDouble, Building2, CalendarDays, Car, CircleHelp, Globe2, Home, MapPin, Menu, Plane, Search, Users, X } from "lucide-react";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-[#073b74] text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">StayRwanda<span className="text-[#f9b90f]">.</span></Link>
          <div className="hidden items-center gap-1 md:flex">
            <button className="rounded px-3 py-2 text-sm font-semibold hover:bg-white/10">RWF</button>
            <button className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Language"><Globe2 size={20} /></button>
            <Link href="/help" className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Help"><CircleHelp size={20} /></Link>
            <Link href="/list-property" className="rounded px-3 py-2 text-sm font-semibold hover:bg-white/10">List your property</Link>
            <Link href="/register" className="ml-1 rounded-sm border border-white bg-white px-4 py-2 text-sm font-semibold text-[#006ce4]">Register</Link>
            <Link href="/sign-in" className="rounded-sm border border-white bg-white px-4 py-2 text-sm font-semibold text-[#006ce4]">Sign in</Link>
          </div>
          <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center md:hidden" aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && <nav className="grid gap-1 border-t border-white/15 py-3 text-sm font-semibold md:hidden"><Link className="rounded px-3 py-2 hover:bg-white/10" href="/sign-in">Sign in</Link><Link className="rounded px-3 py-2 hover:bg-white/10" href="/register">Register</Link><Link className="rounded px-3 py-2 hover:bg-white/10" href="/list-property">List your property</Link></nav>}
        {!compact && <nav className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar"><Link href="/search" className="flex shrink-0 items-center gap-2 rounded-full border border-white bg-white/10 px-4 py-2 text-sm font-semibold"><BedDouble size={18} /> Stays</Link><Link href="/search?type=Furnished+home" className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10"><Home size={18} /> Homes</Link><Link href="/search" className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10"><Building2 size={18} /> Apartments</Link><Link href="/search" className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10"><Plane size={18} /> Airport stays</Link><Link href="/help" className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/10"><Car size={18} /> Transport</Link></nav>}
      </div>
    </header>
  );
}

export function CompactSearch({ destination = "Kigali" }: { destination?: string }) {
  const [place, setPlace] = useState(destination);
  return (
    <div className="bg-[#f3f3f3] py-4">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-1 rounded-lg bg-[#f9b90f] p-1 sm:px-1 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <label className="flex min-h-13 min-w-0 items-center gap-3 rounded bg-white px-3"><MapPin size={20} className="shrink-0" /><input value={place} onChange={(event) => setPlace(event.target.value)} className="min-w-0 flex-1 text-sm outline-none" placeholder="Where are you going?" /></label>
        <div className="flex min-h-13 min-w-0 items-center gap-2 overflow-hidden rounded bg-white px-3"><CalendarDays size={20} className="shrink-0" /><input type="date" className="w-[105px] min-w-0 text-xs outline-none" /><span>—</span><input type="date" className="w-[105px] min-w-0 text-xs outline-none" /></div>
        <button className="flex min-h-13 items-center gap-3 rounded bg-white px-3 text-sm"><Users size={20} /><span>2 adults · 1 room</span></button>
        <Link href={`/search?destination=${encodeURIComponent(place)}`} className="flex min-h-13 items-center justify-center gap-2 rounded bg-[#006ce4] px-6 font-bold text-white hover:bg-[#0057b8]"><Search size={18} /> Search</Link>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const columns = [
    ["Destinations", ["Kigali", "Kibagabaga", "Kimironko", "Kagarama"]],
    ["Accommodation", ["Apartments", "Furnished homes", "Serviced stays", "Monthly rentals"]],
    ["Support", ["Help centre", "Safety", "Cancellation", "Contact us"]],
    ["Partners", ["List your property", "Partner help", "Property resources", "Transport"]],
    ["About", ["About StayRwanda", "How we work", "Careers", "Terms & privacy"]],
  ] as const;
  return <footer className="mt-16"><div className="bg-[#073b74] py-8 text-center text-white"><h2 className="text-2xl font-bold">Save time, save money!</h2><p className="mt-1 text-sm text-white/75">Sign up for the best Rwanda stay recommendations.</p><div className="mx-auto mt-4 flex max-w-xl gap-2 px-4"><input className="min-h-12 flex-1 rounded px-4 text-[#1a1a1a] outline-none" placeholder="Your email address" /><button className="rounded bg-[#006ce4] px-5 font-bold">Subscribe</button></div></div><div className="border-b border-white/20 bg-[#00305f] py-4 text-center"><Link href="/list-property" className="rounded border border-white px-4 py-2 text-sm font-semibold text-white">List your property</Link></div><div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6 lg:grid-cols-5">{columns.map(([title, links]) => <div key={title}><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-2 text-[#006ce4]">{links.map((item) => <li key={item}><Link href={item === "List your property" ? "/list-property" : "/help"} className="hover:underline">{item}</Link></li>)}</ul></div>)}</div><div className="mx-auto max-w-6xl border-t border-[#e7e7e7] px-4 py-6 text-xs text-[#595959] sm:px-6">© {new Date().getFullYear()} StayRwanda. Rwanda-first furnished stays.</div></footer>;
}
