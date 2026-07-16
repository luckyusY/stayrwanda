import { NextResponse } from "next/server";
import { getDb, getMongoClient } from "@/lib/mongodb";
import { requireIdentity } from "@/lib/auth";
import { organizationSchema } from "@/lib/schemas";
import { recordAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const identity = await requireIdentity();
    const input = organizationSchema.parse(await request.json());
    const db = await getDb(); const client = await getMongoClient(); const session = client.startSession();
    let organizationId = "";
    try { await session.withTransaction(async () => {
      const now = new Date();
      const result = await db.collection("organizations").insertOne({ ...input, status: "active", ownerUserId: identity.userId, holdHours: 24, createdAt: now, updatedAt: now }, { session });
      organizationId = String(result.insertedId);
      await db.collection("memberships").insertOne({ organizationId, userId: identity.userId, role: "organization_owner", status: "active", createdAt: now }, { session });
      await recordAudit({ actor: identity, organizationId, action: "organization.create", recordType: "organization", recordId: organizationId, after: input, session });
    }); } finally { await session.endSession(); }
    return NextResponse.json({ organizationId }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: code.includes("duplicate") ? "That organization URL is already used." : "Unable to create organization." }, { status: code === "UNAUTHENTICATED" ? 401 : code.includes("duplicate") ? 409 : 400 });
  }
}
