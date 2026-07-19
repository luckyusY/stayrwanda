"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** No CSS filter — blur + whileInView is a known “blank page” failure mode on mobile Safari. */
const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  },
  rise: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  },
  depth: {
    hidden: { opacity: 0, y: 16, scale: 0.99 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease },
    },
  },
  wipe: {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.45, ease } },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 340, damping: 24 },
    },
  },
};

function usePreferInstantReveal() {
  const [instant, setInstant] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Coarse pointers (phones) — skip scroll-reveal so content never stays opacity:0
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setInstant(reduce || coarse);
  }, []);
  return instant;
}

/** Reveals its children on first scroll into view (desktop); paints immediately on mobile. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variant = "fade",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  variant?: "fade" | "rise" | "depth" | "wipe" | "pop";
}) {
  const instant = usePreferInstantReveal();
  const MotionTag = motion[as] as typeof motion.div;
  const activeVariants = variants[variant] || variants.fade;

  if (instant) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={activeVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -40px 0px" }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers the reveal of its direct <Reveal> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const instant = usePreferInstantReveal();

  if (instant) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05, margin: "0px 0px -40px 0px" }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  );
}
