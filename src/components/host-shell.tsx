"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, BedDouble, Building2, CalendarDays, ClipboardList, History, Menu, Settings, Tags, UserRound, Users, X } from "lucide-react";
import { motion } from "framer-motion";

const nav = [
  ["/host", "Overview", BarChart3],
  ["/host/hotels", "Hotels & residences", Building2],
  ["/host/inventory", "Units & inventory", BedDouble],
  ["/host/reservations", "Reservations", ClipboardList],
  ["/host/calendar", "Calendar", CalendarDays],
  ["/host/guests", "Guests", UserRound],
  ["/host/offers", "Offers & content", Tags],
  ["/host/team", "Team", Users],
  ["/host/settings", "Settings", Settings],
  ["/host/audit", "Audit history", History]
] as const;

export function HostShell({ children, organizationName = "Hospitality workspace" }: { children: React.ReactNode; organizationName?: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="workspace-3d min-h-screen bg-[#f6f5f1] md:grid md:grid-cols-[260px_1fr]">
      <aside className={`${open ? "block" : "hidden"} fixed inset-0 z-50 md:static md:block`}>
        <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40 md:hidden" />
        <div className="surface-3d-dark relative flex h-full w-[280px] flex-col !rounded-none border-y-0 border-l-0 p-4 text-white md:sticky md:top-0 md:h-screen md:w-auto">
          <div className="flex items-center justify-between border-b border-white/10 px-2 pb-5">
            <Link href="/host" className="font-serif text-2xl">StayRwanda <small className="block font-sans text-[9px] uppercase tracking-[.18em] text-[var(--gold)]">Host CRM</small></Link>
            <button onClick={() => setOpen(false)} className="md:hidden"><X /></button>
          </div>
          <p className="px-2 py-5 text-xs text-white/60">{organizationName}</p>
          <nav className="space-y-1">
            {nav.map(([href, label, Icon]) => {
              const active = path === href || (href !== "/host" && path.startsWith(`${href}/`));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm transition-colors ${
                    active ? "text-[var(--ink)] font-semibold" : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeHostSidebarNavIndicator"
                      className="absolute inset-0 bg-white rounded-[var(--radius-control)] shadow-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>
          <Link href="/" className="mt-auto border-t border-white/10 px-3 pt-5 text-sm text-white/60 relative z-10">View public site →</Link>
        </div>
      </aside>
      <div>
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#e1ded5] bg-white px-5 shadow-[0_5px_18px_rgba(20,34,58,.06)]">
          <button onClick={() => setOpen(true)} className="interactive-3d mr-3 grid size-9 place-items-center md:hidden"><Menu /></button>
          <strong className="text-sm text-[var(--ink)]">{organizationName}</strong>
          <Link href="/host/onboarding" className="button-3d shimmer-gold ml-auto bg-[var(--gold)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">Add property</Link>
        </header>
        <main className="p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
