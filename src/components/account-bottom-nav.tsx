"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Heart, LayoutDashboard, LogOut } from "lucide-react";

const tabs = [
  { Icon: LayoutDashboard, label: "Overview",  href: "/account" },
  { Icon: CalendarCheck,   label: "Bookings",  href: "/account/bookings" },
  { Icon: Heart,           label: "Saved",     href: "/account/favorites" },
] as const;

export function AccountBottomNav({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden items-stretch border-t border-[var(--line)] bg-white/95 backdrop-blur-sm shadow-[0_-2px_12px_rgba(20,34,58,.08)]">
      {tabs.map(({ Icon, label, href }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              active ? "text-[var(--gold-deep)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            {label}
            {active && <span className="absolute bottom-0 h-0.5 w-10 rounded-full bg-[var(--gold)]" />}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onSignOut}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] transition-colors hover:text-[var(--terracotta)]"
      >
        <LogOut size={20} strokeWidth={1.8} />
        Sign out
      </button>
    </nav>
  );
}
