"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

// Gentle cross-page fade. Opacity only — never transform — so sticky headers
// and fixed/portal elements keep working.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: EASE }}>
      {children}
    </motion.div>
  );
}
