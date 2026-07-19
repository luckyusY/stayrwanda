"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Heart,
  Home,
  LogOut,
  UserRound,
  LayoutDashboard,
  MapPin,
  Compass,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";

function useSafeClerk() {
  try {
    return useClerk();
  } catch {
    return null;
  }
}

const links = [
  [LayoutDashboard, "Overview",         "/account"],
  [CalendarCheck,   "Bookings",         "/account/bookings"],
  [Heart,           "Saved properties", "/account/favorites"],
] as const;

interface AccountShellProps {
  children: React.ReactNode;
  title: string;
  /** Optional user name shown in sidebar identity block */
  userName?: string;
  /** Optional user email shown in sidebar identity block */
  userEmail?: string;
}

export function AccountShell({ children, title, userName, userEmail }: AccountShellProps) {
  const pathname = usePathname();
  const clerk = useSafeClerk();

  const handleSignOut = async () => {
    if (clerk) {
      try {
        await clerk.signOut();
        window.location.href = "/";
      } catch {
        window.location.href = "/sign-in";
      }
    } else {
      window.location.href = "/sign-in";
    }
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "G";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--parchment)]">
      <SiteHeader />

      {/* Page hero strip */}
      <div className="border-b border-[var(--line)] bg-gradient-to-r from-[var(--ink)] to-[var(--ink-2)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white">
              {initials}
            </span>
            <div>
              <h1 className="font-serif text-xl font-bold text-white leading-tight">{title}</h1>
              <p className="text-xs text-white/60">StayRwanda Guest Account</p>
            </div>
          </div>
          <Link
            href="/stays"
            className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:bg-white/20 sm:flex"
          >
            <Compass size={13} /> Explore stays
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8">
        <div className="grid gap-7 md:grid-cols-[240px_1fr]">

          {/* ─── Sidebar ──────────────────────────────────────────────── */}
          <aside className="hidden md:flex md:flex-col gap-4">
            {/* Identity block */}
            <div className="surface-3d overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--parchment)] p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-[var(--gold)] bg-[var(--cream)] font-bold text-[var(--gold-deep)]">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--ink)]">{userName || "Guest"}</p>
                  {userEmail && (
                    <p className="truncate text-xs text-[var(--muted)]">{userEmail}</p>
                  )}
                </div>
              </div>

              {/* Nav links */}
              <nav className="p-2">
                {links.map(([Icon, label, href]) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={label}
                      href={href}
                      className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                        active
                          ? "font-semibold text-[var(--gold-deep)]"
                          : "text-[var(--ink)] hover:text-[var(--gold-deep)]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="activeAccountNavIndicator"
                          className="absolute inset-0 rounded-xl bg-[var(--gold-pale)]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          style={{ zIndex: 0 }}
                        />
                      )}
                      <Icon size={18} className="relative z-10 shrink-0" />
                      <span className="relative z-10">{label}</span>
                      {active && (
                        <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Divider + sign out */}
              <div className="border-t border-[var(--line)] p-2">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[var(--muted)] transition-colors hover:bg-red-50 hover:text-[var(--terracotta)]"
                >
                  <LogOut size={18} className="shrink-0" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>

            {/* Explore stays shortcut */}
            <Link
              href="/stays"
              className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold-pale)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] transition hover:bg-[var(--cream-2)] hover:border-[var(--gold)]"
            >
              <MapPin size={14} /> Find your next stay
            </Link>

            {/* Member badge */}
            <div className="rounded-2xl border border-[var(--line)] bg-white p-4 text-center">
              <UserRound size={20} className="mx-auto text-[var(--gold-deep)]" />
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                StayRwanda Guest
              </p>
            </div>
          </aside>

          {/* ─── Content ──────────────────────────────────────────────── */}
          <section className="min-w-0">{children}</section>
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
    <div className="rounded-2xl border border-[var(--line)] bg-white p-6 text-center shadow-sm sm:p-12">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--gold-pale)] text-[var(--gold-deep)]">
        <Icon size={28} />
      </div>
      <h2 className="mt-5 font-serif text-xl font-bold text-[var(--ink)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)]">{copy}</p>
      <Link
        href={href}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--ink)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--ink-2)] sm:w-auto"
      >
        {action}
      </Link>
    </div>
  );
}
