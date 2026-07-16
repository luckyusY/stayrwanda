import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getDb } from "@/lib/mongodb";

type ClerkEvent = { type: string; data: { id: string; email_addresses?: Array<{ email_address: string; id: string }>; primary_email_address_id?: string; first_name?: string; last_name?: string; image_url?: string } };

export async function POST(request: Request) {
  if (!env.CLERK_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  const headerStore = await headers();
  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: ClerkEvent;
  try {
    event = webhook.verify(await request.text(), {
      "svix-id": headerStore.get("svix-id") || "",
      "svix-timestamp": headerStore.get("svix-timestamp") || "",
      "svix-signature": headerStore.get("svix-signature") || "",
    }) as ClerkEvent;
  } catch { return NextResponse.json({ error: "Invalid signature." }, { status: 400 }); }
  const db = await getDb();
  if (event.type === "user.deleted") await db.collection("users").updateOne({ clerkUserId: event.data.id }, { $set: { status: "deleted", deletedAt: new Date() } });
  if (event.type === "user.created" || event.type === "user.updated") {
    const email = event.data.email_addresses?.find((item) => item.id === event.data.primary_email_address_id)?.email_address || event.data.email_addresses?.[0]?.email_address;
    await db.collection("users").updateOne({ clerkUserId: event.data.id }, { $set: {
      email: email?.toLowerCase(), firstName: event.data.first_name, lastName: event.data.last_name,
      imageUrl: event.data.image_url, status: "active", updatedAt: new Date(),
    }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
  }
  return NextResponse.json({ received: true });
}
