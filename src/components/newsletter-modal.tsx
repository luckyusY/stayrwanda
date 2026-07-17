"use client";

import { useEffect, useState } from "react";
import { Popout } from "./popout";
import Image from "next/image";

export function NewsletterModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only trigger automatically once per session
    if (sessionStorage.getItem("newsletter_seen")) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("newsletter_seen", "true");
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  // Listen for custom event from footer
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-newsletter", handleOpen);
    return () => window.removeEventListener("open-newsletter", handleOpen);
  }, []);

  return (
    <Popout
      variant="dialog"
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Newsletter"
      className="w-[95vw] max-w-[800px] overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
      <div className="grid md:grid-cols-2 h-full">
        <div className="relative hidden md:block h-full min-h-[440px]">
          <Image 
            src="/properties/kgl-3.jpg" 
            alt="Beautiful Rwanda" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/20 to-transparent flex items-end p-8">
            <h3 className="font-serif text-3xl text-white">Experience the land of a thousand hills.</h3>
          </div>
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#fdfcfb]">
          <p className="eyebrow text-[var(--gold-deep)]">The StayRwanda Letter</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">
            Inspiration for your next Rwandan stay
          </h2>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Join our private newsletter for quietly curated apartments, residences, and seasonal offers across Kigali — delivered now and then.
          </p>
          <form 
            className="mt-8 flex flex-col gap-3"
            onSubmit={(e) => {
               e.preventDefault();
               setOpen(false);
               sessionStorage.setItem("newsletter_seen", "true");
            }}
          >
            <input
              required
              type="email"
              className="field-3d w-full min-h-12 bg-white px-4 text-sm outline-none placeholder-[var(--muted)]"
              placeholder="Your email address"
            />
            <button type="submit" className="button-3d w-full bg-[var(--ink)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[var(--ink-2)] transition-colors shadow-md">
              Join the list
            </button>
            <button 
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-2"
            >
              No thanks
            </button>
          </form>
        </div>
      </div>
    </Popout>
  )
}
