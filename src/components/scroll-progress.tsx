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

  const hotelProfile = pathname?.startsWith("/hotels/");

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX }}
        className="page-progress"
      />
      <AnimatePresence>
        {showTop && !hotelProfile && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="back-to-top fixed bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px)+2rem)] right-3 z-[34] grid size-11 place-items-center rounded-full bg-[var(--ink)] text-[var(--gold)] shadow-[0_10px_30px_rgba(20,34,58,0.2)] transition-colors hover:bg-[var(--ink-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] md:bottom-6 md:right-6 md:z-40 md:size-12"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
