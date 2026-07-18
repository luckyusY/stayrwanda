import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { HotelCard } from "@/components/hotel-card";
import { currentIdentity } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { Hotel } from "@/lib/platform-types";

export default async function FavoritesPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");

  try {
    const db = await getDb();
    const favourites = await db.collection("favorites").find({ userId: identity.userId }).toArray();
    const hotelIds = favourites.map((favourite) => favourite.hotelId).filter(Boolean);
    const { ObjectId } = await import("mongodb");
    const objectIds = hotelIds.filter(ObjectId.isValid).map((id) => new ObjectId(id));
    const rows = objectIds.length
      ? await db.collection("hotels").find({ _id: { $in: objectIds }, status: "published" }).toArray()
      : [];
    const hotels = rows.map((row) => ({ ...row, id: String(row._id) }) as unknown as Hotel);

    return (
      <AccountShell title="Saved properties">
        {hotels.length ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
          </div>
        ) : (
          <EmptyState icon={Heart} title="Save properties you like" copy="Tap the heart on a stay and compare your favourites here later." action="Browse properties" href="/stays" />
        )}
      </AccountShell>
    );
  } catch (error) {
    console.error("Unable to load account favourites.", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
    return (
      <AccountShell title="Saved properties">
        <EmptyState
          icon={Heart}
          title="Saved properties are temporarily unavailable"
          copy="We could not load your saved properties right now. Please try again shortly."
          action="Browse properties"
          href="/stays"
        />
      </AccountShell>
    );
  }
}
