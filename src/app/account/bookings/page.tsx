import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { AccountShell, EmptyState } from "@/components/account-shell";
import { currentIdentity } from "@/lib/auth";
import { getSafeProfile, getSafeBookings } from "@/lib/guest-account";
import { GuestBookingList } from "@/components/guest-booking-list";

export default async function BookingsPage() {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");

  const [profileResult, result] = await Promise.all([
    getSafeProfile(identity.userId, identity.email),
    getSafeBookings(identity.userId, identity.email),
  ]);

  const profile = profileResult.data;

  if (result.error) {
    return (
      <AccountShell
        title="Bookings"
        userName={profile?.name}
        userEmail={profile?.email}
      >
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
    <AccountShell
      title="Bookings"
      userName={profile?.name}
      userEmail={profile?.email}
    >
      <GuestBookingList bookings={bookings} />
    </AccountShell>
  );
}
