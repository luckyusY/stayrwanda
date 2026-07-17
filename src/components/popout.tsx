"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  /** Show StayRwanda logo in dialog/sheet header. Default true for dialog/sheet. */
  showLogo?: boolean;
  footer?: React.ReactNode;
  /** Hide the built-in header chrome (for custom full layouts). */
  hideHeader?: boolean;
}

function BrandMark({ className = "h-8" }: { className?: string }) {
  return (
    <Image
      src="/brand/stayrwanda-logo.png"
      alt="StayRwanda"
      width={1093}
      height={607}
      className={`${className} w-auto object-contain`}
    />
  );
}

export function Popout({
  variant,
  trigger,
  isOpen: controlledIsOpen,
  onClose,
  children,
  className = "",
  wrapperClassName = "relative inline-block",
  title,
  align = "right",
  showLogo = true,
  footer,
  hideHeader = false,
}: PopoutProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const handleClose = useCallback(() => {
    if (!isControlled) setUncontrolledIsOpen(false);
    onClose?.();
  }, [isControlled, onClose]);

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
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
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

  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length) {
        (focusable[0] as HTMLElement).focus();
      } else {
        panelRef.current.focus();
      }
    }
  }, [open]);

  const header = !hideHeader && (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--line)] bg-[var(--parchment)] px-4 py-3.5">
      {showLogo && <BrandMark className="h-8 shrink-0" />}
      {title ? (
        <h2 className="min-w-0 flex-1 font-serif text-lg font-semibold text-[var(--ink)] sm:text-xl">
          {title}
        </h2>
      ) : (
        <div className="flex-1" />
      )}
      <button
        onClick={handleClose}
        aria-label="Close"
        className="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--gold-mid)] bg-white text-[var(--ink)] transition-colors hover:bg-[var(--gold-pale)] hover:text-[var(--gold-deep)]"
      >
        <X size={18} />
      </button>
    </div>
  );

  if (variant === "dropdown") {
    const alignmentClasses = {
      left: "left-0",
      right: "right-0",
      center: "left-1/2 -translate-x-1/2",
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
                {header}
                <div className="flex-1 overflow-y-auto">{children}</div>
                {footer && (
                  <div className="sticky bottom-0 border-t border-[var(--line)] bg-white p-4">{footer}</div>
                )}
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
                  className={`popout-panel relative flex max-h-[min(90vh,860px)] flex-col overflow-hidden ${className}`}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={softSpring}
                  onClick={(e) => e.stopPropagation()}
                >
                  {header}
                  <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
                  {footer && (
                    <div className="sticky bottom-0 border-t border-[var(--line)] bg-white p-4">{footer}</div>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
