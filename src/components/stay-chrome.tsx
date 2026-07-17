"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { softSpring } from "@/lib/motion";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "rooms", label: "Accommodation" },
  { id: "amenities", label: "Facilities" },
  { id: "location", label: "Location" },
] as const;

/** Sticky sub-navigation with IntersectionObserver scroll-spy and sliding underline. */
export function StaySectionNav() {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-20 z-30 grid grid-cols-4 border-y border-[var(--line)] header-frost text-center text-xs font-semibold uppercase tracking-[0.12em] rounded-lg overflow-hidden shadow-sm">
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? "true" : undefined}
            className={`relative px-2 py-4 transition-colors duration-300 ${
              isActive ? "text-[var(--gold-deep)]" : "text-[var(--ink)] hover:text-[var(--gold-deep)]"
            }`}
          >
            {s.label}
            {isActive && (
              <motion.span
                layoutId="activeSectionNavIndicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--gold)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}

/** Slim reserve bar that slides up once the guest scrolls past the hero. */
export function StayReserveBar({
  slug,
  title,
  neighborhood,
}: {
  slug: string;
  title: string;
  neighborhood: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 680);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 96 }}
          animate={{ y: 0 }}
          exit={{ y: 96 }}
          transition={softSpring}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] header-frost shadow-[0_-8px_30px_rgba(20,34,58,0.06)]"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-semibold text-[var(--ink)]">{title}</p>
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                {neighborhood} · Rates on request
              </p>
            </div>
            <Link
              href={`/booking/${slug}`}
              className="button-3d shrink-0 bg-[var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[var(--ink-2)]"
            >
              Reserve
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
