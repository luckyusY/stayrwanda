"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronDown, MapPin, Menu, Search, Users, X } from "lucide-react";
import { EASE, softSpring } from "@/lib/motion";
import { CurrencyControl } from "@/components/currency-provider";
import { AccountPopout } from "@/components/account-popout";
import { NotificationPopout } from "@/components/notification-popout";
import { LanguageControl } from "@/components/language-control";
import { useOverlayLayer } from "@/components/overlay-stack";

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
  variant?: "solid" | "transparent" | "white";
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const drawerLayer = useOverlayLayer(open);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((res) => res.json())
      .then((data) => setIsAdmin(!!data.isAdmin))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && drawerLayer.isTop()) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    requestAnimationFrame(() => drawerRef.current?.focus({ preventScroll: true }));
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [drawerLayer, open]);

  const closeMenu = () => {
    setOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }));
  };

  const onLight = variant === "transparent" && !scrolled; // white logo/text over the hero image
  // Only the home (transparent) header shrinks — inner pages keep a fixed
  // height so their sticky sub-navigation stays aligned.
  const compact = variant === "transparent" && scrolled;

  // Highlight the first nav item that matches the current route (ignores query).
  const activeIndex = NAV.findIndex((item) => pathname && pathname !== "/" && (pathname === item.href || pathname.startsWith(`${item.href}/`)));

  return (
    <header
      className={
        variant === "transparent"
          ? `${scrolled ? "fixed header-frost shadow-[0_8px_30px_rgba(20,34,58,0.06)]" : "absolute"} inset-x-0 top-0 z-50`
          : variant === "white"
            ? "sticky top-0 z-50 border-b border-[var(--line)] bg-white shadow-[0_5px_18px_rgba(20,34,58,.05)]"
            : "sticky top-0 z-50 header-frost"
      }
    >
      {isAdmin && (
        <div className="bg-gradient-to-r from-[var(--ink)] via-[var(--gold-deep)] to-[var(--ink)] py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          Admin connected ·{" "}
          <Link href="/admin" className="underline hover:text-[var(--gold-pale)]">
            Dashboard
          </Link>{" "}
          ·{" "}
          <Link href="/admin-status" className="underline hover:text-[var(--gold-pale)]">
            Check Status
          </Link>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between gap-2 transition-[height] duration-300 sm:gap-4 ${
            compact ? "h-16" : "h-20"
          }`}
        >
          <Wordmark light={onLight} imgClass={compact ? "h-12" : "h-10 min-[360px]:h-12 sm:h-16"} />

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
          <div className="flex items-center gap-1 sm:gap-2">
            <CurrencyControl light={onLight} />
            <LanguageControl light={onLight} />
            <div className="mx-0.5 hidden h-5 w-px bg-current opacity-20 sm:block" />
            <div className="hidden sm:block">
              <NotificationPopout light={onLight} />
            </div>
            <AccountPopout light={onLight} />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              className={`ml-0.5 flex size-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg lg:hidden ${
                onLight ? "text-white hover:bg-white/10" : "text-[var(--ink)] hover:bg-[var(--parchment)]"
              }`}
              aria-label="Open menu"
              aria-controls="mobile-main-menu"
              aria-expanded={open}
            >
              <Menu size={22} />
              <span className="text-[8px] font-bold uppercase leading-none tracking-[0.06em]">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer is portalled so sticky/fixed header geometry cannot clip it. */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
          <motion.div
            className="fixed inset-0 z-[var(--z-toast)] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="absolute inset-0 bg-[var(--ink)]/50 backdrop-blur-sm" onClick={() => drawerLayer.isTop() && closeMenu()} />
            <motion.nav
              ref={drawerRef}
              id="mobile-main-menu"
              tabIndex={-1}
              className="surface-3d-floating absolute inset-y-0 right-0 flex h-[100dvh] max-h-[100dvh] w-80 max-w-[88vw] touch-pan-y flex-col overflow-y-auto overscroll-contain !rounded-none border-y-0 border-r-0 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] outline-none [-webkit-overflow-scrolling:touch]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={softSpring}
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
            >
              <div className="mb-6 flex items-center justify-between">
                <Wordmark imgClass="h-12" />
                <button
                  type="button"
                  onClick={closeMenu}
                  className="grid size-11 place-items-center text-[var(--ink)]"
                  aria-label="Close menu"
                >
                  <X />
                </button>
              </div>

              {/* Quick account actions on mobile drawer */}
              <div className="mb-6 grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="button-3d flex items-center justify-center bg-[var(--ink)] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
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
                      onClick={closeMenu}
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
                  onClick={closeMenu}
                  className="block text-sm font-medium text-[var(--ink)] hover:text-[var(--gold-deep)]"
                >
                  My bookings
                </Link>
                <Link
                  href="/help"
                  onClick={closeMenu}
                  className="block text-sm font-medium text-[var(--ink)] hover:text-[var(--gold-deep)]"
                >
                  Help centre
                </Link>
              </div>
            </motion.nav>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  );
}

export function CompactSearch({ destination = "Kigali" }: { destination?: string }) {
  const [place, setPlace] = useState(destination);
  return (
    <div className="bg-[var(--cream)] py-4 sm:py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="surface-3d-floating search-mobile-stack grid grid-cols-1 gap-2 overflow-hidden p-2 md:grid-cols-[1.3fr_1.1fr_1fr_auto] md:gap-px md:bg-[var(--line)] md:p-0">
          <label className="flex min-h-14 min-w-0 cursor-text items-center gap-3 bg-white px-3 py-2 transition-colors focus-within:bg-[var(--parchment)] sm:min-h-15 sm:px-4 md:rounded-none">
            <MapPin size={20} className="shrink-0 text-[var(--gold-deep)]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Destination
              </span>
              <span className="search-field-well mt-1 flex items-center gap-2 px-2.5 py-1.5">
                <input
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  className="search-field-input min-h-[1.35rem] text-base sm:text-sm"
                  placeholder="Type a city or area…"
                  autoComplete="off"
                  enterKeyHint="search"
                />
              </span>
            </span>
          </label>
          <div className="flex min-h-14 min-w-0 flex-col gap-2 bg-white px-3 py-2 sm:min-h-15 sm:flex-row sm:items-center sm:gap-2 sm:px-4 md:rounded-none">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <CalendarDays size={20} className="shrink-0 text-[var(--gold-deep)]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Check-in
                </span>
                <input
                  type="date"
                  className="search-field-input mt-0.5 w-full min-w-0 text-base sm:text-xs"
                />
              </span>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:border-l sm:border-[var(--line)] sm:pl-2">
              <span className="min-w-0 flex-1 sm:pl-1">
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Check-out
                </span>
                <input
                  type="date"
                  className="search-field-input mt-0.5 w-full min-w-0 text-base sm:text-xs"
                />
              </span>
            </div>
          </div>
          <button
            type="button"
            className="flex min-h-14 items-center gap-3 bg-white px-3 py-2 text-left text-sm text-[var(--ink)] sm:min-h-15 sm:px-4 md:rounded-none"
          >
            <Users size={20} className="shrink-0 text-[var(--gold-deep)]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Guests
              </span>
              <span className="mt-0.5 block font-medium">2 guests · 1 room</span>
            </span>
            <ChevronDown size={15} className="text-[var(--muted)]" />
          </button>
          <Link
            href={`/search?destination=${encodeURIComponent(place)}`}
            className="button-3d flex min-h-12 items-center justify-center gap-2 bg-[var(--ink)] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[var(--ink-2)] sm:min-h-15 md:!rounded-none"
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
          <div className="surface-3d mx-auto mt-6 flex flex-col xs:flex-row max-w-md gap-px overflow-hidden bg-[var(--line)]">
            <input
              className="min-h-13 flex-1 bg-white px-4 text-sm outline-none w-full"
              placeholder="Your email address"
            />
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-newsletter"))}
              className="button-3d !rounded-none bg-[var(--gold)] px-6 py-3.5 xs:py-0 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--gold-deep)] shimmer-gold w-full xs:w-auto"
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
