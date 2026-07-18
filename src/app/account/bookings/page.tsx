import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

type BookingRow = {
  id: string;
  reference: string;
  checkIn: string;
  checkOut: string;
  nights: number | string;
  guests: number | string;
  status: string;
};

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export default async function BookingsPage() {
  try {
    const identity = await currentIdentity();
    if (!identity) redirect("/sign-in");

    let bookings: BookingRow[] = [];
    let loadError = false;

    try {
      const db = await getDb();
      const rows = await db
        .collection("bookings")
        .find({
          $or: [
            { userId: identity.userId },
            { clerkUserId: identity.userId },
            ...(identity.email ? [{ email: identity.email }, { guestEmail: identity.email }] : []),
          ],
        })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

      bookings = rows.map((booking) => ({
        id: String(booking._id),
        reference: String(booking.reference || booking._id),
        checkIn: String(booking.checkIn || "—"),
        checkOut: String(booking.checkOut || "—"),
        nights: (booking.nights as number | string | undefined) ?? "—",
        guests: (booking.guests as number | string | undefined) ?? "—",
        status: String(booking.status || "pending"),
      }));
    } catch (error) {
      loadError = true;
      console.error("Unable to load account bookings.", {
        message: error instanceof Error ? error.message : "Unknown database error",
      });
    }

    if (loadError) {
      return (
        <AccountShell title="Bookings and requests">
          <EmptyState
            icon={CalendarCheck}
            title="Booking history is temporarily unavailable"
            copy="We could not reach the booking database. Set a valid MONGODB_URI on Vercel and redeploy."
            action="Find a stay"
            href="/stays"
          />
        </AccountShell>
      );
    }

    return (
      <AccountShell title="Bookings and requests">
        {bookings.length ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="surface-3d surface-3d-lift p-5">
                <div className="flex justify-between gap-4">
                  <div>
                    <span className="text-xs text-[var(--muted)]">{booking.reference}</span>
                    <h2 className="mt-1 text-lg font-bold text-[var(--ink)]">
                      {booking.checkIn} → {booking.checkOut}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {booking.nights} nights · {booking.guests} guests
                    </p>
                  </div>
                  <span className="h-fit rounded-full bg-[var(--gold-pale)] px-3 py-1 text-xs font-bold capitalize text-[var(--gold-deep)]">
                    {booking.status}
                  </span>
                </div>
                <Link
                  href={`/bookings/${booking.reference}`}
                  className="mt-4 inline-block text-sm font-bold text-[var(--gold-deep)] hover:text-[var(--ink)]"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarCheck}
            title="No booking requests yet"
            copy="When you request a property, its confirmation status appears here."
            action="Find a stay"
            href="/stays"
          />
        )}
      </AccountShell>
    );
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    console.error("Bookings page failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return (
      <AccountShell title="Bookings and requests">
        <EmptyState
          icon={CalendarCheck}
          title="Booking history is temporarily unavailable"
          copy="Something went wrong while loading this page. Confirm Clerk and MongoDB env vars on Vercel, then redeploy."
          action="Go to sign in"
          href="/sign-in"
        />
      </AccountShell>
    );
  }
}
