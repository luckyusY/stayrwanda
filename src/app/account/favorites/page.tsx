import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getSafeFavorites } from "@/lib/guest-account";
import { GuestFavoriteCard } from "@/components/guest-favorite-card";

export default async function FavoritesPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");

  const result = await getSafeFavorites(identity.userId);

  if (result.error) {
    return (
      <AccountShell title="Saved Properties">
        <div className="surface-3d bg-white p-8 border border-[var(--line)] rounded-xl text-center shadow-sm">
          <Heart className="mx-auto text-[#e33] animate-pulse" size={36} />
          <h2 className="mt-4 text-xl font-serif font-bold text-[var(--ink)]">
            Saved properties are temporarily unavailable
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            We encountered a database connection failure while trying to load your saved stays. Please reload the page or check back later.
          </p>
        </div>
      </AccountShell>
    );
  }

  const hotels = result.data || [];

  return (
    <AccountShell title="Saved Properties">
      {hotels.length ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {hotels.map((hotel) => (
            <GuestFavoriteCard key={hotel.id} favorite={hotel} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Save properties you like"
          copy="Tap the heart icon on any stay profile to save it here for quick reference."
          action="Browse properties"
          href="/stays"
        />
      )}
    </AccountShell>
  );
}
