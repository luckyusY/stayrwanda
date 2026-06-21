import type { Transition, Variants } from "framer-motion";

// Canonical easings — keep every animation on the same curve language.
export const EASE = [0.22, 1, 0.36, 1] as const; // decel, editorial
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const spring: Transition = { type: "spring", stiffness: 320, damping: 30, mass: 0.9 };
export const softSpring: Transition = { type: "spring", stiffness: 180, damping: 24 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** Mask-style heading reveal — child rises from a clipped baseline. */
export const maskUp: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

/** Parent that staggers its <motion> children's reveal. */
export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return { hidden: {}, show: { transition: { staggerChildren, delayChildren } } };
}

/** Standard in-view config so reveals only fire once, slightly early. */
export const inView = { once: true, margin: "-80px" } as const;
