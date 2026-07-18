"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticCursor() {
  const [mounted, setMounted] = useState(false);
  const [cursorType, setCursorType] = useState<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 450, mass: 0.35 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const mountFrame = window.requestAnimationFrame(() => setMounted(true));
    
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      return () => window.cancelAnimationFrame(mountFrame);
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("[data-cursor]");
      if (interactive) {
        setCursorType(interactive.getAttribute("data-cursor"));
      } else if (
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button")
      ) {
        setCursorType("hover");
      } else {
        setCursorType(null);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.cancelAnimationFrame(mountFrame);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const isExplore = cursorType === "explore";
  const isBook = cursorType === "book";
  const isHover = cursorType === "hover";

  const size = isExplore || isBook ? 72 : isHover ? 32 : 12;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none rounded-full flex items-center justify-center"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: isHover ? "var(--gold)" : isExplore || isBook ? "var(--ink)" : "transparent",
        borderColor: isHover || isExplore || isBook ? "transparent" : "var(--gold)",
        borderWidth: isHover || isExplore || isBook ? 0 : 2,
        borderStyle: "solid",
        zIndex: 9999,
        mixBlendMode: isHover ? "difference" : "normal",
      }}
    >
      {(isExplore || isBook) && (
        <span className="text-white text-[9px] font-bold tracking-wider uppercase select-none">
          {cursorType}
        </span>
      )}
    </motion.div>
  );
}
