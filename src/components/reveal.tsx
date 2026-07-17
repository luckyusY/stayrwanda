"use client";

import { motion, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

const depthVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97, filter: "blur(3px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
};

/** Reveals its children on first scroll into view. */
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
  variant?: "fade" | "depth";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  const activeVariants = variant === "depth" ? depthVariants : fadeVariants;
  return (
    <MotionTag
      className={className}
      variants={activeVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease, delay }}
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
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  );
}
