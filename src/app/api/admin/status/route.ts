import { NextResponse } from "next/server";
import { currentIdentity } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const identity = await currentIdentity();
  return NextResponse.json({ isAdmin: !!identity?.platformAdmin });
}
