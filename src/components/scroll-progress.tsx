"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/** Slim gold reading-progress bar pinned to the top of public pages. */
export function ScrollProgress() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.4 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setShowTop(latest > 0.15);
    });
  }, [scrollYProgress]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="page-progress"
      />
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full bg-[var(--ink)] text-[var(--gold)] shadow-[0_10px_30px_rgba(20,34,58,0.2)] transition-colors hover:bg-[var(--ink-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
