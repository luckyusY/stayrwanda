"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Counts up to `value` once scrolled into view. */
export function CountUp({ value, duration = 1.1 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          animate(0, value, {
            duration,
            ease: EASE,
            onUpdate: (v) => setDisplay(Math.round(v)),
          });
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}
