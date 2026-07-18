import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getSafeBookings } from "@/lib/guest-account";
import { GuestBookingList } from "@/components/guest-booking-list";

export default async function BookingsPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");

  const result = await getSafeBookings(identity.userId, identity.email);

  if (result.error) {
    return (
      <AccountShell title="Bookings">
        <EmptyState
          icon={CalendarCheck}
          title="Booking history is temporarily unavailable"
          copy="We could not retrieve your booking requests from the database at this moment. If this persists, please contact support."
          action="Browse stays"
          href="/stays"
        />
      </AccountShell>
    );
  }

  const bookings = result.data || [];

  return (
    <AccountShell title="Bookings">
      <GuestBookingList bookings={bookings} />
    </AccountShell>
  );
}
