import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getSafeProfile, getSafeBookings, getSafeFavorites } from "@/lib/guest-account";
import { CalendarDays, Heart, ArrowRight, LifeBuoy, Sparkles, User } from "lucide-react";
import { formatRwf } from "@/lib/pricing";

export default async function AccountPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");

  // Load section data independently and safely
  const profileResult = await getSafeProfile(identity.userId, identity.email);
  const bookingsResult = await getSafeBookings(identity.userId, identity.email);
  const favoritesResult = await getSafeFavorites(identity.userId);

  const profile = profileResult.data;
  const bookings = bookingsResult.data || [];
  const favorites = favoritesResult.data || [];

  // Identify upcoming stays (confirmed bookings with check-in in the future or active today)
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" && b.checkOut >= todayStr
  );
  const nextStay = upcomingBookings[upcomingBookings.length - 1]; // next chronological stay

  return (
    <AccountShell title="Overview">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="surface-3d bg-white p-6 rounded-xl border border-[var(--line)] shadow-sm">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-[var(--cream)] text-[var(--gold-deep)] border border-[var(--gold)]">
              <User size={24} />
            </span>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
                Muraho, {profile?.name || "Guest"}
              </h2>
              <p className="text-sm text-[var(--muted)]">
                Welcome to your StayRwanda guest hub.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="surface-3d bg-white p-5 rounded-xl border border-[var(--line)] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-[var(--cream)] text-[var(--gold-deep)]">
                <CalendarDays size={20} />
              </div>
              <div>
                <span className="block text-2xl font-bold text-[var(--ink)]">
                  {bookingsResult.error ? "—" : bookings.length}
                </span>
                <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Bookings & requests</span>
              </div>
            </div>
            {!bookingsResult.error && (
              <Link href="/account/bookings" className="text-[var(--gold-deep)] hover:text-[var(--ink)]">
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          <div className="surface-3d bg-white p-5 rounded-xl border border-[var(--line)] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-[var(--cream)] text-[var(--gold-deep)]">
                <Heart size={20} />
              </div>
              <div>
                <span className="block text-2xl font-bold text-[var(--ink)]">
                  {favoritesResult.error ? "—" : favorites.length}
                </span>
                <span className="text-xs text-[var(--muted)] uppercase tracking-wider">Saved stays</span>
              </div>
            </div>
            {!favoritesResult.error && (
              <Link href="/account/favorites" className="text-[var(--gold-deep)] hover:text-[var(--ink)]">
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>

        {/* Fail-safe sections */}
        {bookingsResult.error && (
          <div className="surface-3d border-dashed border-[#e33]/30 bg-[#fff5f5] p-4 text-center rounded-xl">
            <p className="text-sm text-[#a33] font-medium">
              We are temporarily unable to fetch your booking records.
            </p>
          </div>
        )}

        {favoritesResult.error && (
          <div className="surface-3d border-dashed border-[#e33]/30 bg-[#fff5f5] p-4 text-center rounded-xl">
            <p className="text-sm text-[#a33] font-medium">
              We are temporarily unable to load your saved properties.
            </p>
          </div>
        )}

        {/* Upcoming Stay Card */}
        {!bookingsResult.error && (
          <div className="surface-3d bg-white rounded-xl border border-[var(--line)] overflow-hidden shadow-sm">
            <h3 className="bg-[var(--parchment)]/50 border-b border-[var(--line)] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              Your next stay
            </h3>
            <div className="p-6">
              {nextStay ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="inline-block rounded bg-[var(--gold-pale)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--gold-deep)]">
                      Confirmed Stay
                    </span>
                    <h4 className="mt-2 font-serif text-xl font-bold text-[var(--ink)]">
                      {nextStay.hotelName}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {nextStay.checkIn} → {nextStay.checkOut} · {nextStay.guests} guest{nextStay.guests > 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/bookings/${nextStay.reference}`}
                    className="button-3d inline-block bg-[var(--ink)] text-center text-xs font-semibold uppercase tracking-wider text-white px-5 py-3 shrink-0"
                  >
                    View Status Page
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Sparkles className="mx-auto text-[var(--gold-deep)]" size={30} />
                  <h4 className="mt-3 text-lg font-serif font-semibold text-[var(--ink)]">
                    No upcoming stays planned
                  </h4>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Explore Kigali's finest hosted residences and book your next stay.
                  </p>
                  <Link
                    href="/stays"
                    className="button-3d mt-4 inline-block bg-[var(--ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Browse Stays
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile details fail-safe */}
        {profileResult.error ? (
          <div className="surface-3d border-dashed border-[#e33]/30 bg-[#fff5f5] p-4 text-center rounded-xl">
            <p className="text-sm text-[#a33] font-medium">
              Profile details are temporarily unavailable.
            </p>
          </div>
        ) : (
          <div className="surface-3d bg-white p-6 rounded-xl border border-[var(--line)] shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[var(--ink)]">Personal Details</h3>
            <div className="mt-4 divide-y divide-[var(--line)]">
              <div className="grid gap-2 py-3 sm:grid-cols-[150px_1fr] text-sm">
                <strong className="text-[var(--ink)] font-semibold">Name</strong>
                <span className="text-[var(--muted)]">{profile?.name}</span>
              </div>
              <div className="grid gap-2 py-3 sm:grid-cols-[150px_1fr] text-sm">
                <strong className="text-[var(--ink)] font-semibold">Email</strong>
                <span className="text-[var(--muted)]">{profile?.email || "No email"}</span>
              </div>
              {profile?.phone && (
                <div className="grid gap-2 py-3 sm:grid-cols-[150px_1fr] text-sm">
                  <strong className="text-[var(--ink)] font-semibold">Phone</strong>
                  <span className="text-[var(--muted)]">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Support & Quick Help Prompt */}
        <div className="surface-3d bg-[var(--cream)] border border-[var(--gold)]/30 p-5 rounded-xl flex gap-4 items-start shadow-sm">
          <LifeBuoy className="text-[var(--gold-deep)] shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)] uppercase tracking-wider">
              Need assistance?
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Our guest relations team is here to help with any inquiries, schedule adjustments, or check-in questions.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] hover:text-[var(--ink)]"
            >
              Contact guest support <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
