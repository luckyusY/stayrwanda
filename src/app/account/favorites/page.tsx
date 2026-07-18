import Link from "next/link";
import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

type SavedRow = {
  id: string;
  name: string;
  slug: string;
  neighborhood: string;
  city: string;
  heroImage?: string;
};

export default async function FavoritesPage() {
  try {
    const identity = await currentIdentity();
    if (!identity) redirect("/sign-in");

    let hotels: SavedRow[] = [];
    let loadError = false;

    try {
      const db = await getDb();
      const favourites = await db
        .collection("favorites")
        .find({
          $or: [{ userId: identity.userId }, { clerkUserId: identity.userId }],
        })
        .toArray();

      const hotelIds = favourites.map((favourite) => favourite.hotelId).filter(Boolean) as string[];
      const { ObjectId } = await import("mongodb");
      const objectIds = hotelIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
      const slugs = hotelIds.filter((id) => !ObjectId.isValid(id));

      const rows =
        objectIds.length || slugs.length
          ? await db
              .collection("hotels")
              .find({
                status: "published",
                $or: [
                  ...(objectIds.length ? [{ _id: { $in: objectIds } }] : []),
                  ...(slugs.length ? [{ slug: { $in: slugs } }] : []),
                ],
              })
              .toArray()
          : [];

      hotels = rows.map((row) => {
        const location = (row.location || {}) as { neighborhood?: string; city?: string };
        return {
          id: String(row._id),
          name: String(row.name || "Stay"),
          slug: String(row.slug || row._id),
          neighborhood: String(location.neighborhood || "Kigali"),
          city: String(location.city || "Rwanda"),
          heroImage: typeof row.heroImage === "string" ? row.heroImage : undefined,
        };
      });
    } catch (error) {
      loadError = true;
      console.error("Unable to load account favourites.", {
        message: error instanceof Error ? error.message : "Unknown database error",
      });
    }

    if (loadError) {
      return (
        <AccountShell title="Saved properties">
          <EmptyState
            icon={Heart}
            title="Saved properties are temporarily unavailable"
            copy="We could not reach the database. If this continues, set a valid MONGODB_URI on the Vercel deployment and redeploy."
            action="Browse properties"
            href="/stays"
          />
        </AccountShell>
      );
    }

    return (
      <AccountShell title="Saved properties">
        {hotels.length ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {hotels.map((hotel) => (
              <article key={hotel.id} className="surface-3d surface-3d-lift overflow-hidden">
                <Link href={`/hotels/${hotel.slug}`} className="block">
                  <div className="relative aspect-[4/3] bg-[var(--cream)]">
                    {hotel.heroImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={hotel.heroImage} alt={hotel.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                      {hotel.neighborhood}, {hotel.city}
                    </p>
                    <h2 className="mt-2 font-serif text-xl font-semibold text-[var(--ink)]">{hotel.name}</h2>
                    <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold-deep)]">
                      View stay →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Save properties you like"
            copy="Tap the heart on a stay and compare your favourites here later."
            action="Browse properties"
            href="/stays"
          />
        )}
      </AccountShell>
    );
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error("Favorites page failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return (
      <AccountShell title="Saved properties">
        <EmptyState
          icon={Heart}
          title="Saved properties are temporarily unavailable"
          copy="Something went wrong while loading this page. Check that Clerk and MongoDB environment variables are set on Vercel, then redeploy."
          action="Go to sign in"
          href="/sign-in"
        />
      </AccountShell>
    );
  }
}
