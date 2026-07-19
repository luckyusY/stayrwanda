"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, CalendarCheck, UserRound } from "lucide-react";

const publicTabs = [
  { Icon: Home, label: "Home", href: "/" },
  { Icon: Search, label: "Search", href: "/search" },
  { Icon: CalendarCheck, label: "Bookings", href: "/account/bookings" },
  { Icon: UserRound, label: "Account", href: "/account" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin, host, or account sub-routes (account shell already has AccountBottomNav)
  const isExcluded =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/host") ||
    pathname.startsWith("/account");

  if (isExcluded) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden items-stretch border-t border-[var(--line)] bg-white/95 backdrop-blur-sm shadow-[0_-2px_12px_rgba(20,34,58,.08)] pb-[env(safe-area-inset-bottom,0px)]">
      {publicTabs.map(({ Icon, label, href }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              active ? "text-[var(--gold-deep)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[9px]">{label}</span>
            {active && <span className="absolute bottom-0 h-0.5 w-10 rounded-full bg-[var(--gold)]" />}
          </Link>
        );
      })}
    </nav>
  );
}
