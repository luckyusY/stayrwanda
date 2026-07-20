"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import { PriceDisplay } from "@/components/price-display";
import type { Property } from "@/lib/properties";

const FEATURED = ["kibagabaga-apartment-one", "kimironko-twin-apartment", "kagarama-furnished-residence", "tg-executive-apartment"];
const HEADLINES: Record<string, string> = {
  "kibagabaga-apartment-one": "Stay in Kibagabaga",
  "kimironko-twin-apartment": "Stay in Kimironko",
  "kagarama-furnished-residence": "Stay in Kagarama",
  "tg-executive-apartment": "Stay in Kigali",
};

export function HeroSlideshow({ properties }: { properties: Property[] }) {
  const slides = useMemo(() => {
    const selected = FEATURED.map((slug) => properties.find((property) => property.slug === slug)).filter(Boolean) as Property[];
    return [...selected, ...properties.filter((property) => !selected.some((slide) => slide.slug === property.slug))].slice(0, 4);
  }, [properties]);
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const changeSlide = useCallback((next: number) => {
    if (slides.length < 2) return;
    const safe = (next + slides.length) % slides.length;
    setIndex((current) => {
      if (current === safe) return current;
      setPrevious(current);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => setPrevious(null), 900);
      return safe;
    });
  }, [slides.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || !pageVisible || slides.length < 2) return;
    const interval = setInterval(() => changeSlide(index + 1), 6_000);
    return () => clearInterval(interval);
  }, [changeSlide, index, pageVisible, paused, reducedMotion, slides.length]);

  if (!slides.length) return <div className="h-[64dvh] min-h-[500px] bg-[var(--ink)]" />;
  const nextIndex = (index + 1) % slides.length;
  const current = slides[index];

  return (
    <section className="relative h-[60dvh] min-h-[460px] max-h-[680px] overflow-hidden bg-[var(--ink)] text-white sm:h-[68dvh] sm:min-h-[520px]" aria-roledescription="carousel" aria-label="Featured StayRwanda properties" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; setPaused(true); }} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX; if (touchStart.current !== null && end !== undefined) { const distance = end - touchStart.current; if (Math.abs(distance) > 45) changeSlide(index + (distance < 0 ? 1 : -1)); } touchStart.current = null; setPaused(false); }}>
      {slides.map((slide, slideIndex) => {
        const mounted = slideIndex === index || slideIndex === previous || slideIndex === nextIndex;
        if (!mounted) return null;
        return <div key={slide.slug} className={`absolute inset-0 transition-opacity duration-700 ${slideIndex === index ? "z-10 opacity-100" : "z-0 opacity-0"}`} aria-hidden={slideIndex !== index}><SmartImage src={slide.image} alt={slide.title} fill priority={slideIndex === 0} className="object-cover" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/35 to-black/5 sm:bg-gradient-to-r sm:from-[var(--ink)]/90 sm:via-[var(--ink)]/40 sm:to-transparent" /></div>;
      })}
      <div className="absolute inset-0 z-20 flex items-end sm:items-center">
        <div className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-8">
          <div className="max-w-xl [text-shadow:0_2px_18px_rgba(0,0,0,.35)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold)] sm:text-xs">Featured stay</p>
            <h1 className="mt-2 font-serif text-[2.35rem] font-semibold leading-[0.98] tracking-[-0.025em] sm:mt-3 sm:text-6xl lg:text-7xl">
              {HEADLINES[current.slug] || `Stay in ${current.neighborhood}`}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-white/90 sm:mt-4 sm:text-base">
              <MapPin size={16} className="shrink-0 text-[var(--gold)]" />
              <span className="line-clamp-1">{current.title}</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 sm:mt-5">
              <PriceDisplay amountRwf={current.price} className="font-serif text-lg font-semibold text-white sm:text-xl" />
              <Link href={`/stays/${current.slug}`} className="button-3d inline-flex min-h-11 items-center justify-center bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink)] sm:min-h-12 sm:px-6 sm:text-xs">View stay</Link>
            </div>
          </div>
        </div>
      </div>
      <button type="button" onClick={() => changeSlide(index - 1)} aria-label="Previous featured property" className="absolute left-5 top-1/2 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 sm:grid"><ChevronLeft /></button>
      <button type="button" onClick={() => changeSlide(index + 1)} aria-label="Next featured property" className="absolute right-5 top-1/2 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 sm:grid"><ChevronRight /></button>
      <div className="absolute bottom-7 left-5 z-30 flex gap-2 sm:bottom-7 sm:left-1/2 sm:-translate-x-1/2" role="tablist" aria-label="Featured properties">{slides.map((slide, slideIndex) => <button key={slide.slug} type="button" onClick={() => changeSlide(slideIndex)} role="tab" aria-selected={slideIndex === index} aria-label={`Show ${slide.title}`} className={`h-2 rounded-full transition-[width,background-color] ${slideIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"}`} />)}</div>
    </section>
  );
}
