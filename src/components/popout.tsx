"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EASE, softSpring } from "@/lib/motion";

type PopoutVariant = "dropdown" | "sheet" | "dialog";

interface PopoutProps {
  variant: PopoutVariant;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  title?: string;
  align?: "left" | "right" | "center";
}

export function Popout({ variant, trigger, isOpen: controlledIsOpen, onClose, children, className = "", wrapperClassName = "relative inline-block", title, align = "right" }: PopoutProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const handleClose = () => {
    if (!isControlled) setUncontrolledIsOpen(false);
    onClose?.();
  };

  const handleToggle = () => {
    if (open) handleClose();
    else if (!isControlled) setUncontrolledIsOpen(true);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // If clicking outside the whole container (including trigger), close it
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      // Lock body scroll for sheet and dialog
      if (variant !== "dropdown") {
        document.body.style.overflow = "hidden";
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      if (variant !== "dropdown") {
        document.body.style.overflow = "";
      }
    };
  }, [open, variant, handleClose]);

  // Focus trap on open
  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length) {
        (focusable[0] as HTMLElement).focus();
      } else {
        panelRef.current.focus();
      }
    }
  }, [open]);

  // Dropdown renders inline with its trigger
  if (variant === "dropdown") {
    const alignmentClasses = {
      left: "left-0",
      right: "right-0",
      center: "left-1/2 -translate-x-1/2"
    };

    return (
      <div className={wrapperClassName} ref={containerRef}>
        {trigger && (
          <div onClick={handleToggle} className="cursor-pointer">
            {trigger}
          </div>
        )}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={title || "Dropdown menu"}
              tabIndex={-1}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className={`popout-dropdown mt-2 w-max min-w-[240px] max-w-[320px] origin-top ${alignmentClasses[align]} ${className}`}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Sheet and Dialog render via portals or fixed overlays
  return (
    <>
      {trigger && (
        <div onClick={handleToggle} className="inline-block cursor-pointer">
          {trigger}
        </div>
      )}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[var(--z-modal)]" ref={containerRef}>
            <motion.div
              className="popout-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={handleClose}
            />
            
            {variant === "sheet" && (
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title || "Side panel"}
                tabIndex={-1}
                className={`popout-sheet flex flex-col ${className}`}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={softSpring}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--line)] bg-white/90 p-4 backdrop-blur">
                  <h2 className="font-serif text-xl font-semibold text-[var(--ink)]">{title}</h2>
                  <button onClick={handleClose} aria-label="Close panel" className="grid size-9 place-items-center rounded-full border border-[var(--gold-mid)] text-[var(--ink)] transition-colors hover:bg-[var(--gold-pale)] hover:text-[var(--gold-deep)]">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
              </motion.div>
            )}

            {variant === "dialog" && (
              <div className="popout-dialog">
                <motion.div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={title || "Dialog window"}
                  tabIndex={-1}
                  className={`popout-panel relative overflow-hidden ${className}`}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={softSpring}
                >
                  <button onClick={handleClose} aria-label="Close dialog" className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-[var(--gold-mid)] bg-white/90 text-[var(--ink)] transition-colors hover:bg-[var(--gold-pale)] hover:text-[var(--gold-deep)]">
                    <X size={18} />
                  </button>
                  {children}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
