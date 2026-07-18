import { auth, currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { clerkConfigured, env } from "@/lib/env";
import type { Membership, Role } from "@/lib/platform-types";

export type AppIdentity = { userId: string; email?: string; platformAdmin: boolean };

export async function currentIdentity(): Promise<AppIdentity | null> {
  if (!clerkConfigured) {
    if (env.NODE_ENV !== "production" && env.ALLOW_DEMO_AUTH === "true") {
      return { userId: "demo-platform-admin", email: "demo@stayrwanda.local", platformAdmin: true };
    }
    return null;
  }
  const session = await auth();
  if (!session.userId) return null;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const configuredAdmins = env.PLATFORM_ADMIN_EMAILS.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  let appUser: { role?: string } | null = null;

  // Clerk remains the identity provider even while the application database is
  // unavailable. This keeps account settings accessible and lets database-backed
  // areas report their own actionable errors instead of crashing the whole page.
  try {
    const db = await getDb();
    const storedUser = await db.collection("users").findOne({ clerkUserId: session.userId });
    appUser = storedUser ? { role: typeof storedUser.role === "string" ? storedUser.role : undefined } : null;
  } catch (error) {
    console.error("Unable to load the application user record.", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
  }

  return {
    userId: session.userId,
    email,
    platformAdmin: appUser?.role === "platform_admin" || Boolean(email && configuredAdmins.includes(email)),
  };
}

export async function requireIdentity() {
  const identity = await currentIdentity();
  if (!identity) throw new Error("UNAUTHENTICATED");
  return identity;
}

export async function membershipsForUser(userId: string): Promise<Membership[]> {
  const db = await getDb();
  const rows = await db.collection("memberships").find({ userId, status: "active" }).toArray();
  return rows.map((row) => ({ ...row, id: String(row._id) } as unknown as Membership));
}

export async function requireMembership(
  organizationId: string,
  allowed: Array<Exclude<Role, "platform_admin">>,
) {
  const identity = await requireIdentity();
  if (identity.platformAdmin) return { identity, role: "platform_admin" as const };
  const db = await getDb();
  const membership = await db.collection("memberships").findOne({
    organizationId,
    userId: identity.userId,
    status: "active",
    role: { $in: allowed },
  });
  if (!membership) throw new Error("FORBIDDEN");
  return { identity, role: membership.role as Exclude<Role, "platform_admin"> };
}

export function asObjectId(value: string) {
  if (!ObjectId.isValid(value)) throw new Error("INVALID_ID");
  return new ObjectId(value);
}
