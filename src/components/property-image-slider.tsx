"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import "swiper/css";
import "swiper/css/pagination";

type Props = {
  images: string[];
  alt: string;
  href: string;
  sizes?: string;
  aspect?: string;
  priority?: boolean;
  /** Hard cap on how many slides we mount per card, for performance. */
  max?: number;
};

const goldBullets = {
  "--swiper-pagination-color": "#ffffff",
  "--swiper-pagination-bullet-inactive-color": "#ffffff",
  "--swiper-pagination-bullet-inactive-opacity": "0.5",
  "--swiper-pagination-bullet-size": "7px",
} as React.CSSProperties;

export function PropertyImageSlider({
  images,
  alt,
  href,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  aspect = "aspect-[4/3]",
  priority = false,
  max = 8,
}: Props) {
  const list = (images ?? []).filter(Boolean);
  const slides = list.slice(0, max);
  const swiperRef = useRef<SwiperClass | null>(null);
  const [index, setIndex] = useState(0);

  // Single (or no) image — render a plain linked cover, no controls.
  if (slides.length <= 1) {
    return (
      <Link href={href} className={`relative block w-full ${aspect} overflow-hidden bg-[var(--cream-2)]`}>
        {slides[0] && (
          <SmartImage
            src={slides[0]}
            alt={alt}
            fill
            priority={priority}
            className="object-cover transition duration-700 hover:scale-105"
            sizes={sizes}
          />
        )}
      </Link>
    );
  }

  return (
    <div className={`group/slider relative w-full ${aspect} overflow-hidden bg-[var(--cream-2)]`} style={goldBullets}>
      <Swiper
        modules={[Pagination, Keyboard, A11y]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setIndex(swiper.realIndex)}
        pagination={{ clickable: true, dynamicBullets: true }}
        keyboard={{ enabled: true }}
        loop
        className="absolute inset-0 h-full w-full"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={src}>
            <Link href={href} className="relative block h-full w-full">
              <SmartImage
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                fill
                priority={priority && i === 0}
                className="object-cover transition duration-700 group-hover/slider:scale-[1.03]"
                sizes={sizes}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Prev / next controls — appear on hover, fade for touch */}
      <button
        type="button"
        aria-label="Previous photo"
        onClick={(event) => {
          event.preventDefault();
          swiperRef.current?.slidePrev();
        }}
        className="absolute left-3 top-1/2 z-20 grid size-11 sm:size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--ink)] opacity-100 sm:opacity-0 shadow transition hover:bg-white group-hover/slider:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={(event) => {
          event.preventDefault();
          swiperRef.current?.slideNext();
        }}
        className="absolute right-3 top-1/2 z-20 grid size-11 sm:size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--ink)] opacity-100 sm:opacity-0 shadow transition hover:bg-white group-hover/slider:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* Photo counter */}
      <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/55 px-2.5 py-1 text-[0.7rem] font-medium text-white">
        {index + 1} / {slides.length}
      </span>
    </div>
  );
}
