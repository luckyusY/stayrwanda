/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDb } from "@/lib/mongodb";

export async function hostDashboardData(organizationId: string): Promise<{
  hotels: any[];
  bookings: any[];
  units: any[];
  guests: any[];
}> {
  const db = await getDb();
  const [hotels, bookings, units, guests] = await Promise.all([
    db.collection("hotels").find({ organizationId }).sort({ updatedAt: -1 }).toArray(),
    db.collection("bookings").find({ organizationId }).sort({ createdAt: -1 }).limit(100).toArray(),
    db.collection("unitTypes").find({ organizationId }).toArray(),
    db.collection("guests").find({ organizationId }).sort({ lastStayAt: -1 }).limit(100).toArray(),
  ]);
  const normalize = (rows: any[]) => rows.map((row) => ({ ...row, id: String(row._id) }));
  return { hotels: normalize(hotels), bookings: normalize(bookings), units: normalize(units), guests: normalize(guests) };
}
