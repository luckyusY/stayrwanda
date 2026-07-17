"use client";

import { AnimatePresence, motion } from "framer-motion";

export function SlotCounter({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-6 w-6 overflow-hidden text-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center font-medium"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
