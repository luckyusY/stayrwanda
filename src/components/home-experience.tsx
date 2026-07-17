"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, maskUp, softSpring } from "@/lib/motion";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ConciergeBell,
  Heart,
  KeyRound,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SmartImage } from "@/components/smart-image";
import { PropertyImageSlider } from "@/components/property-image-slider";
import { Reveal, RevealGroup } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { Popout } from "@/components/popout";
import { SlotCounter } from "@/components/slot-counter";
import { CountUp } from "@/components/count-up";
import { DragScrollStrip } from "@/components/drag-scroll-strip";
import type { Property } from "@/lib/properties";

const stayTypes = ["All stays", "Furnished apartment", "Serviced apartment", "Furnished home"];
const neighborhoods = ["Kigali", "Kibagabaga", "Kimironko", "Kagarama"];

export function HomeExperience({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const [guestOpen, setGuestOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All stays");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [favourites, setFavourites] = useState<string[]>([]);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = heroImageRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  const filtered = useMemo(
    () =>
      properties.filter((property) => {
        const text = `${property.title} ${property.location} ${property.neighborhood}`.toLowerCase();
        return text.includes(query.toLowerCase()) && (type === "All stays" || property.type === type);
      }),
    [properties, query, type],
  );

  const toggleFavourite = (slug: string) =>
    setFavourites((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );

  const chooseDestination = (destination: string) =>
    router.push(`/search?destination=${encodeURIComponent(destination)}`);

  const runSearch = () => router.push(`/search?destination=${encodeURIComponent(query || "Kigali")}`);

  const hero = properties[0];

  return (
    <main className="canvas-grain min-h-screen overflow-x-hidden bg-white text-[var(--foreground)]">

      {/* ================================================================ S0 — HERO (diagonal wave bottom) */}
      <section className="relative section-wave" style={{ background: "var(--ink)" }}>
        <SiteHeader variant="transparent" />
        <div className="hero-veil relative h-[88vh] min-h-[620px] w-full overflow-hidden">
          <div ref={heroImageRef} className="absolute inset-0 -bottom-24 will-change-transform">
            <SmartImage
              src={hero.image}
              alt="A handpicked Rwandan residence"
              fill
              priority
              className="object-cover ken-burns"
              sizes="100vw"
            />
          </div>
        </div>

        <motion.div
          className="absolute inset-x-0 top-[35%] z-30 -translate-y-1/2"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }}
        >
          <div className="mx-auto max-w-6xl px-4 text-center text-white sm:px-6">
            <motion.p
              className="eyebrow !text-[var(--gold)]"
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Furnished stays · Rwanda
            </motion.p>
            <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              <span className="block overflow-hidden pb-1">
                <motion.span className="block" variants={maskUp}>
                  Stay somewhere
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1">
                <motion.span className="block italic text-gradient-gold" variants={maskUp}>
                  worth remembering
                </motion.span>
              </span>
            </h1>
            <motion.p
              className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              A curated collection of apartments, residences and guesthouses across Kigali and beyond.
            </motion.p>

            <motion.div
              className="mx-auto mt-8 max-w-md bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-xl grid grid-cols-3 divide-x divide-white/10 shadow-lg"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="text-center">
                <strong className="block text-2xl font-serif text-[var(--gold-mid)]"><CountUp value={120} />+</strong>
                <span className="text-[10px] uppercase tracking-wider text-white/80 block mt-1">Residences</span>
              </div>
              <div className="text-center">
                <strong className="block text-2xl font-serif text-[var(--gold-mid)]">4.9</strong>
                <span className="text-[10px] uppercase tracking-wider text-white/80 block mt-1">Guest rating</span>
              </div>
              <div className="text-center">
                <strong className="block text-2xl font-serif text-[var(--gold-mid)]"><CountUp value={50} />+</strong>
                <span className="text-[10px] uppercase tracking-wider text-white/80 block mt-1">Districts</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.a
          href="#brand-intro"
          aria-label="Scroll to explore"
          className="absolute bottom-[120px] left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
        >
          <span className="text-[0.6rem] uppercase tracking-[0.3em]">Explore</span>
          <span className="grid h-10 w-6 items-start justify-center rounded-full border border-white/40 pt-1.5">
            <span className="animate-scroll-cue block h-1.5 w-1.5 rounded-full bg-white/80" />
          </span>
        </motion.a>

        {/* Floating booking bar */}
        <motion.div
          className="relative z-30 mx-auto -mt-24 max-w-5xl px-4 sm:px-6"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
        >
          <div className="surface-3d-floating form-card-3d p-2">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-px bg-[var(--line)] md:grid-cols-[1.3fr_1.2fr_1fr_auto]">
              <label className="flex min-h-16 items-center gap-3 bg-white px-5 transition-colors focus-within:bg-[var(--parchment)]">
                <MapPin size={20} className="shrink-0 text-[var(--gold-deep)]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">Destination</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Where are you going?"
                    className="w-full text-sm font-medium outline-none placeholder:font-normal placeholder:text-[var(--muted)]"
                  />
                </span>
              </label>

              <div className="flex min-h-16 min-w-0 items-center gap-3 bg-white px-5 transition-colors focus-within:bg-[var(--parchment)]">
                <CalendarDays size={20} className="shrink-0 text-[var(--gold-deep)]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">Dates</span>
                  <span className="flex items-center gap-2">
                    <input type="date" className="w-[104px] min-w-0 text-xs font-medium outline-none" />
                    <span className="text-[var(--muted)]">—</span>
                    <input type="date" className="w-[104px] min-w-0 text-xs font-medium outline-none" />
                  </span>
                </span>
              </div>

              <Popout
                variant="dropdown"
                isOpen={guestOpen}
                onClose={() => setGuestOpen(false)}
                wrapperClassName="relative w-full"
                className="surface-3d-floating w-[320px] p-5 text-[var(--foreground)]"
                align="right"
                trigger={
                  <div
                    onClick={() => setGuestOpen(!guestOpen)}
                    aria-expanded={guestOpen}
                    className="flex min-h-16 w-full items-center gap-3 bg-white px-5 text-left transition-colors hover:bg-[var(--parchment)]"
                  >
                    <Users size={20} className="shrink-0 text-[var(--gold-deep)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">Guests</span>
                      <span className="block truncate text-sm font-medium">
                        {adults} adults · {children} children · {rooms} room
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[var(--muted)] transition-transform duration-300 ${guestOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                }
              >
                <Counter label="Adults" value={adults} min={1} setValue={setAdults} />
                <Counter label="Children" value={children} min={0} setValue={setChildren} />
                <Counter label="Rooms" value={rooms} min={1} setValue={setRooms} />
                <button
                  onClick={() => setGuestOpen(false)}
                  className="interactive-3d mt-2 w-full !border-[var(--gold)] py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)] hover:bg-[var(--gold)] hover:text-white"
                >
                  Done
                </button>
              </Popout>

              <button
                onClick={runSearch}
                className="button-3d flex min-h-16 items-center justify-center gap-2 bg-[var(--ink)] px-9 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[var(--ink-2)]"
              >
                <Search size={17} /> Search
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================================================================ S1 — EDITORIAL SPLIT (ink / parchment) */}
      <section id="brand-intro" className="split-section overflow-hidden">
        {/* Left: deep ink panel */}
        <div className="split-left relative flex flex-col justify-center px-10 py-20 lg:px-16 lg:py-24 overflow-hidden">
          {/* Decorative numeral */}
          <span className="float-numeral select-none" style={{ top: "-1rem", left: "-2rem", opacity: 0.6 }}>01</span>
          <Reveal>
            <p className="eyebrow !text-[var(--gold)] relative z-10">A different kind of stay</p>
            <div className="mt-4 h-px w-12 bg-[var(--gold)]" />
            <h2 className="relative z-10 mt-6 font-serif text-3xl font-semibold leading-snug text-white sm:text-4xl">
              Every residence is visited, photographed and quietly verified
            </h2>
          </Reveal>
        </div>
        {/* Right: parchment panel */}
        <div className="split-right flex flex-col justify-center px-10 py-20 lg:px-16 lg:py-24">
          <Reveal>
            <p className="text-[var(--muted)] text-base leading-relaxed">
              So the home you book is the home you arrive to. StayRwanda is a Rwanda-first collection of furnished homes, with local hosts and local support from the first message to checkout.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)] border-b border-[var(--gold)] pb-1 hover:text-[var(--ink)] transition-colors"
            >
              How we work →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ S2 — FEATURED STAYS (hatched sand, overhanging title) */}
      <section id="properties" className="section-stripe py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="eyebrow">The collection</p>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end mt-3">
              <h2 className="heading-overhang font-serif text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
                Residences guests{" "}
                <em className="italic text-gradient-gold not-italic">treasure</em>
              </h2>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="field-3d px-4 py-3 text-sm outline-none shrink-0"
              >
                {stayTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </Reveal>

          <div className="mt-10 overflow-hidden">
            <DragScrollStrip
              properties={filtered}
              favourites={favourites}
              toggleFavourite={toggleFavourite}
            />
          </div>

          {!filtered.length && (
            <div className="surface-3d mt-8 p-12 text-center">
              <Search className="mx-auto text-[var(--gold-deep)]" />
              <h3 className="mt-3 font-serif text-2xl text-[var(--ink)]">No exact matches</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">Try another neighbourhood or stay type.</p>
              <button
                onClick={() => { setQuery(""); setType("All stays"); }}
                className="button-3d mt-5 bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                See all stays
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ S3 — DESTINATIONS (masonry grid + dot-grid bg) */}
      <section id="explore" className="section-dot-grid py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <p className="eyebrow">Where to stay</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
              Explore <em className="italic text-gradient-gold">Rwanda</em>
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Neighbourhoods our guests return to</p>
          </Reveal>

          <div className="masonry-grid">
            {neighborhoods.map((destination, index) => {
              const property =
                properties.find((item) => item.neighborhood === destination) ?? properties[index];
              const count = properties.filter(
                (item) => destination === "Kigali" || item.neighborhood === destination,
              ).length;
              return (
                <TiltCard key={destination} strength={6} className="w-full h-full">
                  <button
                    onClick={() => chooseDestination(destination)}
                    className="surface-3d surface-3d-lift group relative w-full h-full overflow-hidden text-left"
                    data-cursor="explore"
                  >
                    <SmartImage
                      src={property.image}
                      alt={destination}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 767px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {/* Neighbourhood stat badge — slides up on hover */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 translate-y-0">
                      <h3 className="font-serif text-2xl font-semibold text-white">{destination}</h3>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/75 transform transition-all duration-300 group-hover:translate-y-0">
                        {count} residence{count !== 1 ? "s" : ""}
                      </p>
                      <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-[0.18em] bg-[var(--gold)] text-white px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore →
                      </span>
                    </div>
                  </button>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ S4 — ASSURANCES (staggered alternating + diagonal stripe watermark) */}
      <section className="relative overflow-hidden bg-[var(--ink)] py-24 text-white">
        {/* Diagonal stripe watermark */}
        <div className="diagonal-stripe-watermark" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <Reveal className="text-center mb-16">
            <p className="eyebrow !text-[var(--gold)]">The StayRwanda promise</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
              Considered in <em className="italic text-gradient-gold">every</em> detail
            </h2>
          </Reveal>
          <div className="assurance-grid">
            {[
              [ShieldCheck, "Verified residences", "Each home is visited and documented before it joins the collection."],
              [ConciergeBell, "Local hosts", "Rwanda-based hosts and support, from first enquiry to farewell."],
              [KeyRound, "No prepayment", "Reserve with a free request — rates and terms confirmed by your host."],
              [Sparkles, "Quietly curated", "A small, deliberate collection rather than an endless catalogue."],
            ].map(([Icon, title, copy], i) => {
              const C = Icon as typeof ShieldCheck;
              return (
                <Reveal key={String(title)} as="div" className="assurance-item">
                  <div className="icon-halo shrink-0 !bg-[rgba(176,141,87,0.12)] !border-[rgba(176,141,87,0.3)]">
                    <C size={22} className="text-[var(--gold-mid)]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold">{String(title)}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{String(copy)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ S5 — BROWSE BY STYLE (filmstrip contact sheet) */}
      <section className="section-stripe-dark py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center mb-12">
            <p className="eyebrow !text-[var(--gold-pale)]/60">Find your fit</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Browse by <em className="italic text-gradient-gold">style</em> of stay
            </h2>
          </Reveal>

          <div className="filmstrip-track">
            {[
              { label: "Furnished apartments", image: properties[0]?.image, value: "Furnished apartment" },
              { label: "Serviced apartments", image: properties.find((p) => p.type === "Serviced apartment")?.image, value: "Serviced apartment" },
              { label: "Private residences", image: properties.find((p) => p.type === "Furnished home")?.image, value: "Furnished home" },
              { label: "Long stays", image: properties[5]?.image ?? properties[1]?.image, value: "All stays" },
            ].map((item, i) => (
              <button
                key={item.label}
                onClick={() => { setType(item.value); runSearch(); }}
                className="filmstrip-tile group relative min-h-[220px]"
              >
                <SmartImage
                  src={item.image ?? properties[0].image}
                  alt={item.label}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Label capsule */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-md">
                    {item.label}
                  </span>
                </div>
                {/* Corner film-number badge */}
                <span className="absolute top-3 left-3 font-mono text-[10px] text-white/40 font-bold tracking-widest">
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ S6 — MEMBERS (dark split + particles + glass perk card) */}
      <section className="relative overflow-hidden bg-[var(--ink-2)] py-24">
        {/* Ambient particles */}
        {[
          { w: 6, h: 6, top: "15%", left: "8%", dur: "7s", delay: "0s" },
          { w: 4, h: 4, top: "60%", left: "14%", dur: "9s", delay: "1.2s" },
          { w: 8, h: 8, top: "35%", left: "22%", dur: "11s", delay: "0.6s" },
          { w: 3, h: 3, top: "75%", left: "5%", dur: "8s", delay: "2s" },
          { w: 5, h: 5, top: "20%", left: "30%", dur: "10s", delay: "0.3s" },
        ].map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              width: p.w, height: p.h,
              top: p.top, left: p.left,
              "--dur": p.dur, "--delay": p.delay,
              opacity: 0.4,
            } as React.CSSProperties}
          />
        ))}

        {/* Gold horizon line */}
        <div className="gold-horizon mx-auto max-w-5xl mb-16" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid gap-12 lg:grid-cols-[1fr_360px] items-center relative z-10">
          {/* Left — text */}
          <Reveal>
            <p className="eyebrow !text-[var(--gold)]">StayRwanda account</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl leading-tight">
              Save the homes you love,<br />
              <em className="italic text-gradient-gold">manage every request</em>
            </h2>
            <p className="mt-5 max-w-md text-sm text-white/65 leading-relaxed">
              Create an account to keep a private list of favourite residences and follow your booking requests in one place.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link
                href="/sign-in"
                className="button-3d rounded-full bg-[var(--gold)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--gold-deep)] shimmer-gold"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-white/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 hover:border-white hover:text-white transition-colors"
              >
                Create account
              </Link>
            </div>
          </Reveal>

          {/* Right — glass perk card */}
          <Reveal variant="depth">
            <div className="glass-ink rounded-2xl p-6 border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)] mb-4">Member benefits</p>
              {[
                [CheckCircle2, "Saved Wishlist", "Keep all your favourite residences in one private list."],
                [Star, "Priority Access", "Be first to see new listings before they go live."],
                [ShieldCheck, "Booking History", "Track all your requests and stay confirmations in one dashboard."],
              ].map(([Icon, title, copy]) => {
                const C = Icon as typeof CheckCircle2;
                return (
                  <div key={String(title)} className="member-perk">
                    <div className="member-perk-icon">
                      <C size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{String(title)}</p>
                      <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{String(copy)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Counter({
  label,
  value,
  min,
  setValue,
}: {
  label: string;
  value: number;
  min: number;
  setValue: (value: number) => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setValue(Math.max(min, value - 1))}
          disabled={value <= min}
          className="interactive-3d grid size-9 place-items-center !border-[var(--gold)] text-[var(--gold-deep)] disabled:border-[#ccc] disabled:text-[#ccc] disabled:shadow-none"
        >
          <Minus size={15} />
        </button>
        <SlotCounter value={value} />
        <button
          onClick={() => setValue(value + 1)}
          className="interactive-3d grid size-9 place-items-center !border-[var(--gold)] text-[var(--gold-deep)]"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
