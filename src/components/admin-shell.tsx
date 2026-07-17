"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarCheck,
  ExternalLink,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Building2,
  History,
  Users,
  X,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/organizations", label: "Organizations", icon: Users },
  { href: "/admin/properties", label: "Hotels & review", icon: Building2 },
  { href: "/admin/bookings", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/audit", label: "Audit log", icon: History },
] as const;

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="workspace-3d min-h-screen bg-[#f2f4f7] text-[#1a1a1a] md:grid md:grid-cols-[248px_1fr]">
      {/* Sidebar */}
      <aside
        className={`${open ? "block" : "hidden"} fixed inset-0 z-40 md:static md:block`}
      >
        <div
          className="absolute inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
        <div className="relative flex h-full w-64 flex-col bg-[#073b74] text-white shadow-[0_18px_48px_rgba(5,25,50,.28)] md:h-screen md:w-auto md:sticky md:top-0">
          <div className="flex h-16 items-center justify-between px-5">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/brand/stayrwanda-logo.png" alt="StayRwanda" width={1093} height={607} className="h-12 w-auto brightness-0 invert" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">admin</span>
            </Link>
            <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <nav className="mt-3 flex-1 space-y-1 px-3">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "text-[#073b74]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeAdminSidebarNavIndicator"
                      className="absolute inset-0 bg-white rounded-lg shadow-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <Icon size={19} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/15 p-3 relative z-10">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Home size={19} /> View live site <ExternalLink size={14} className="opacity-60" />
            </Link>
            <SignOutButton><button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"><LogOut size={19} /> Sign out</button></SignOutButton>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#e4e7ec] bg-white px-4 shadow-[0_5px_18px_rgba(20,34,58,.06)] sm:px-7">
          <button
            className="grid size-9 place-items-center rounded-lg hover:bg-[#f2f4f7] md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold leading-tight sm:text-xl">{title}</h1>
            {subtitle && <p className="truncate text-xs text-[#667085]">{subtitle}</p>}
          </div>
          <span className="ml-auto hidden items-center gap-2 rounded-full bg-[#f0f6ff] px-3 py-1.5 text-xs font-bold text-[#006ce4] sm:flex">
            <span className="size-2 rounded-full bg-[#008234]" /> Admin
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
