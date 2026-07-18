"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Heart, Home, LogOut, UserRound } from "lucide-react";
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

  // Never import @clerk/nextjs SignOutButton here — without a valid
  // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / ClerkProvider it crashes the whole
  // account tree. Sign-in handles session end via Clerk when configured.
  const signOutHref = "/sign-in";

  return (
    <main className="flex min-h-screen flex-col justify-between bg-[var(--parchment)]">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-7 flex items-center gap-4">
          <TiltCard strength={15} className="size-14 rounded-full">
            <span className="surface-3d grid size-full place-items-center !rounded-full border border-[var(--gold)] bg-[var(--cream)] text-[var(--gold-deep)]">
              <UserRound size={28} />
            </span>
          </TiltCard>
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--ink)]">{title}</h1>
            <p className="text-sm text-[var(--muted)]">Manage your StayRwanda account</p>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-[230px_1fr]">
          <aside className="surface-3d h-fit overflow-hidden rounded-xl border border-[var(--line)] bg-white p-2 shadow-md">
            <nav className="space-y-1">
              {links.map(([Icon, label, href]) => {
                const active = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                      active
                        ? "font-semibold text-[var(--gold-deep)]"
                        : "text-[var(--ink)] hover:text-[var(--gold-deep)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeAccountNavIndicator"
                        className="absolute inset-0 rounded-lg bg-[var(--cream)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <Icon size={19} className="relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              })}
              <Link
                href={signOutHref}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-[var(--ink)] transition-colors hover:text-[var(--gold-deep)]"
              >
                <LogOut size={19} />
                <span>Sign in / out</span>
              </Link>
            </nav>
          </aside>

          <section>{children}</section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

export function EmptyState({
  icon: Icon = Home,
  title,
  copy,
  action,
  href,
}: {
  icon?: typeof Home;
  title: string;
  copy: string;
  action: string;
  href: string;
}) {
  return (
    <div className="surface-3d rounded-xl border border-[var(--line)] bg-white p-10 text-center shadow-sm">
      <Icon className="mx-auto text-[var(--gold-deep)]" size={36} />
      <h2 className="mt-4 text-xl font-bold text-[var(--ink)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{copy}</p>
      <Link
        href={href}
        className="button-3d mt-5 inline-block bg-[var(--ink)] px-5 py-3 text-sm font-bold text-white"
      >
        {action}
      </Link>
    </div>
  );
}
