"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ChevronDown, Globe2, MapPin, Menu, Search, Users, X } from "lucide-react";

const NAV = [
  { label: "Stays", href: "/search" },
  { label: "Residences", href: "/search?type=Furnished+home" },
  { label: "Destinations", href: "/search" },
  { label: "Offers", href: "/help" },
  { label: "List your property", href: "/list-property" },
] as const;

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center" aria-label="StayRwanda home">
      <Image
        src="/brand/stayrwanda-logo.png"
        alt="StayRwanda — Your Home in Rwanda"
        width={1093}
        height={607}
        priority
        className={`h-16 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

export function SiteHeader({
  variant = "solid",
}: {
  compact?: boolean;
  variant?: "solid" | "transparent";
}) {
  const [open, setOpen] = useState(false);
  const transparent = variant === "transparent";

  return (
    <header
      className={
        transparent
          ? "absolute inset-x-0 top-0 z-40"
          : "sticky top-0 z-40 border-b border-[var(--line)] bg-white"
      }
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          <Wordmark light={transparent} />

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-sm font-medium tracking-wide after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all hover:after:w-full ${
                  transparent ? "text-white/90 hover:text-white" : "text-[var(--ink)] hover:text-[var(--gold-deep)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              className={`flex items-center gap-1.5 text-sm font-medium ${
                transparent ? "text-white/90" : "text-[var(--ink)]"
              }`}
            >
              <Globe2 size={17} /> RWF
            </button>
            <Link
              href="/sign-in"
              className={`border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                transparent
                  ? "border-white/70 text-white hover:bg-white hover:text-[var(--ink)]"
                  : "border-[var(--gold)] text-[var(--gold-deep)] hover:bg-[var(--gold)] hover:text-white"
              }`}
            >
              Sign in
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className={`grid size-11 place-items-center lg:hidden ${transparent ? "text-white" : "text-[var(--ink)]"}`}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--line)] bg-white lg:hidden">
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-4 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-sm font-medium text-[var(--ink)] hover:text-[var(--gold-deep)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="mt-2 border border-[var(--gold)] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)]"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function CompactSearch({ destination = "Kigali" }: { destination?: string }) {
  const [place, setPlace] = useState(destination);
  return (
    <div className="bg-[var(--cream)] py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] md:grid-cols-[1.3fr_1.1fr_1fr_auto]">
          <label className="flex min-h-15 min-w-0 items-center gap-3 bg-white px-4">
            <MapPin size={20} className="shrink-0 text-[var(--gold-deep)]" />
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              className="min-w-0 flex-1 text-sm outline-none"
              placeholder="Where are you going?"
            />
          </label>
          <div className="flex min-h-15 min-w-0 items-center gap-2 bg-white px-4">
            <CalendarDays size={20} className="shrink-0 text-[var(--gold-deep)]" />
            <input type="date" className="w-[110px] min-w-0 text-xs outline-none" />
            <span className="text-[var(--muted)]">—</span>
            <input type="date" className="w-[110px] min-w-0 text-xs outline-none" />
          </div>
          <button className="flex min-h-15 items-center gap-3 bg-white px-4 text-sm text-[var(--ink)]">
            <Users size={20} className="text-[var(--gold-deep)]" /> 2 guests · 1 room
            <ChevronDown size={15} className="ml-auto" />
          </button>
          <Link
            href={`/search?destination=${encodeURIComponent(place)}`}
            className="flex min-h-15 items-center justify-center gap-2 bg-[var(--ink)] px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[var(--ink-2)]"
          >
            <Search size={17} /> Search
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const columns = [
    ["Destinations", ["Kigali", "Kibagabaga", "Kimironko", "Kagarama"]],
    ["Accommodation", ["Apartments", "Furnished residences", "Serviced stays", "Monthly rentals"]],
    ["Support", ["Help centre", "Safety", "Cancellation", "Contact us"]],
    ["Partners", ["List your property", "Partner help", "Property resources", "Transport"]],
    ["About", ["About StayRwanda", "How we work", "Careers", "Terms & privacy"]],
  ] as const;

  return (
    <footer className="mt-20">
      {/* Newsletter band on warm sand */}
      <div className="bg-[var(--cream)] py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="eyebrow">The StayRwanda Letter</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
            Inspiration for your next Rwandan stay
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Quietly curated apartments, residences and seasonal offers — delivered now and then.
          </p>
          <div className="mx-auto mt-6 flex max-w-md gap-px border border-[var(--line)] bg-[var(--line)]">
            <input
              className="min-h-13 flex-1 bg-white px-4 text-sm outline-none"
              placeholder="Your email address"
            />
            <button className="bg-[var(--gold)] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--gold-deep)]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Link columns on deep ink */}
      <div className="bg-[var(--ink)] text-white/80">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-center">
            <Wordmark light />
            <Link
              href="/list-property"
              className="border border-[var(--gold)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--ink)]"
            >
              List your property
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {columns.map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((item) => (
                    <li key={item}>
                      <Link
                        href={item === "List your property" ? "/list-property" : "/help"}
                        className="text-white/70 hover:text-white"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
            © {new Date().getFullYear()} StayRwanda — Rwanda-first furnished stays, reserved with confidence.
          </div>
        </div>
      </div>
    </footer>
  );
}
