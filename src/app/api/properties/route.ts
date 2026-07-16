import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { listPublicProperties } from "@/lib/data";
import { requireMembership } from "@/lib/auth";
import { propertyCompatibilitySchema } from "@/lib/schemas";
import { recordAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();
  const properties = await listPublicProperties();

  const filtered = query
    ? properties.filter((property) =>
        [property.title, property.location, property.neighborhood, property.type]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : properties;

  return NextResponse.json({ properties: filtered });
}

export async function POST(request: Request) {
  try {
    const body = propertyCompatibilitySchema.parse(await request.json());
    const { identity } = await requireMembership(body.organizationId, ["organization_owner", "organization_manager", "content_editor"]);
    const db = await getDb();
    const slug = String(body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const now = new Date();
    const hotel = {
      organizationId: body.organizationId, slug, legacySlug: slug, name: body.title,
      category: body.type.toLowerCase().includes("hotel") ? "hotel" : "residence",
      status: identity.platformAdmin ? "published" : "pending", template: body.template,
      location: { address: body.address || body.location, neighborhood: body.neighborhood, city: "Kigali", country: "Rwanda", lat: body.lat, lng: body.lng },
      heroImage: body.images[0], gallery: body.images, amenities: body.amenities,
      description: body.description, createdAt: now, updatedAt: now,
    };
    const result = await db.collection("hotels").insertOne(hotel);
    const hotelId = String(result.insertedId);
    await db.collection("unitTypes").insertOne({
      organizationId: body.organizationId, hotelId, name: "Entire residence", quantity: body.quantity,
      maxGuests: body.guests, bedrooms: body.bedrooms, beds: body.beds, baths: body.baths,
      basePriceRwf: body.price, minStay: body.minStay, status: identity.platformAdmin ? "published" : "draft",
      amenities: body.amenities, images: body.images, createdAt: now, updatedAt: now,
    });
    await recordAudit({ actor: identity, organizationId: body.organizationId, action: "hotel.create", recordType: "hotel", recordId: hotelId, after: hotel });
    revalidatePath("/host/hotels"); revalidatePath("/admin/properties");
    return NextResponse.json({ property: { ...hotel, _id: result.insertedId } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : message.includes("duplicate") ? 409 : 400;
    return NextResponse.json({ error: status === 400 ? "Invalid listing data." : message }, { status });
  }
}
