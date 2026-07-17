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
  Users,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SmartImage } from "@/components/smart-image";
import { PropertyImageSlider } from "@/components/property-image-slider";
import { Reveal, RevealGroup } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
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

  // Subtle GSAP parallax on the hero image as the page scrolls.
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
    <main className="min-h-screen overflow-x-hidden bg-white text-[var(--foreground)]">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative">
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

            {/* A3. Hero Stat Strip */}
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
          href="#properties"
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
                  <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    Destination
                  </span>
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
                  <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    Dates
                  </span>
                  <span className="flex items-center gap-2">
                    <input type="date" className="w-[104px] min-w-0 text-xs font-medium outline-none" />
                    <span className="text-[var(--muted)]">—</span>
                    <input type="date" className="w-[104px] min-w-0 text-xs font-medium outline-none" />
                  </span>
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setGuestOpen(!guestOpen)}
                  aria-expanded={guestOpen}
                  className="flex min-h-16 w-full items-center gap-3 bg-white px-5 text-left transition-colors hover:bg-[var(--parchment)]"
                >
                  <Users size={20} className="shrink-0 text-[var(--gold-deep)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.65rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Guests
                    </span>
                    <span className="block truncate text-sm font-medium">
                      {adults} adults · {children} children · {rooms} room
                    </span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[var(--muted)] transition-transform duration-300 ${guestOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {guestOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setGuestOpen(false)} aria-hidden />
                      <motion.div
                        className="surface-3d-floating absolute right-0 top-[calc(100%+10px)] z-50 w-full min-w-72 p-5 text-[var(--foreground)]"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={softSpring}
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
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

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

      {/* -------------------------------------------------------- Brand intro */}
      <Reveal as="section" className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="eyebrow">A different kind of stay</p>
        <div className="mx-auto mt-4 rule-gold" />
        <h2 className="mt-6 font-serif text-3xl font-semibold leading-snug text-[var(--ink)] sm:text-4xl">
          Every residence is visited, photographed and quietly verified — so the home you book is the home you arrive to.
        </h2>
        <p className="mt-6 text-[var(--muted)]">
          StayRwanda is a Rwanda-first collection of furnished homes, with local hosts and local support
          from the first message to checkout.
        </p>
      </Reveal>

      {/* --------------------------------------------------- Featured stays */}
      <section id="properties" className="bg-[var(--parchment)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">
                Residences guests treasure
              </h2>
            </div>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="field-3d px-4 py-3 text-sm outline-none"
            >
              {stayTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

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
                onClick={() => {
                  setQuery("");
                  setType("All stays");
                }}
                className="button-3d mt-5 bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                See all stays
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ----------------------------------------------------- Destinations */}
      <section id="explore" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">Where to stay</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">Explore Rwanda</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">Neighbourhoods our guests return to</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {neighborhoods.map((destination, index) => {
            const property =
              properties.find((item) => item.neighborhood === destination) ?? properties[index];
            const count = properties.filter(
              (item) => destination === "Kigali" || item.neighborhood === destination,
            ).length;
            return (
              <TiltCard key={destination} strength={8} className="w-full">
                <button
                  onClick={() => chooseDestination(destination)}
                  className="surface-3d surface-3d-lift group relative aspect-[3/4] w-full overflow-hidden text-left image-shade"
                  data-cursor="explore"
                >
                  <SmartImage
                    src={property.image}
                    alt={destination}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                    <h3 className="font-serif text-2xl font-semibold">{destination}</h3>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/80">{count} residences</p>
                  </div>
                </button>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------- Assurances */}
      <section className="bg-[var(--ink)] py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="eyebrow !text-[var(--gold)]">The StayRwanda promise</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Considered in every detail</h2>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [ShieldCheck, "Verified residences", "Each home is visited and documented before it joins the collection."],
              [ConciergeBell, "Local hosts", "Rwanda-based hosts and support, from first enquiry to farewell."],
              [KeyRound, "No prepayment", "Reserve with a free request — rates and terms confirmed by your host."],
              [Sparkles, "Quietly curated", "A small, deliberate collection rather than an endless catalogue."],
            ].map(([Icon, title, copy]) => {
              const C = Icon as typeof ShieldCheck;
              return (
                <div key={String(title)} className="text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-full border border-[var(--gold)]/40 text-[var(--gold)]">
                    <C size={24} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{String(copy)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Property types */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">Find your fit</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">Browse by style of stay</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Furnished apartments", image: properties[0]?.image, value: "Furnished apartment" },
            {
              label: "Serviced apartments",
              image: properties.find((item) => item.type === "Serviced apartment")?.image,
              value: "Serviced apartment",
            },
            {
              label: "Private residences",
              image: properties.find((item) => item.type === "Furnished home")?.image,
              value: "Furnished home",
            },
            { label: "Long stays", image: properties[5]?.image ?? properties[1]?.image, value: "All stays" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setType(item.value);
                runSearch();
              }}
              className="surface-3d surface-3d-lift group relative aspect-[4/5] overflow-hidden text-left image-shade"
            >
              <SmartImage
                src={item.image ?? properties[0].image}
                alt={item.label}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <h3 className="absolute inset-x-0 bottom-0 z-10 p-5 font-serif text-xl font-semibold text-white">
                {item.label}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ Members band */}
      <section className="bg-[var(--cream)] py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <p className="eyebrow">StayRwanda account</p>
          <h2 className="font-serif text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
            Save the homes you love, manage every request
          </h2>
          <p className="max-w-xl text-sm text-[var(--muted)]">
            Create an account to keep a private list of favourite residences and follow your booking
            requests in one place.
          </p>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="button-3d bg-[var(--ink)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-2)]"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="interactive-3d !border-[var(--gold)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)] hover:bg-[var(--gold)] hover:text-white"
            >
              Create account
            </Link>
          </div>
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
