import { CalendarCheck } from "lucide-react";
import { AccountShell, EmptyState } from "@/components/account-shell";

export default function BookingsPage() { return <AccountShell title="Bookings and requests"><div className="mb-5 flex gap-2 border-b"><button className="border-b-2 border-[#006ce4] px-4 py-3 text-sm font-bold text-[#006ce4]">Upcoming</button><button className="px-4 py-3 text-sm">Past</button><button className="px-4 py-3 text-sm">Cancelled</button></div><EmptyState icon={CalendarCheck} title="No booking requests yet" copy="When you request a property, its confirmation status and host messages will appear here." action="Find a stay" href="/search" /></AccountShell>; }
