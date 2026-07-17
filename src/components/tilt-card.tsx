"use client";

import { useRef, useEffect } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function TiltCard({ children, strength = 10, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable hover-tilt animations on mobile/tablet or systems with touch primary pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.transform = `perspective(600px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) scale(1.03)`;
    };

    const onLeave = () => {
      el.style.transform = "";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
