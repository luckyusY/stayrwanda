import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getSafeProfile, getSafeFavorites } from "@/lib/guest-account";
import { GuestFavoriteCard } from "@/components/guest-favorite-card";
import { FavoritesGrid } from "@/components/favorites-grid";

export default async function FavoritesPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");

  const [profileResult, result] = await Promise.all([
    getSafeProfile(identity.userId, identity.email),
    getSafeFavorites(identity.userId),
  ]);

  const profile = profileResult.data;

  if (result.error) {
    return (
      <AccountShell
        title="Saved Properties"
        userName={profile?.name}
        userEmail={profile?.email}
      >
        <div className="rounded-2xl border border-dashed border-[var(--terracotta)]/30 bg-red-50 p-10 text-center shadow-sm">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-100 text-[var(--terracotta)]">
            <Heart size={26} />
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-[var(--ink)]">
            Saved properties are temporarily unavailable
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            We encountered an issue loading your saved stays. Please reload the page or check back later.
          </p>
        </div>
      </AccountShell>
    );
  }

  const hotels = result.data || [];

  return (
    <AccountShell
      title="Saved Properties"
      userName={profile?.name}
      userEmail={profile?.email}
    >
      {hotels.length ? (
        <FavoritesGrid hotels={hotels} />
      ) : (
        <EmptyState
          icon={Heart}
          title="Save properties you love"
          copy="Tap the heart icon on any stay profile to save it here for quick reference and easy booking."
          action="Browse properties"
          href="/stays"
        />
      )}
    </AccountShell>
  );
}
