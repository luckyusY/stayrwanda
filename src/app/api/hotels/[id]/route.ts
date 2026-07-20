import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { currentIdentity, requireMembership } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { invalidatePublicCatalogue } from "@/lib/public-catalogue";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const db = await getDb();
    const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) });
    if (!hotel) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { identity } = await requireMembership(hotel.organizationId, ["organization_owner", "organization_manager", "content_editor"]);
    const body = await request.json();
    const allowed = {
      name: String(body.name || hotel.name).trim(),
      description: String(body.description || hotel.description).trim(),
      template: ["classic", "editorial", "modern"].includes(body.template) ? body.template : hotel.template,
      amenities: Array.isArray(body.amenities) ? body.amenities.map(String).slice(0, 80) : hotel.amenities,
      updatedAt: new Date(),
    };
    if (allowed.name.length < 3 || allowed.description.length < 40) return NextResponse.json({ error: "Name and a complete description are required." }, { status: 400 });
    await db.collection("hotels").updateOne({ _id: hotel._id }, { $set: allowed });
    await recordAudit({ actor: identity, organizationId: hotel.organizationId, action: "hotel.update", recordType: "hotel", recordId: id, before: { name: hotel.name, description: hotel.description, template: hotel.template }, after: allowed });
    invalidatePublicCatalogue();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: "Unable to update hotel." }, { status: code === "UNAUTHENTICATED" ? 401 : code === "FORBIDDEN" ? 403 : 400 });
  }
}

export async function POST(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const db = await getDb();
    const hotel = ObjectId.isValid(id) ? await db.collection("hotels").findOne({ _id: new ObjectId(id) }) : null;
    if (!hotel) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const input = await request.json();
    const identity = await currentIdentity();
    if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (input.action === "publish") {
      if (!identity.platformAdmin) return NextResponse.json({ error: "Platform review required" }, { status: 403 });
      const version = (await db.collection("hotelProfileVersions").countDocuments({ hotelId: id })) + 1;
      const snapshot = { organizationId: hotel.organizationId, hotelId: id, version, template: hotel.template, name: hotel.name, description: hotel.description, gallery: hotel.gallery, amenities: hotel.amenities, location: hotel.location, status: "published", createdAt: new Date(), createdBy: identity.userId };
      const result = await db.collection("hotelProfileVersions").insertOne(snapshot);
      await db.collection("hotels").updateOne({ _id: hotel._id }, { $set: { status: "published", publishedVersionId: String(result.insertedId), publishedAt: new Date(), updatedAt: new Date() } });
      await recordAudit({ actor: identity, organizationId: hotel.organizationId, action: "hotel.publish", recordType: "hotel", recordId: id, after: { version } });
      invalidatePublicCatalogue();
      revalidatePath("/hotels"); revalidatePath(`/hotels/${hotel.slug}`); revalidatePath("/stays"); revalidatePath("/residences");
      return NextResponse.json({ ok: true, status: "published" });
    }
    await requireMembership(hotel.organizationId, ["organization_owner", "organization_manager"]);
    await db.collection("hotels").updateOne({ _id: hotel._id }, { $set: { status: "pending", submittedAt: new Date(), updatedAt: new Date() } });
    await recordAudit({ actor: identity, organizationId: hotel.organizationId, action: "hotel.submit", recordType: "hotel", recordId: id, after: { status: "pending" } });
    return NextResponse.json({ ok: true, status: "pending" });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: "Unable to change publication status." }, { status: code === "FORBIDDEN" ? 403 : 400 });
  }
}
