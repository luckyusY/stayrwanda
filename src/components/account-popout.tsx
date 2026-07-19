"use client";

import { useState } from "react";
import Link from "next/link";
import { Popout } from "./popout";
import { UserCircle2, Heart, ClipboardList, Settings, Building2, LogOut, LogIn, Mail } from "lucide-react";

function AccountBrandHeader() {
  return (
    <div className="mb-1 flex items-center justify-center border-b border-[var(--line)] bg-[var(--parchment)] px-4 py-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/stayrwanda-logo.png"
        alt="StayRwanda"
        width={1093}
        height={607}
        className="h-9 w-auto object-contain"
      />
    </div>
  );
}

export function AccountPopout({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);

  // Mocked state for presentation purposes. In production, this would use a real auth context.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHost] = useState(true);

  const trigger = (
    <button
      type="button"
      className={`flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 transition-colors md:min-w-[4.25rem] md:px-2 ${
        light
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
      }`}
      aria-label={isLoggedIn ? "Account menu, profile" : "Account menu, sign in"}
    >
      <span className="grid size-9 place-items-center md:size-auto">
        <UserCircle2 size={18} className="shrink-0 opacity-90 md:size-4" />
      </span>
      <span className="hidden text-[11px] font-semibold leading-none tracking-wide md:block">Account</span>
      <span
        className={`hidden text-[9px] font-medium uppercase leading-none tracking-[0.12em] md:block ${
          light ? "text-white/55" : "text-[var(--muted)]"
        }`}
      >
        {isLoggedIn ? "Profile" : "Sign in"}
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
      showLogo={false}
      className="w-full sm:w-72 p-0"
    >
      <div className="hidden sm:block"><AccountBrandHeader /></div>

      {isLoggedIn ? (
        <div className="p-2">
          <div className="mb-2 flex items-center gap-3 border-b border-[var(--line)] p-3">
            <div className="grid size-10 place-items-center rounded-full bg-[var(--gold-pale)] text-[var(--gold-deep)]">
              <UserCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">Guest User</p>
              <p className="text-xs text-[var(--muted)]">guest@example.com</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Link
              href="/account/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
            >
              <Heart size={16} className="text-[var(--gold-mid)]" /> Saved properties
            </Link>
            <Link
              href="/account/bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
            >
              <ClipboardList size={16} className="text-[var(--gold-mid)]" /> My bookings
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
            >
              <Settings size={16} className="text-[var(--gold-mid)]" /> Account settings
            </Link>

            {isHost && (
              <>
                <div className="my-1 border-t border-[var(--line)]" />
                <Link
                  href="/host"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
                >
                  <Building2 size={16} className="text-[var(--gold-mid)]" /> Host dashboard
                </Link>
              </>
            )}

            <div className="my-1 border-t border-[var(--line)]" />

            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm text-[var(--ink)] transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} className="opacity-70" /> Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-2 grid size-12 place-items-center rounded-full bg-[var(--gold-pale)] shadow-sm">
              <LogIn size={24} className="text-[var(--gold-deep)]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">Welcome</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Sign in to book stays and manage your reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="button-3d mb-3 flex w-full items-center justify-center gap-2 border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--ink)] shadow-sm hover:bg-[var(--parchment)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" width={16} height={16} />
            Continue with Google
          </button>

          <div className="relative mb-3 flex items-center py-2">
            <div className="flex-grow border-t border-[var(--line)]" />
            <span className="shrink-0 px-3 text-[10px] uppercase tracking-wider text-[var(--muted)]">Or</span>
            <div className="flex-grow border-t border-[var(--line)]" />
          </div>

          <Link
            href="/sign-in"
            onClick={() => setOpen(false)}
            className="button-3d flex w-full items-center justify-center gap-2 bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-[var(--ink-2)]"
          >
            <Mail size={14} /> Sign in
          </Link>

          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="button-3d mt-3 flex w-full items-center justify-center gap-2 border border-[var(--gold)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] transition-colors hover:bg-[var(--gold)] hover:text-white"
          >
            Create account
          </Link>
        </div>
      )}
    </Popout>
  );
}
