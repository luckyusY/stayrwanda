"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/smart-image";

type Props = {
  images: string[];
  alt: string;
  href: string;
  sizes?: string;
  aspect?: string;
  priority?: boolean;
  max?: number;
};

export function PropertyImageSlider({ images, alt, href, sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw", aspect = "aspect-[4/3]", priority = false, max = 8 }: Props) {
  const slides = (images ?? []).filter(Boolean).slice(0, max);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pointerStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const [index, setIndex] = useState(0);

  const goTo = (next: number) => {
    const safe = Math.max(0, Math.min(slides.length - 1, next));
    trackRef.current?.scrollTo({ left: safe * trackRef.current.clientWidth, behavior: "smooth" });
  };

  if (slides.length <= 1) {
    return <Link href={href} className={`relative block w-full ${aspect} overflow-hidden bg-[var(--cream-2)]`}>{slides[0] && <SmartImage src={slides[0]} alt={alt} fill priority={priority} className="object-cover transition duration-700 hover:scale-105" sizes={sizes} />}</Link>;
  }

  return (
    <div className={`group/slider relative w-full ${aspect} overflow-hidden bg-[var(--cream-2)]`}>
      <div
        ref={trackRef}
        className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(event) => { const width = event.currentTarget.clientWidth; if (width) setIndex(Math.round(event.currentTarget.scrollLeft / width)); }}
        onPointerDown={(event) => { pointerStart.current = event.clientX; dragged.current = false; }}
        onPointerMove={(event) => { if (pointerStart.current !== null && Math.abs(event.clientX - pointerStart.current) > 8) dragged.current = true; }}
        onPointerCancel={() => { pointerStart.current = null; dragged.current = false; }}
        aria-label={`${alt} photo gallery`}
      >
        {slides.map((src, photoIndex) => (
          <div key={`${src}-${photoIndex}`} className="relative h-full w-full shrink-0 snap-center">
            <Link href={href} className="relative block h-full w-full" onClick={(event) => { if (dragged.current) event.preventDefault(); dragged.current = false; pointerStart.current = null; }}>
              <SmartImage src={src} alt={`${alt} — photo ${photoIndex + 1}`} fill priority={priority && photoIndex === 0} className="object-cover transition duration-700 group-hover/slider:scale-[1.03]" sizes={sizes} />
            </Link>
          </div>
        ))}
      </div>
      <button type="button" aria-label="Previous photo" onClick={(event) => { event.preventDefault(); goTo(index - 1); }} disabled={index === 0} className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/95 text-[var(--ink)] shadow-[0_5px_18px_rgba(20,34,58,.28)] backdrop-blur-sm transition hover:scale-105 hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:size-10"><ChevronLeft size={19} /></button>
      <button type="button" aria-label="Next photo" onClick={(event) => { event.preventDefault(); goTo(index + 1); }} disabled={index === slides.length - 1} className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/95 text-[var(--ink)] shadow-[0_5px_18px_rgba(20,34,58,.28)] backdrop-blur-sm transition hover:scale-105 hover:bg-white disabled:pointer-events-none disabled:opacity-0 sm:size-10"><ChevronRight size={19} /></button>
      <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/55 px-2.5 py-1 text-[0.7rem] font-medium text-white">{index + 1} / {slides.length}</span>
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1" aria-hidden>{slides.map((_, dot) => <span key={dot} className={`size-1.5 rounded-full ${dot === index ? "bg-white" : "bg-white/45"}`} />)}</div>
    </div>
  );
}
