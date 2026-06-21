"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  ChevronDown,
  CircleHelp,
  Globe2,
  Heart,
  Home,
  MapPin,
  Menu,
  Minus,
  Plane,
  Plus,
  Search,
  Star,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { Property } from "@/lib/properties";

const stayTypes = ["All stays", "Furnished apartment", "Serviced apartment", "Furnished home"];
const neighborhoods = ["Kigali", "Kibagabaga", "Kimironko", "Kagarama"];

export function HomeExperience({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All stays");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [favourites, setFavourites] = useState<string[]>([]);

  const filtered = useMemo(() => properties.filter((property) => {
    const text = `${property.title} ${property.location} ${property.neighborhood}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (type === "All stays" || property.type === type);
  }), [properties, query, type]);

  const toggleFavourite = (slug: string) => setFavourites((current) => current.includes(slug)
    ? current.filter((item) => item !== slug)
    : [...current, slug]);

  const chooseDestination = (destination: string) => {
    router.push(`/search?destination=${encodeURIComponent(destination)}`);
  };

  const runSearch = () => router.push(`/search?destination=${encodeURIComponent(query || "Kigali")}`);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#1a1a1a]">
      <header className="bg-[#073b74] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight" aria-label="StayRwanda home">
              <span>StayRwanda</span><span className="text-[#f9b90f]">.</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              <button className="rounded px-3 py-2 text-sm font-semibold hover:bg-white/10">RWF</button>
              <button className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Choose language"><Globe2 size={20} /></button>
              <button className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Help"><CircleHelp size={20} /></button>
              <Link href="/list-property" className="rounded px-3 py-2 text-sm font-semibold hover:bg-white/10">List your property</Link>
              <Link href="/register" className="ml-1 rounded-sm border border-white bg-white px-4 py-2 text-sm font-semibold text-[#006ce4] hover:bg-[#f0f6ff]">Register</Link>
              <Link href="/sign-in" className="rounded-sm border border-white bg-white px-4 py-2 text-sm font-semibold text-[#006ce4] hover:bg-[#f0f6ff]">Sign in</Link>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="grid size-11 place-items-center rounded md:hidden" aria-label="Toggle menu">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-white/15 py-4 md:hidden">
              <nav className="grid gap-2 text-sm font-semibold">
                <Link href="/sign-in" className="rounded bg-white/10 px-4 py-3 text-left">Register or sign in</Link>
                <Link href="/list-property" className="rounded px-4 py-3 text-left hover:bg-white/10">List your property</Link>
                <Link href="/help" className="rounded px-4 py-3 text-left hover:bg-white/10">Help and support</Link>
              </nav>
            </div>
          )}

          <nav className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar" aria-label="Booking categories">
            <a href="#properties" className="flex shrink-0 items-center gap-2 rounded-full border border-white bg-white/10 px-4 py-2 text-sm font-semibold"><BedDouble size={18} /> Stays</a>
            <a href="#properties" className="flex shrink-0 items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm hover:bg-white/10"><Home size={18} /> Monthly rentals</a>
            <a href="#explore" className="flex shrink-0 items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm hover:bg-white/10"><Building2 size={18} /> Guest houses</a>
            <a href="#explore" className="flex shrink-0 items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm hover:bg-white/10"><Plane size={18} /> Airport stays</a>
            <a href="#support" className="flex shrink-0 items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm hover:bg-white/10"><Car size={18} /> Local transport</a>
          </nav>
        </div>
      </header>

      <section className="bg-[#073b74] pb-20 pt-10 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Find your next stay in Rwanda</h1>
          <p className="mt-3 text-lg text-white/90 sm:text-xl">Search verified apartments, furnished homes and local stays across Kigali.</p>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-9 max-w-6xl px-4 sm:px-6" aria-label="Search stays">
        <div className="grid max-w-full grid-cols-[minmax(0,1fr)] gap-1 rounded-lg bg-[#f9b90f] p-1 shadow-[0_2px_8px_rgba(0,0,0,.24)] md:grid-cols-[1.25fr_1fr_1fr_auto]">
          <label className="flex min-h-14 items-center gap-3 rounded-[4px] bg-white px-4">
            <MapPin size={22} className="shrink-0 text-[#595959]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Where are you going?" className="w-full text-sm font-semibold outline-none placeholder:font-normal placeholder:text-[#595959]" />
          </label>

          <div className="flex min-h-14 min-w-0 items-center gap-3 overflow-hidden rounded-[4px] bg-white px-4">
            <CalendarDays size={22} className="shrink-0 text-[#595959]" />
            <div className="grid min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input type="date" aria-label="Check-in date" className="w-[110px] min-w-0 max-w-full text-xs font-semibold outline-none" />
              <span className="text-[#777]">—</span>
              <input type="date" aria-label="Check-out date" className="w-[110px] min-w-0 max-w-full text-xs font-semibold outline-none" />
            </div>
          </div>

          <div className="relative">
            <button onClick={() => setGuestOpen(!guestOpen)} className="flex min-h-14 w-full items-center gap-3 rounded-[4px] bg-white px-4 text-left">
              <Users size={22} className="shrink-0 text-[#595959]" />
              <span className="min-w-0 flex-1 truncate text-sm">{adults} adults · {children} children · {rooms} room</span>
              <ChevronDown size={17} />
            </button>
            {guestOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full min-w-72 rounded-lg border border-[#e7e7e7] bg-white p-5 text-[#1a1a1a] shadow-xl">
                <Counter label="Adults" value={adults} min={1} setValue={setAdults} />
                <Counter label="Children" value={children} min={0} setValue={setChildren} />
                <Counter label="Rooms" value={rooms} min={1} setValue={setRooms} />
                <button onClick={() => setGuestOpen(false)} className="mt-2 w-full rounded border border-[#006ce4] py-2.5 text-sm font-bold text-[#006ce4]">Done</button>
              </div>
            )}
          </div>

          <button onClick={runSearch} className="min-h-14 rounded-[4px] bg-[#006ce4] px-8 text-lg font-bold text-white hover:bg-[#0057b8]">Search</button>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" className="size-5 accent-[#006ce4]" /> I&apos;m travelling for work</label>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 pt-10 sm:px-6">
        <section>
          <h2 className="text-2xl font-bold">Offers</h2>
          <p className="mt-1 text-sm text-[#595959]">Promotions, deals and special offers for you</p>
          <div className="relative mt-4 overflow-hidden rounded-lg border border-[#e7e7e7] bg-white p-5 shadow-sm sm:min-h-40 sm:p-6">
            <div className="relative z-10 max-w-xl pr-24 sm:pr-48">
              <h3 className="text-xl font-bold">Stay longer, discover more</h3>
              <p className="mt-2 text-sm leading-6 text-[#595959]">Find a furnished Kigali stay for your next business trip, family visit or extended holiday.</p>
              <button onClick={runSearch} className="mt-4 rounded bg-[#006ce4] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0057b8]">Explore stays</button>
            </div>
            <div className="absolute bottom-0 right-2 size-32 sm:right-8 sm:size-40">
              <Image src={properties[4]?.image ?? properties[0].image} alt="Furnished Kigali apartment" fill className="rounded-full object-cover" sizes="160px" />
            </div>
          </div>
        </section>

        <section id="explore">
          <h2 className="text-2xl font-bold">Explore Rwanda</h2>
          <p className="mt-1 text-sm text-[#595959]">Popular neighborhoods for every kind of stay</p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {neighborhoods.map((destination, index) => {
              const property = (destination === "Kigali"
                ? properties.find((item) => item.neighborhood === "Kigali")
                : properties.find((item) => item.neighborhood === destination)) ?? properties[index];
              return (
                <button key={destination} onClick={() => chooseDestination(destination)} className="group text-left">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#eee]"><Image src={property.image} alt={destination} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" /></div>
                  <h3 className="mt-2 font-bold">{destination}</h3>
                  <p className="text-sm text-[#595959]">{properties.filter((item) => destination === "Kigali" || item.neighborhood === destination).length} properties</p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Browse by property type</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Furnished apartments", image: properties[0]?.image, value: "Furnished apartment" },
              { label: "Serviced apartments", image: properties.find((item) => item.type === "Serviced apartment")?.image, value: "Serviced apartment" },
              { label: "Private homes", image: properties.find((item) => item.type === "Furnished home")?.image, value: "Furnished home" },
              { label: "Long stays", image: properties[5]?.image, value: "All stays" },
            ].map((item) => (
              <button key={item.label} onClick={() => { setType(item.value); runSearch(); }} className="group text-left">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#eee]"><Image src={item.image ?? properties[0].image} alt={item.label} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" /></div>
                <h3 className="mt-2 font-bold">{item.label}</h3>
              </button>
            ))}
          </div>
        </section>

        <section id="properties" className="scroll-mt-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><h2 className="text-2xl font-bold">Homes guests love in Kigali</h2><p className="mt-1 text-sm text-[#595959]">Browse our newest furnished stays</p></div>
            <select value={type} onChange={(event) => setType(event.target.value)} className="rounded border border-[#868686] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#006ce4]">
              {stayTypes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((property) => (
              <article key={property.slug} className="group overflow-hidden rounded-lg border border-[#e7e7e7] bg-white shadow-sm transition hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eee]">
                  <Link href={`/stays/${property.slug}`}><Image src={property.image} alt={property.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" /></Link>
                  <button onClick={() => toggleFavourite(property.slug)} className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white/95 shadow" aria-label={`Save ${property.title}`}>
                    <Heart size={20} fill={favourites.includes(property.slug) ? "#e21b4d" : "white"} className={favourites.includes(property.slug) ? "text-[#e21b4d]" : "text-[#1a1a1a]"} />
                  </button>
                </div>
                <div className="p-3">
                  <Link href={`/stays/${property.slug}`} className="font-bold text-[#006ce4] hover:text-[#003b95] hover:underline">{property.title}</Link>
                  <p className="mt-1 text-xs text-[#595959] underline">{property.neighborhood}, {property.location}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-[#474747]">{property.type} · {property.photoCount} property photos</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-[6px_6px_6px_0] bg-[#003b95] text-sm font-bold text-white"><Star size={14} fill="white" /></span><span><strong className="block text-xs">New listing</strong><span className="text-[11px] text-[#595959]">Photo documented</span></span></div>
                    <span className="text-right text-sm font-bold">Request rates</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!filtered.length && (
            <div className="mt-5 rounded-lg border border-[#e7e7e7] p-10 text-center"><Search className="mx-auto text-[#006ce4]" /><h3 className="mt-3 text-lg font-bold">No exact matches</h3><p className="mt-1 text-sm text-[#595959]">Try another neighborhood or property type.</p><button onClick={() => { setQuery(""); setType("All stays"); }} className="mt-4 rounded bg-[#006ce4] px-4 py-2 text-sm font-bold text-white">See all stays</button></div>
          )}
        </section>

        <section className="rounded-lg border border-[#e7e7e7] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="flex items-start gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f0f6ff] text-[#006ce4]"><UserRound size={26} /></span><div><h2 className="text-xl font-bold">Sign in, save money</h2><p className="mt-1 text-sm text-[#595959]">Create an account to save favorite stays and manage booking requests.</p><div className="mt-4 flex gap-2"><Link href="/sign-in" className="rounded bg-[#006ce4] px-4 py-2 text-sm font-bold text-white">Sign in</Link><Link href="/register" className="rounded px-4 py-2 text-sm font-bold text-[#006ce4] hover:bg-[#f0f6ff]">Register</Link></div></div></div>
        </section>
      </div>

      <footer id="support">
        <div className="bg-[#073b74] py-10 text-center text-white"><h2 className="text-2xl font-bold">Save time, save money!</h2><p className="mt-1 text-sm text-white/75">Sign up and we&apos;ll send the best Rwanda stays to you.</p><div className="mx-auto mt-5 flex max-w-xl gap-2 px-4"><input type="email" placeholder="Your email address" className="min-h-12 flex-1 rounded px-4 text-[#1a1a1a] outline-none" /><button className="rounded bg-[#006ce4] px-5 font-bold hover:bg-[#0057b8]">Subscribe</button></div></div>
        <div className="border-b border-white/20 bg-[#00305f] py-4 text-center text-white"><Link href="/list-property" className="rounded border border-white px-4 py-2 text-sm font-semibold">List your property</Link></div>
        <div className="bg-white py-10"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-sm sm:grid-cols-3 sm:px-6 lg:grid-cols-5"><FooterLinks title="Destinations" links={["Kigali", "Kibagabaga", "Kimironko", "Kagarama"]} /><FooterLinks title="Discover" links={["Apartments", "Furnished homes", "Monthly stays", "Business travel"]} /><FooterLinks title="Support" links={["Help centre", "Safety information", "Cancellation options", "Contact us"]} /><FooterLinks title="Partners" links={["List your property", "Partner help", "Property resources", "Local transport"]} /><FooterLinks title="About" links={["About StayRwanda", "How we work", "Careers", "Terms & privacy"]} /></div><div className="mx-auto mt-10 max-w-6xl border-t border-[#e7e7e7] px-4 pt-6 text-xs text-[#595959] sm:px-6"><p>StayRwanda is a Rwanda-first marketplace for furnished stays.</p><p className="mt-3">© {new Date().getFullYear()} StayRwanda. All rights reserved.</p></div></div>
      </footer>
    </main>
  );
}

function Counter({ label, value, min, setValue }: { label: string; value: number; min: number; setValue: (value: number) => void }) {
  return <div className="mb-4 flex items-center justify-between"><span className="text-sm font-semibold">{label}</span><div className="flex items-center gap-3"><button onClick={() => setValue(Math.max(min, value - 1))} disabled={value <= min} className="grid size-9 place-items-center rounded border border-[#006ce4] text-[#006ce4] disabled:border-[#bbb] disabled:text-[#bbb]"><Minus size={16} /></button><span className="w-5 text-center text-sm">{value}</span><button onClick={() => setValue(value + 1)} className="grid size-9 place-items-center rounded border border-[#006ce4] text-[#006ce4]"><Plus size={16} /></button></div></div>;
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return <div><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-2 text-[#006ce4]">{links.map((link) => <li key={link}><Link href={link === "List your property" ? "/list-property" : title === "Support" ? "/help" : "/search"} className="hover:underline">{link}</Link></li>)}</ul></div>;
}
