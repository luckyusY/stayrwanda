"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronDown, MapPin, Menu, Search, Users, X } from "lucide-react";
import { EASE, softSpring } from "@/lib/motion";
import { CurrencyControl } from "@/components/currency-provider";
import { AccountPopout } from "@/components/account-popout";
import { NotificationPopout } from "@/components/notification-popout";

/** Brand social glyphs (lucide no longer ships Facebook/Instagram/Twitter). */
function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}
function IconX({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4l6.5 8.2L4.3 20h2.4l5-6.1L16.8 20H20l-6.7-8.5L19.5 4h-2.4l-4.6 5.6L7.2 4H4z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-1.5c0-.8.4-1.5 1-1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

const NAV = [
  { label: "Stays", href: "/stays" },
  { label: "Residences", href: "/residences" },
  { label: "Hotels", href: "/hotels" },
  { label: "Destinations", href: "/destinations" },
  { label: "Offers", href: "/offers" },
  { label: "List your property", href: "/list-property", emphasize: true },
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

          {/* Text-only nav — no icons so labels stay crisp over photography */}
          <nav
            className="hidden items-center gap-1 lg:flex xl:gap-1.5"
            aria-label="Primary"
          >
            {NAV.map((item, i) => {
              const active = i === activeIndex;
              const emphasize = "emphasize" in item && item.emphasize;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "site-nav-link group relative whitespace-nowrap px-2.5 py-2 text-[13px] font-semibold tracking-[0.02em] transition-colors duration-200 xl:px-3 xl:text-sm",
                    emphasize ? "ml-1" : "",
                    onLight ? "site-nav-link--on-dark" : "site-nav-link--on-light",
                    onLight
                      ? active
                        ? "text-white"
                        : "text-white hover:text-white"
                      : active
                        ? "text-[var(--gold-deep)]"
                        : "text-[var(--ink)] hover:text-[var(--gold-deep)]",
                  ].join(" ")}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={[
                      "absolute bottom-0.5 left-2.5 right-2.5 h-[2px] origin-left rounded-full bg-[var(--gold)] transition-transform duration-300 ease-out xl:left-3 xl:right-3",
                      active || emphasize
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                      emphasize && !active ? "opacity-70" : "",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Always visible: currency · alerts · account (compact icons on mobile) */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <CurrencyControl light={onLight} />
            <div className="mx-0.5 hidden h-5 w-px bg-current opacity-20 sm:block" />
            <NotificationPopout light={onLight} />
            <AccountPopout light={onLight} />
            <button
              onClick={() => setOpen(true)}
              className={`ml-0.5 grid size-10 place-items-center rounded-lg lg:hidden ${
                onLight ? "text-white hover:bg-white/10" : "text-[var(--ink)] hover:bg-[var(--parchment)]"
              }`}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
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
              <div className="mb-6 flex items-center justify-between">
                <Wordmark imgClass="h-12" />
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center text-[var(--ink)]"
                  aria-label="Close menu"
                >
                  <X />
                </button>
              </div>

              {/* Quick account actions on mobile drawer */}
              <div className="mb-6 grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="button-3d flex items-center justify-center bg-[var(--ink)] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="interactive-3d flex items-center justify-center px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]"
                >
                  Register
                </Link>
              </div>
              <p className="mb-4 text-[11px] leading-relaxed text-[var(--muted)]">
                Use the <strong className="text-[var(--ink)]">bell</strong> and{" "}
                <strong className="text-[var(--ink)]">account</strong> icons in the header for notifications and
                sign-in.
              </p>

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
                      className="block border-b border-[var(--line)] py-4 font-serif text-2xl font-medium tracking-tight text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)]"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-auto space-y-2 border-t border-[var(--line)] pt-5">
                <Link
                  href="/account/bookings"
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-[var(--ink)] hover:text-[var(--gold-deep)]"
                >
                  My bookings
                </Link>
                <Link
                  href="/help"
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-[var(--ink)] hover:text-[var(--gold-deep)]"
                >
                  Help centre
                </Link>
              </div>
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
          <label className="flex min-h-15 min-w-0 cursor-text items-center gap-3 bg-white px-4 transition-colors focus-within:bg-[var(--parchment)]">
            <MapPin size={20} className="shrink-0 text-[var(--gold-deep)]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Destination
              </span>
              <span className="search-field-well mt-1 flex items-center gap-2 px-2.5 py-1.5">
                <input
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  className="search-field-input min-h-[1.35rem]"
                  placeholder="Type a city or area…"
                  autoComplete="off"
                />
              </span>
            </span>
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

  const socials = [
    { label: "Instagram", href: "https://instagram.com", Icon: IconInstagram },
    { label: "X (Twitter)", href: "https://x.com", Icon: IconX },
    { label: "Facebook", href: "https://facebook.com", Icon: IconFacebook },
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
              type="button"
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
                      <Link href={href} className="text-white/70 hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <div className="text-xs text-white/50">
              © {new Date().getFullYear()} StayRwanda — Rwanda-first furnished stays, reserved with confidence.
            </div>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[var(--gold)] hover:bg-white/5 hover:text-[var(--gold)]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
