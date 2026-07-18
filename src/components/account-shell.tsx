"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Heart, Home, LogOut, UserRound } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/tilt-card";

export function AccountShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const links = [
    [UserRound, "Personal details", "/account"],
    [CalendarCheck, "Bookings", "/account/bookings"],
    [Heart, "Saved properties", "/account/favorites"],
  ] as const;

  return (
    <main className="min-h-screen bg-[var(--parchment)] flex flex-col justify-between">
      <SiteHeader compact />
      <div className="mx-auto max-w-6xl w-full px-4 py-8 sm:px-6 flex-1">
        <div className="mb-7 flex items-center gap-4">
          <TiltCard strength={15} className="size-14 rounded-full">
            <span className="surface-3d grid size-full place-items-center !rounded-full bg-[var(--cream)] text-[var(--gold-deep)] border border-[var(--gold)]">
              <UserRound size={28} />
            </span>
          </TiltCard>
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--ink)]">{title}</h1>
            <p className="text-sm text-[var(--muted)]">Manage your StayRwanda account</p>
          </div>
        </div>
        
        <div className="grid gap-7 md:grid-cols-[230px_1fr]">
          <aside className="surface-3d h-fit overflow-hidden bg-white rounded-xl shadow-md border border-[var(--line)] p-2">
            <nav className="space-y-1">
              {links.map(([Icon, label, href]) => {
                const active = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`relative flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-lg ${
                      active ? "text-[var(--gold-deep)] font-semibold" : "text-[var(--ink)] hover:text-[var(--gold-deep)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeAccountNavIndicator"
                        className="absolute inset-0 bg-[var(--cream)] rounded-lg"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <Icon size={19} className="relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              })}
              <SignOutButton>
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)]">
                  <LogOut size={19} />
                  <span>Sign out</span>
                </button>
              </SignOutButton>
            </nav>
          </aside>
          
          <section>{children}</section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export function EmptyState({ icon: Icon = Home, title, copy, action, href }: { icon?: typeof Home; title: string; copy: string; action: string; href: string }) {
  return (
    <div className="surface-3d p-10 text-center rounded-xl bg-white shadow-sm border border-[var(--line)]">
      <Icon className="mx-auto text-[var(--gold-deep)]" size={36} />
      <h2 className="mt-4 text-xl font-bold text-[var(--ink)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{copy}</p>
      <Link href={href} className="button-3d mt-5 inline-block bg-[var(--ink)] px-5 py-3 text-sm font-bold text-white">
        {action}
      </Link>
    </div>
  );
}
