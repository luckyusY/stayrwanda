import { AdminShell } from "@/components/admin-shell";
import { AdminBookings } from "@/components/admin-bookings";
import { listBookings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reservations" };

export default async function AdminBookingsPage() {
  const bookings = await listBookings();
  return (
    <AdminShell title="Reservations" subtitle="Confirm, complete and manage guest requests">
      <AdminBookings bookings={bookings} />
    </AdminShell>
  );
}
