"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import { PriceDisplay } from "@/components/price-display";
import type { Property } from "@/lib/properties";

const FEATURED = ["kibagabaga-apartment-one", "kimironko-twin-apartment", "kagarama-furnished-residence", "tg-executive-apartment"];
const HEADLINES: Record<string, string> = {
  "kibagabaga-apartment-one": "Kibagabaga, quietly refined.",
  "kimironko-twin-apartment": "Settle into Kimironko.",
  "kagarama-furnished-residence": "Feel at home in Kagarama.",
  "tg-executive-apartment": "Kigali, made comfortable.",
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
    <section className="relative h-[68dvh] min-h-[500px] max-h-[760px] overflow-hidden bg-[var(--ink)] text-white" aria-roledescription="carousel" aria-label="Featured StayRwanda properties" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; setPaused(true); }} onTouchEnd={(event) => { const end = event.changedTouches[0]?.clientX; if (touchStart.current !== null && end !== undefined) { const distance = end - touchStart.current; if (Math.abs(distance) > 45) changeSlide(index + (distance < 0 ? 1 : -1)); } touchStart.current = null; setPaused(false); }}>
      {slides.map((slide, slideIndex) => {
        const mounted = slideIndex === index || slideIndex === previous || slideIndex === nextIndex;
        if (!mounted) return null;
        return <div key={slide.slug} className={`absolute inset-0 transition-opacity duration-700 ${slideIndex === index ? "z-10 opacity-100" : "z-0 opacity-0"}`} aria-hidden={slideIndex !== index}><SmartImage src={slide.image} alt={slide.title} fill priority={slideIndex === 0} className="object-cover" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/88 via-[var(--ink)]/45 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" /></div>;
      })}
      <div className="absolute inset-0 z-20 flex items-center"><div className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 sm:pb-8"><p className="eyebrow !text-[var(--gold)]">StayRwanda</p><h1 className="mt-4 max-w-2xl font-serif text-4xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">{HEADLINES[current.slug] || `Stay in ${current.neighborhood}.`}</h1><p className="mt-4 flex items-center gap-2 text-sm text-white/85"><MapPin size={15} className="text-[var(--gold)]" /> {current.title}</p><PriceDisplay amountRwf={current.price} className="mt-3 block font-serif text-xl font-semibold text-white" /><Link href={`/stays/${current.slug}`} className="button-3d mt-6 inline-flex min-h-12 items-center justify-center bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">View stay</Link></div></div>
      <button type="button" onClick={() => changeSlide(index - 1)} aria-label="Previous featured property" className="absolute left-5 top-1/2 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 sm:grid"><ChevronLeft /></button>
      <button type="button" onClick={() => changeSlide(index + 1)} aria-label="Next featured property" className="absolute right-5 top-1/2 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 sm:grid"><ChevronRight /></button>
      <div className="absolute bottom-14 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:bottom-7" role="tablist" aria-label="Featured properties">{slides.map((slide, slideIndex) => <button key={slide.slug} type="button" onClick={() => changeSlide(slideIndex)} role="tab" aria-selected={slideIndex === index} aria-label={`Show ${slide.title}`} className={`h-2 rounded-full transition-[width,background-color] ${slideIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"}`} />)}</div>
    </section>
  );
}
