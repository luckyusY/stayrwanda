"use client";

import { useState } from "react";
import Link from "next/link";
import { Popout } from "./popout";
import { UserCircle2, Heart, ClipboardList, Settings, Building2, LogOut, LogIn, Mail } from "lucide-react";
import Image from "next/image";

export function AccountPopout({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  
  // Mocked state for presentation purposes. In production, this would use a real auth context.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHost, setIsHost] = useState(true);

  const trigger = (
    <div
      onClick={() => setOpen(!open)}
      className={`flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors ${
        light
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
      }`}
      aria-label={isLoggedIn ? "Account menu, profile" : "Account menu, sign in"}
    >
      <UserCircle2 size={16} className="shrink-0 opacity-90" />
      <span className="text-[11px] font-semibold leading-none tracking-wide">Account</span>
      <span
        className={`text-[9px] font-medium uppercase tracking-[0.12em] leading-none ${
          light ? "text-white/55" : "text-[var(--muted)]"
        }`}
      >
        {isLoggedIn ? "Profile" : "Sign in"}
      </span>
    </div>
  );

  return (
    <Popout
      variant="dropdown"
      isOpen={open}
      onClose={() => setOpen(false)}
      trigger={trigger}
      align="right"
      className="p-2 w-64"
    >
      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-3 border-b border-[var(--line)] p-3 mb-2">
            <div className="grid size-10 place-items-center rounded-full bg-[var(--gold-pale)] text-[var(--gold-deep)]">
              <UserCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">Guest User</p>
              <p className="text-xs text-[var(--muted)]">guest@example.com</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <Link href="/account/saved" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]">
              <Heart size={16} className="text-[var(--gold-mid)]" /> Saved properties
            </Link>
            <Link href="/account/bookings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]">
              <ClipboardList size={16} className="text-[var(--gold-mid)]" /> My bookings
            </Link>
            <Link href="/account/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]">
              <Settings size={16} className="text-[var(--gold-mid)]" /> Account settings
            </Link>
            
            {isHost && (
              <>
                <div className="my-1 border-t border-[var(--line)]" />
                <Link href="/host" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]">
                  <Building2 size={16} className="text-[var(--gold-mid)]" /> Host dashboard
                </Link>
              </>
            )}
            
            <div className="my-1 border-t border-[var(--line)]" />
            
            <button onClick={() => { setIsLoggedIn(false); setOpen(false); }} className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm text-[var(--ink)] transition-colors hover:bg-red-50 hover:text-red-600">
              <LogOut size={16} className="opacity-70" /> Sign out
            </button>
          </div>
        </>
      ) : (
        <div className="p-3">
          <div className="mb-4 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--gold-pale)] mb-2 shadow-sm">
              <LogIn size={24} className="text-[var(--gold-deep)]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">Welcome</h3>
            <p className="text-xs text-[var(--muted)]">Sign in to book stays and manage your reservations.</p>
          </div>
          
          <button onClick={() => setIsLoggedIn(true)} className="button-3d mb-3 flex w-full items-center justify-center gap-2 bg-white border border-[var(--line)] px-4 py-2.5 text-xs font-semibold text-[var(--ink)] shadow-sm hover:bg-[var(--parchment)]">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={16} height={16} />
            Continue with Google
          </button>
          
          <div className="relative mb-3 flex items-center py-2">
            <div className="flex-grow border-t border-[var(--line)]"></div>
            <span className="shrink-0 px-3 text-[10px] uppercase tracking-wider text-[var(--muted)]">Or</span>
            <div className="flex-grow border-t border-[var(--line)]"></div>
          </div>
          
          <Link href="/sign-in" onClick={() => setOpen(false)} className="button-3d flex w-full items-center justify-center gap-2 bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[var(--ink-2)] transition-colors shadow-md">
            <Mail size={14} /> Sign in
          </Link>
          
          <Link href="/register" onClick={() => setOpen(false)} className="button-3d mt-3 flex w-full items-center justify-center gap-2 border border-[var(--gold)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] hover:bg-[var(--gold)] hover:text-white transition-colors">
            Create account
          </Link>
        </div>
      )}
    </Popout>
  );
}
