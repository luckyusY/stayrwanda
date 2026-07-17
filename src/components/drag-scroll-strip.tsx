"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Property } from "@/lib/properties";
import Link from "next/link";
import { SmartImage } from "@/components/smart-image";
import { MapPin, Heart, ChevronRight } from "lucide-react";

export function DragScrollStrip({
  properties,
  favourites,
  toggleFavourite,
}: {
  properties: Property[];
  favourites: string[];
  toggleFavourite: (slug: string) => void;
}) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updateConstraints = () => {
      if (!constraintsRef.current || !scrollRef.current) return;
      const parentWidth = constraintsRef.current.offsetWidth;
      const childWidth = scrollRef.current.scrollWidth;
      setDragConstraints({
        left: Math.min(0, parentWidth - childWidth - 40),
        right: 0,
      });
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    
    // Run again slightly later to ensure DOM layout settles
    const timer = setTimeout(updateConstraints, 500);
    
    return () => {
      window.removeEventListener("resize", updateConstraints);
      clearTimeout(timer);
    };
  }, [properties]);

  return (
    <div className="relative w-full overflow-hidden" ref={constraintsRef}>
      <motion.div
        ref={scrollRef}
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.12}
        className="flex gap-6 pb-6 cursor-grab active:cursor-grabbing select-none"
        style={{ width: "max-content" }}
      >
        {properties.map((property) => (
          <article
            key={property.slug}
            className="surface-3d surface-3d-lift group w-[290px] sm:w-[320px] shrink-0 overflow-hidden"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <span className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-0.5 origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-500 group-hover:scale-x-100" />
              <SmartImage
                src={property.image}
                alt={property.title}
                fill
                className="pointer-events-none object-cover transition duration-700 group-hover:scale-105"
                sizes="320px"
              />
              <span className="pointer-events-none absolute left-4 top-4 z-30 bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">
                {property.type}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavourite(property.slug);
                }}
                className="absolute right-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-white/90 shadow"
                aria-label={`Save ${property.title}`}
              >
                <Heart
                  size={18}
                  fill={favourites.includes(property.slug) ? "#b08d57" : "transparent"}
                  className={favourites.includes(property.slug) ? "text-[var(--gold)]" : "text-[var(--ink)]"}
                />
              </button>
            </div>
            <div className="p-5">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                <MapPin size={13} className="text-[var(--gold-deep)]" /> {property.neighborhood}
              </p>
              <Link
                href={`/stays/${property.slug}`}
                className="mt-2 block font-serif text-xl font-semibold text-[var(--ink)] transition group-hover:text-[var(--gold-deep)]"
              >
                {property.title}
              </Link>
              <p className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  {property.photoCount} photos
                </span>
                <Link
                  href={`/stays/${property.slug}`}
                  className="group/cta inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] hover:text-[var(--ink)]"
                >
                  View stay <ChevronRight size={12} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </p>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}
