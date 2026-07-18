"use client";

import { useEffect, useState } from "react";
import { Popout } from "./popout";

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
      <div className="grid h-full md:grid-cols-2">
        <div className="relative hidden min-h-[440px] md:block">
          {/* Local brand photo — path must exist under /public */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/properties/kagarama/01-eye-1460.jpg"
            alt="A StayRwanda residence in Kigali"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/20 to-transparent p-8">
            <h3 className="font-serif text-3xl text-white">Experience the land of a thousand hills.</h3>
          </div>
        </div>
        <div className="flex flex-col justify-center bg-[#fdfcfb] p-8 md:p-12">
          <p className="eyebrow text-[var(--gold-deep)]">The StayRwanda Letter</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--ink)]">
            Inspiration for your next Rwandan stay
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
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
              className="field-3d min-h-12 w-full bg-white px-4 text-sm outline-none placeholder-[var(--muted)]"
              placeholder="Your email address"
            />
            <button
              type="submit"
              className="button-3d w-full bg-[var(--ink)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md transition-colors hover:bg-[var(--ink-2)]"
            >
              Join the list
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full py-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              No thanks
            </button>
          </form>
        </div>
      </div>
    </Popout>
  )
}
