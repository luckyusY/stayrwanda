"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronDown, Globe2, MapPin, Menu, Search, Users, X, BedDouble, Home, Building2, Tag, PlusSquare, Bell, UserCircle2 } from "lucide-react";
import { EASE, softSpring } from "@/lib/motion";
import { CurrencyControl } from "@/components/currency-provider";
import { AccountPopout } from "@/components/account-popout";
import { NotificationPopout } from "@/components/notification-popout";
import { SearchCommand } from "@/components/search-command";

const NAV = [
  { label: "Stays", href: "/stays", icon: BedDouble },
  { label: "Residences", href: "/residences", icon: Home },
  { label: "Hotels", href: "/hotels", icon: Building2 },
  { label: "Destinations", href: "/destinations", icon: MapPin },
  { label: "Offers", href: "/offers", icon: Tag },
  { label: "List your property", href: "/list-property", icon: PlusSquare },
] as const;

export function Wordmark({ light = false, imgClass = "h-16" }: { light?: boolean; imgClass?: string }) {
  // Use a plain <img> for the brand mark so the global Cloudinary next/image
  // loader cannot interfere, and apply invert via inline style (reliable across
  // Tailwind v4 filter composition). Dark PNG on light chrome; white when light.
  return (
    <Link href="/" className="relative z-10 flex shrink-0 items-center" aria-label="StayRwanda home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/stayrwanda-logo.png"
        alt="StayRwanda — Your Home in Rwanda"
        width={1093}
        height={607}
        decoding="async"
        fetchPriority="high"
        className={`${imgClass} w-auto max-w-[min(220px,46vw)] object-contain transition-[height,filter,opacity] duration-300`}
        style={
          light
            ? {
                filter: "brightness(0) invert(1) drop-shadow(0 1px 3px rgba(0,0,0,.35))",
                WebkitFilter: "brightness(0) invert(1) drop-shadow(0 1px 3px rgba(0,0,0,.35))",
              }
            : { filter: "none", WebkitFilter: "none" }
        }
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onLight = variant === "transparent" && !scrolled; // white logo/text over the hero image
  // Only the home (transparent) header shrinks — inner pages keep a fixed
  // height so their sticky sub-navigation stays aligned.
  const compact = variant === "transparent" && scrolled;

  // Highlight the first nav item that matches the current route (ignores query).
  const activeIndex = NAV.findIndex((item) => pathname !== "/" && (pathname === item.href || pathname.startsWith(`${item.href}/`)));

  return (
    <header
      className={
        variant === "transparent"
          ? `${scrolled ? "fixed header-frost shadow-[0_8px_30px_rgba(20,34,58,0.06)]" : "absolute"} inset-x-0 top-0 z-50`
          : "sticky top-0 z-50 header-frost"
      }
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${
            compact ? "h-16" : "h-20"
          }`}
        >
          <Wordmark light={onLight} imgClass={compact ? "h-12" : "h-16"} />

          <div className="hidden flex-1 max-w-sm px-8 lg:block">
            <SearchCommand light={onLight} />
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={i === activeIndex ? "page" : undefined}
                className={`group relative flex items-center gap-1.5 text-sm font-medium tracking-wide ${
                  onLight ? "text-white/90 hover:text-white" : "text-[var(--ink)] hover:text-[var(--gold-deep)]"
                }`}
              >
                <item.icon size={15} className="icon-premium opacity-70 group-hover:opacity-100" />
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-[var(--gold)] transition-all duration-300 group-hover:w-full ${
                    i === activeIndex ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <CurrencyControl light={onLight} />
            <div className="h-4 w-px bg-current opacity-20" />
            <NotificationPopout light={onLight} />
            <AccountPopout light={onLight} />
          </div>

          <button
            onClick={() => setOpen(true)}
            className={`grid size-11 place-items-center lg:hidden ${onLight ? "text-white" : "text-[var(--ink)]"}`}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="absolute inset-0 bg-[var(--ink)]/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.nav
              className="surface-3d-floating absolute right-0 top-0 flex h-full w-80 max-w-[85%] flex-col !rounded-none border-y-0 border-r-0 p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={softSpring}
            >
              <div className="mb-8 flex items-center justify-between">
                <Wordmark imgClass="h-12" />
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center text-[var(--ink)]"
                  aria-label="Close menu"
                >
                  <X />
                </button>
              </div>
              <motion.ul
                className="flex flex-col"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              >
                {NAV.map((item) => (
                  <motion.li
                    key={item.label}
                    variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-4 border-b border-[var(--line)] py-4 font-serif text-2xl text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)]"
                      >
                        <item.icon size={24} className="text-[var(--gold)] opacity-80" />
                        {item.label}
                      </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="button-3d mt-auto bg-[var(--ink)] px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                Sign in
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function CompactSearch({ destination = "Kigali" }: { destination?: string }) {
  const [place, setPlace] = useState(destination);
  return (
    <div className="bg-[var(--cream)] py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="surface-3d-floating grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden bg-[var(--line)] md:grid-cols-[1.3fr_1.1fr_1fr_auto]">
          <label className="flex min-h-15 min-w-0 items-center gap-3 bg-white px-4 hover:bg-[var(--parchment)] transition-colors cursor-pointer">
            <MapPin size={20} className="shrink-0 text-[var(--gold-deep)]" />
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              className="min-w-0 flex-1 text-sm outline-none cursor-pointer bg-transparent"
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
            className="button-3d flex min-h-15 items-center justify-center gap-2 !rounded-none bg-[var(--ink)] px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[var(--ink-2)]"
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
    ["Destinations", [["Kigali", "/destinations/kigali"], ["Kibagabaga", "/destinations/kibagabaga"], ["Kimironko", "/destinations/kimironko"], ["Kagarama", "/destinations/kagarama"]]],
    ["Accommodation", [["All stays", "/stays"], ["Furnished residences", "/residences"], ["Hotels", "/hotels"], ["Offers", "/offers"]]],
    ["Support", [["Help centre", "/help"], ["Safety", "/safety"], ["Cancellation", "/cancellation"], ["Contact us", "/contact"]]],
    ["Partners", [["List your property", "/list-property"], ["Partner help", "/partner-help"], ["Property resources", "/property-resources"], ["Host dashboard", "/host"]]],
    ["About", [["About StayRwanda", "/about"], ["How we work", "/about#how"], ["Privacy", "/privacy"], ["Terms", "/terms"]]],
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
          <div className="surface-3d mx-auto mt-6 flex max-w-md gap-px overflow-hidden bg-[var(--line)]">
            <input
              className="min-h-13 flex-1 bg-white px-4 text-sm outline-none"
              placeholder="Your email address"
            />
            <button 
              onClick={() => window.dispatchEvent(new Event("open-newsletter"))}
              className="button-3d !rounded-none bg-[var(--gold)] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--gold-deep)] shimmer-gold"
            >
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
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-white/70 hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/50">
              © {new Date().getFullYear()} StayRwanda — Rwanda-first furnished stays, reserved with confidence.
            </div>
            <div className="flex items-center gap-5 text-white/40">
              <a href="#" className="text-xs font-medium hover:text-[var(--gold)] transition-colors">Instagram</a>
              <a href="#" className="text-xs font-medium hover:text-[var(--gold)] transition-colors">Twitter</a>
              <a href="#" className="text-xs font-medium hover:text-[var(--gold)] transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
