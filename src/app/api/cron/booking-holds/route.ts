import { NextResponse } from "next/server";
import { releaseExpiredHolds } from "@/lib/booking-service";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  if (!env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ expired: await releaseExpiredHolds() });
}
