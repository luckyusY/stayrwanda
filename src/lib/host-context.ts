import { redirect } from "next/navigation";
import { currentIdentity, membershipsForUser } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function hostContext(options: { allowEmpty?: boolean } = {}) {
  const identity = await currentIdentity();
  if (!identity) redirect("/sign-in");
  let memberships = await membershipsForUser(identity.userId);
  if (identity.platformAdmin && !memberships.length) {
    const db = await getDb(); const organization = await db.collection("organizations").findOne({ status: "active" });
    if (organization) memberships = [{ id: "platform", organizationId: String(organization._id), userId: identity.userId, role: "organization_owner", status: "active", createdAt: new Date().toISOString() }];
  }
  if (!memberships.length && !options.allowEmpty) redirect("/host/onboarding");
  return { identity, memberships, membership: memberships[0] || null, organizationId: memberships[0]?.organizationId || null };
}
