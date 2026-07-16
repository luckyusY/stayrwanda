import type { ClientSession } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { AppIdentity } from "@/lib/auth";
import type { AuditAction } from "@/lib/platform-types";

export async function recordAudit(input: {
  actor: AppIdentity;
  organizationId?: string;
  action: AuditAction;
  recordType: string;
  recordId: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  session?: ClientSession;
}) {
  const db = await getDb();
  await db.collection("auditLogs").insertOne({
    actorUserId: input.actor.userId,
    actorEmail: input.actor.email,
    organizationId: input.organizationId,
    action: input.action,
    recordType: input.recordType,
    recordId: input.recordId,
    reason: input.reason,
    before: summarize(input.before),
    after: summarize(input.after),
    createdAt: new Date(),
  }, { session: input.session });
}

function summarize(value: unknown) {
  if (value === undefined) return undefined;
  const json = JSON.stringify(value);
  if (json.length <= 12_000) return JSON.parse(json);
  return { truncated: true, originalLength: json.length, preview: json.slice(0, 12_000) };
}
