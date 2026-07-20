"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { Icon: LogOut, label: "Sign in", href: "/sign-in" },
] as const;

function NavTab({
  Icon,
  label,
  href,
  active,
}: {
  Icon: typeof Home;
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`mobile-nav-tab group relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 active:scale-95 ${
        active ? "text-[var(--gold-deep)]" : "text-[var(--muted)]"
      }`}
    >
      <span
        className={`grid size-9 place-items-center rounded-xl transition-all duration-200 ${
          active
            ? "bg-[var(--gold-pale)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_4px_12px_rgba(176,141,87,.28)] ring-1 ring-[var(--gold)]/35"
            : "bg-transparent group-hover:bg-[var(--parchment)]"
        }`}
      >
        <Icon size={20} strokeWidth={active ? 2.4 : 1.85} />
      </span>
      <span className="leading-none">{label}</span>
      {active && (
        <span
          aria-hidden
          className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--gold)] shadow-[0_0_8px_rgba(176,141,87,.7)]"
        />
      )}
    </Link>
  );
}

export function MobileBottomNav({ clerkEnabled = false }: { clerkEnabled?: boolean }) {
  const pathname = usePathname();

  if (!pathname) return null;

  const mode = getMobileNavigationMode(pathname);
  if (mode === "hidden") return null;

  const isAccount = mode === "account";
  // Avoid Clerk hooks in the bottom bar — they crash when ClerkProvider is missing.
  // Sign-in route handles sessions; label stays simple.
  const tabs = isAccount
    ? accountTabs.map((tab) =>
        tab.href === "/sign-in" ? { ...tab, label: clerkEnabled ? "Sign out" : "Sign in" } : tab,
      )
    : publicTabs;

  return (
    <>
      {/* Spacer so content isn’t hidden behind the dock */}
      <div
        aria-hidden
        className="h-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px)+0.75rem)] md:hidden"
      />
      <nav
        aria-label={isAccount ? "Guest account" : "Primary mobile"}
        className="mobile-bottom-nav-3d fixed inset-x-0 bottom-0 z-[var(--z-mobile-nav)] md:hidden"
      >
        <div className="mobile-bottom-nav-3d__shell mx-2 mb-[max(0.35rem,env(safe-area-inset-bottom,0px))] flex min-h-[var(--mobile-nav-height)] items-stretch overflow-hidden rounded-2xl border border-[var(--line)]">
          {tabs.map(({ Icon, label, href }) => {
            const accountEntryActive = href === "/account" && pathname.startsWith("/sign-in");
            const active =
              href === "/" || href === "/account"
                ? pathname === href || accountEntryActive
                : href === "/sign-in"
                  ? false
                  : pathname.startsWith(href);
            return <NavTab key={`${href}-${label}`} Icon={Icon} label={label} href={href} active={active} />;
          })}
        </div>
      </nav>
    </>
  );
}
