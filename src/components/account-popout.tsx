"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { Building2, ClipboardList, Heart, LogIn, LogOut, Mail, Settings, UserCircle2 } from "lucide-react";
import { Popout } from "./popout";
import { useAuthAvailability } from "@/components/auth-availability";

type AccountMenuProps = {
  light: boolean;
  signedIn: boolean;
  userName?: string;
  userEmail?: string;
  onSignOut?: () => Promise<void>;
};

function AccountMenu({ light, signedIn, userName, userEmail, onSignOut }: AccountMenuProps) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      className={`flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 transition-colors md:min-w-[4.25rem] md:px-2 ${
        light ? "text-white/90 hover:bg-white/10 hover:text-white" : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
      }`}
      aria-label={signedIn ? "Account menu, profile" : "Account menu, sign in"}
      aria-expanded={open}
      aria-haspopup="dialog"
    >
      <span className="grid size-9 place-items-center md:size-auto"><UserCircle2 size={18} className="shrink-0 opacity-90 md:size-4" /></span>
      <span className="text-[8px] font-bold uppercase leading-none tracking-[0.06em] md:hidden">Account</span>
      <span className="hidden text-[11px] font-semibold leading-none tracking-wide md:block">Account</span>
      <span className={`hidden text-[9px] font-medium uppercase leading-none tracking-[0.12em] md:block ${light ? "text-white/55" : "text-[var(--muted)]"}`}>
        {signedIn ? "Profile" : "Sign in"}
      </span>
    </button>
  );

  return (
    <Popout
      variant="dropdown"
      mobileVariant="dialog"
      isOpen={open}
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      trigger={trigger}
      align="right"
      title="Account"
      showLogo
      className="w-full bg-white p-0 sm:w-72"
    >
      {signedIn ? (
        <div className="p-2">
          <div className="mb-2 flex min-w-0 items-center gap-3 border-b border-[var(--line)] p-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--gold-pale)] text-[var(--gold-deep)]"><UserCircle2 size={24} /></div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--ink)]">{userName || "StayRwanda guest"}</p>
              <p className="truncate text-xs text-[var(--muted)]">{userEmail || "Signed in"}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              [Heart, "Saved properties", "/account/favorites"],
              [ClipboardList, "My bookings", "/account/bookings"],
              [Settings, "Account overview", "/account"],
              [Building2, "Host dashboard", "/host"],
            ].map(([Icon, label, href]) => (
              <Link key={String(href)} href={String(href)} onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]">
                <Icon size={16} className="shrink-0 text-[var(--gold-mid)]" /> {String(label)}
              </Link>
            ))}
          </nav>
          <div className="mt-1 border-t border-[var(--line)] pt-1">
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await onSignOut?.();
              }}
              className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[var(--ink)] hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-2 grid size-12 place-items-center rounded-full bg-[var(--gold-pale)] shadow-sm"><LogIn size={24} className="text-[var(--gold-deep)]" /></div>
            <h3 className="font-serif text-xl font-semibold text-[var(--ink)]">Welcome to StayRwanda</h3>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[var(--muted)]">Sign in securely to save properties and manage booking requests.</p>
          </div>
          <Link href="/sign-in" onClick={() => setOpen(false)} className="button-3d flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--ink)] px-4 text-xs font-semibold uppercase tracking-wider text-white">
            <Mail size={15} /> Sign in
          </Link>
          <Link href="/register" onClick={() => setOpen(false)} className="interactive-3d mt-3 flex min-h-12 w-full items-center justify-center px-4 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)]">
            Create account
          </Link>
        </div>
      )}
    </Popout>
  );
}

function ClerkAccountMenu({ light }: { light: boolean }) {
  const { isLoaded, user } = useUser();
  const clerk = useClerk();
  return (
    <AccountMenu
      light={light}
      signedIn={isLoaded && !!user}
      userName={user?.fullName || user?.firstName || undefined}
      userEmail={user?.primaryEmailAddress?.emailAddress}
      onSignOut={async () => {
        await clerk.signOut();
        window.location.assign("/");
      }}
    />
  );
}

export function AccountPopout({ light = false }: { light?: boolean }) {
  const clerkEnabled = useAuthAvailability();
  return clerkEnabled ? <ClerkAccountMenu light={light} /> : <AccountMenu light={light} signedIn={false} />;
}
