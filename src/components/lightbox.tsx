/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation, Zoom } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/zoom";
import { useOverlayLayer } from "@/components/overlay-stack";

type Props = {
  images: string[];
  open: boolean;
  index: number;
  alt: string;
  onClose: () => void;
};

/** Fullscreen, swipeable, pinch/double-tap zoomable photo viewer. */
export function Lightbox({ images, open, index, alt, onClose }: Props) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [active, setActive] = useState(index);
  const [mounted, setMounted] = useState(false);
  const layer = useOverlayLayer(open);

  useEffect(() => setMounted(true), []);

  // The shared overlay stack owns scroll locking across nested layers.
  useEffect(() => {
    if (!open) return;
    setActive(index);
    swiperRef.current?.slideTo(index, 0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && layer.isTop()) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, onClose, layer]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} gallery`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 text-white sm:px-6">
        <span className="text-sm font-medium tracking-wide">
          {active + 1} / {images.length}
        </span>
        <span className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/60 sm:flex">
          <ZoomIn size={15} /> Double-tap or pinch to zoom
        </span>
        <button
          onClick={onClose}
          aria-label="Close gallery"
          className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={20} />
        </button>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1">
        <Swiper
          modules={[Zoom, Navigation, Keyboard, A11y]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.slideTo(index, 0);
          }}
          onSlideChange={(swiper) => setActive(swiper.activeIndex)}
          initialSlide={index}
          zoom={{ maxRatio: 4 }}
          keyboard={{ enabled: true }}
          navigation={{ prevEl: ".lb-prev", nextEl: ".lb-next" }}
          spaceBetween={24}
          className="h-full w-full"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`}>
              <div className="swiper-zoom-container h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${alt} — photo ${i + 1}`}
                  className="max-h-full max-w-full object-contain"
                  loading={Math.abs(i - active) <= 1 ? "eager" : "lazy"}
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 1 && (
          <>
            <button
              className="lb-prev absolute left-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-6"
              aria-label="Previous photo"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              className="lb-next absolute right-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-6"
              aria-label="Next photo"
            >
              <ChevronRight size={26} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Filmstrip */}
      {images.length > 1 && (
        <div className="bg-black/40 border-t border-white/10 px-4 py-3 overflow-x-auto flex justify-center select-none" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-2 max-w-full">
            {images.map((src, i) => (
              <button
                key={`${src}-thumb-${i}`}
                onClick={() => swiperRef.current?.slideTo(i)}
                className={`relative size-12 sm:size-16 rounded overflow-hidden transition-all duration-300 border-2 shrink-0 ${
                  active === i ? "border-[var(--gold)] scale-105" : "border-transparent opacity-50 hover:opacity-85"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`thumbnail ${i + 1}`}
                  className="h-full w-full object-cover pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
