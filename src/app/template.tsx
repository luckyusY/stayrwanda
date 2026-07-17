"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

// Gentle cross-page fade. Opacity only — never transform — so sticky headers
// and fixed/portal elements keep working.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
