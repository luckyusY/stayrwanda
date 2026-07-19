import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getSafeProfile, getSafeBookings, getSafeFavorites } from "@/lib/guest-account";
import {
  CalendarDays,
  Heart,
  ArrowRight,
  LifeBuoy,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Circle,
  XCircle,
  Phone,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { formatRwf, formatDate, daysUntil } from "@/lib/pricing";
import Image from "next/image";

function timeGreeting() {
  const hour = new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Africa/Kigali" });
  const h = parseInt(hour);
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_DOT: Record<string, { icon: typeof Circle; colour: string; label: string }> = {
  pending:   { icon: Clock,         colour: "text-[var(--gold)]",           label: "Pending" },
  confirmed: { icon: CheckCircle2,  colour: "text-[var(--rwanda-green)]",   label: "Confirmed" },
  completed: { icon: CheckCircle2,  colour: "text-[var(--muted)]",          label: "Completed" },
  cancelled: { icon: XCircle,       colour: "text-[var(--terracotta)]",     label: "Cancelled" },
  rejected:  { icon: XCircle,       colour: "text-[var(--terracotta)]",     label: "Rejected" },
  expired:   { icon: XCircle,       colour: "text-[var(--muted)]",          label: "Expired" },
};

export default async function AccountPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");

  const [profileResult, bookingsResult, favoritesResult] = await Promise.all([
    getSafeProfile(identity.userId, identity.email),
    getSafeBookings(identity.userId, identity.email),
    getSafeFavorites(identity.userId),
  ]);

  const profile = profileResult.data;
  const bookings = bookingsResult.data || [];
  const favorites = favoritesResult.data || [];

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" && b.checkOut >= todayStr
  );
  // Sort ascending to find the next chronological stay
  const nextStay = upcomingBookings.sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];
  const recentActivity = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const greeting = timeGreeting();
  const firstName = profile?.name?.split(" ")[0] || "Guest";

  return (
    <AccountShell
      title="Overview"
      userName={profile?.name}
      userEmail={profile?.email}
    >
      <div className="space-y-6">

        {/* ── Welcome Hero ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ink)] to-[var(--ink-2)] p-5 shadow-lg sm:p-7">
          {/* Decorative watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 opacity-[0.04]">
            <svg width="220" height="220" viewBox="0 0 200 200" fill="white">
              <path d="M100 10 L190 100 L100 190 L10 100 Z" />
              <circle cx="100" cy="100" r="40" />
            </svg>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">{greeting}</p>
          <h2 className="mt-1 break-words font-serif text-3xl font-bold text-white sm:text-4xl">{firstName}</h2>
          <p className="mt-2 text-sm text-white/60">Welcome to your StayRwanda guest hub.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/stays"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/20 sm:flex-none"
            >
              Explore stays <ArrowRight size={12} />
            </Link>
            {nextStay && (
              <Link
                href={`/bookings/${nextStay.reference}`}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--gold)] px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[var(--gold-mid)] sm:flex-none"
              >
                Manage booking <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>

        {/* ── 3 Stat Cards ─────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Total bookings */}
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--cream)] text-[var(--gold-deep)]">
              <CalendarDays size={22} />
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[var(--ink)]">
                {bookingsResult.error ? "—" : bookings.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Total bookings</p>
            </div>
          </div>

          {/* Upcoming stays */}
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--green-light)] bg-white p-5 shadow-sm">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--green-light)] text-[var(--rwanda-green)]">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[var(--ink)]">
                {bookingsResult.error ? "—" : upcomingBookings.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Upcoming stays</p>
            </div>
          </div>

          {/* Saved properties */}
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--gold-pale)] bg-white p-5 shadow-sm">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--gold-pale)] text-[var(--gold-deep)]">
              <Heart size={22} />
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[var(--ink)]">
                {favoritesResult.error ? "—" : favorites.length}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Saved stays</p>
            </div>
          </div>
        </div>

        {/* ── Error states ──────────────────────────────────────────── */}
        {(bookingsResult.error || favoritesResult.error) && (
          <div className="rounded-2xl border border-dashed border-[var(--terracotta)]/30 bg-red-50 p-4 text-center">
            <p className="text-sm font-medium text-[var(--terracotta)]">
              {bookingsResult.error && favoritesResult.error
                ? "Bookings and saved properties are temporarily unavailable."
                : bookingsResult.error
                ? "Your booking history is temporarily unavailable."
                : "Your saved properties are temporarily unavailable."}
            </p>
          </div>
        )}

        {/* ── Next Stay — Boarding Pass ─────────────────────────────── */}
        {!bookingsResult.error && (
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--parchment)] px-4 py-4 sm:px-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Your next stay</h3>
              {nextStay && (
                <Link
                  href="/account/bookings"
                  className="text-xs font-semibold text-[var(--gold-deep)] hover:text-[var(--ink)]"
                >
                  All bookings →
                </Link>
              )}
            </div>

            {nextStay ? (
              <div className="flex flex-col sm:flex-row">
                {/* Property image */}
                {nextStay.hotelImage && (
                  <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-52">
                    <Image
                      src={nextStay.hotelImage}
                      alt={nextStay.hotelName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 208px"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--green-light)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--rwanda-green)]">
                        Confirmed
                      </span>
                      {(() => {
                        const d = daysUntil(nextStay.checkIn);
                        if (d < 0 || d > 7) return null;
                        const label = d === 0 ? "Today!" : d === 1 ? "Tomorrow" : `In ${d} days`;
                        return (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gold-pale)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--gold-deep)]">
                            <span className="size-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
                            {label}
                          </span>
                        );
                      })()}
                    </div>
                    <h4 className="mt-3 font-serif text-2xl font-bold text-[var(--ink)]">
                      {nextStay.hotelName}
                    </h4>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {formatDate(nextStay.checkIn)} → {formatDate(nextStay.checkOut)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {nextStay.guests} guest{nextStay.guests > 1 ? "s" : ""} · {nextStay.nights} night{nextStay.nights > 1 ? "s" : ""}
                    </p>
                    {nextStay.totalRwf ? (
                      <p className="mt-3 font-serif text-xl font-semibold text-[var(--ink)]">
                        {formatRwf(nextStay.totalRwf)}
                        <span className="ml-1 text-xs font-normal text-[var(--muted)]">total (snapshot)</span>
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-5">
                    <Link
                      href={`/bookings/${nextStay.reference}`}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--ink)] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--ink-2)] sm:w-auto"
                    >
                      Manage booking <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 py-8 text-center sm:px-6 sm:py-12">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--gold-pale)] text-[var(--gold-deep)]">
                  <Sparkles size={26} />
                </div>
                <h4 className="mt-4 font-serif text-xl font-bold text-[var(--ink)]">No upcoming stays planned</h4>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted)]">
                  Explore Kigali&apos;s finest hosted residences and book your next escape.
                </p>
                <Link
                  href="/stays"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[var(--ink-2)] sm:w-auto"
                >
                  Browse stays <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Recent Activity Feed ──────────────────────────────────── */}
        {!bookingsResult.error && recentActivity.length > 0 && (
          <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--parchment)] px-4 py-4 sm:px-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Recent activity</h3>
              <Link
                href="/account/bookings"
                className="text-xs font-semibold text-[var(--gold-deep)] hover:text-[var(--ink)]"
              >
                View all →
              </Link>
            </div>
            <ul className="divide-y divide-[var(--line)]">
              {recentActivity.map((b) => {
                const cfg = STATUS_DOT[b.status] ?? STATUS_DOT["pending"];
                const Dot = cfg.icon;
                return (
                  <li key={b.id} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
                    <Dot size={16} className={`shrink-0 ${cfg.colour}`} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--ink)]">{b.hotelName}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {cfg.label} · {formatDate(b.checkIn)}
                      </p>
                    </div>
                    <Link
                      href={`/bookings/${b.reference}`}
                      className="shrink-0 text-[var(--gold-deep)] hover:text-[var(--ink)]"
                    >
                      <ArrowRight size={15} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ── Profile Card ──────────────────────────────────────────── */}
        {profileResult.error ? (
          <div className="rounded-2xl border border-dashed border-[var(--terracotta)]/30 bg-red-50 p-4 text-center">
            <p className="text-sm font-medium text-[var(--terracotta)]">Profile details are temporarily unavailable.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--parchment)] px-4 py-4 sm:px-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">Personal details</h3>
              <a
                href="https://accounts.clerk.com/user"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-[var(--gold-deep)] hover:text-[var(--ink)]"
              >
                Edit <ExternalLink size={11} />
              </a>
            </div>
            <div className="divide-y divide-[var(--line)]">
              <div className="grid gap-1 px-4 py-4 text-sm sm:grid-cols-[120px_1fr] sm:items-center sm:gap-3 sm:px-6">
                <span className="font-semibold text-[var(--ink)]">Name</span>
                <span className="text-[var(--muted)]">{profile?.name || "—"}</span>
              </div>
              <div className="grid gap-1 px-4 py-4 text-sm sm:grid-cols-[120px_1fr] sm:items-center sm:gap-3 sm:px-6">
                <span className="font-semibold text-[var(--ink)]">Email</span>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="break-all text-[var(--muted)]">{profile?.email || "—"}</span>
                  {profile?.email && (
                    <span className="rounded-full bg-[var(--green-light)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--rwanda-green)]">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              {profile?.phone && (
                <div className="grid gap-1 px-4 py-4 text-sm sm:grid-cols-[120px_1fr] sm:items-center sm:gap-3 sm:px-6">
                  <span className="font-semibold text-[var(--ink)]">Phone</span>
                  <span className="text-[var(--muted)]">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Support Card ──────────────────────────────────────────── */}
        <div className="rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--gold-pale)] to-[var(--cream)] p-4 shadow-sm sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--gold-deep)] shadow-sm">
              <LifeBuoy size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">Need assistance?</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Our Kigali guest relations team is available <strong className="text-[var(--ink)]">08:00–22:00 EAT</strong>, 
                seven days a week. We&apos;re here to help with any inquiries, schedule adjustments, or check-in questions.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ink)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[var(--ink-2)]"
                >
                  <Phone size={12} /> Contact support
                </Link>
                <a
                  href="https://wa.me/250700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--gold)]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] transition hover:border-[var(--gold)]"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AccountShell>
  );
}
