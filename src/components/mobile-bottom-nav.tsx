"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Home, Search, CalendarCheck, UserRound, Heart, LayoutDashboard, LogOut } from "lucide-react";
import { getMobileNavigationMode } from "@/lib/mobile-navigation";

const publicTabs = [
  { Icon: Home, label: "Home", href: "/" },
  { Icon: Search, label: "Search", href: "/search" },
  { Icon: CalendarCheck, label: "Bookings", href: "/account/bookings" },
  { Icon: UserRound, label: "Account", href: "/account" },
] as const;

const accountTabs = [
  { Icon: LayoutDashboard, label: "Overview", href: "/account" },
  { Icon: CalendarCheck, label: "Bookings", href: "/account/bookings" },
  { Icon: Heart, label: "Saved", href: "/account/favorites" },
] as const;

function NavTab({ Icon, label, href, active }: { Icon: typeof Home; label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--gold)] ${
        active ? "text-[var(--gold-deep)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
      <span>{label}</span>
      {active && <span aria-hidden className="absolute bottom-0 h-0.5 w-10 rounded-full bg-[var(--gold)]" />}
    </Link>
  );
}

function ClerkSignOutTab() {
  const clerk = useClerk();
  return (
    <button
      type="button"
      onClick={async () => {
        await clerk.signOut();
        window.location.assign("/");
      }}
      className="relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)] transition-colors hover:text-[var(--terracotta)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--gold)]"
    >
      <LogOut size={20} strokeWidth={1.8} />
      <span>Sign out</span>
    </button>
  );
}

function SignOutTab({ clerkEnabled }: { clerkEnabled: boolean }) {
  if (clerkEnabled) return <ClerkSignOutTab />;
  return (
    <Link href="/sign-in" className="relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
      <LogOut size={20} strokeWidth={1.8} />
      <span>Sign out</span>
    </Link>
  );
}

export function MobileBottomNav({ clerkEnabled = false }: { clerkEnabled?: boolean }) {
  const pathname = usePathname();

  if (!pathname) return null;

  const mode = getMobileNavigationMode(pathname);
  if (mode === "hidden") return null;

  const isAccount = mode === "account";
  const tabs = isAccount ? accountTabs : publicTabs;

  return (
    <>
      <div aria-hidden className="h-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px))] md:hidden" />
      <nav
        aria-label={isAccount ? "Guest account" : "Mobile"}
        className="fixed inset-x-0 bottom-0 z-[var(--z-mobile-nav)] flex min-h-[var(--mobile-nav-height)] items-stretch border-t border-[var(--line)] bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-2px_12px_rgba(20,34,58,.08)] backdrop-blur-sm md:hidden"
      >
        {tabs.map(({ Icon, label, href }) => {
          const active = href === "/" || href === "/account" ? pathname === href : pathname.startsWith(href);
          return <NavTab key={href} Icon={Icon} label={label} href={href} active={active} />;
        })}
        {isAccount && <SignOutTab clerkEnabled={clerkEnabled} />}
      </nav>
    </>
  );
}
