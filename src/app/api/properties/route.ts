import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { listProperties, listPublicProperties } from "@/lib/data";
import { isAdminAuthed } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase();
  const scope = searchParams.get("scope");

  // Admins (with a valid session) can list every status; the public sees live only.
  const properties = scope === "all" && (await isAdminAuthed())
    ? await listProperties()
    : await listPublicProperties();

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
    const body = await request.json();
    if (!body.title || !body.location || !Number.isFinite(Number(body.price))) {
      return NextResponse.json({ error: "Title, location and a valid price are required." }, { status: 400 });
    }
    const db = await getDb();
    const slug = String(body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const admin = await isAdminAuthed();
    const images: string[] = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
    const property = {
      ...body,
      slug,
      price: Number(body.price),
      images,
      image: images[0] || body.image || "",
      photoCount: images.length,
      // Admin-created listings go live immediately; partner submissions await review.
      status: admin ? "active" : "pending",
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection("properties").insertOne(property);
    return NextResponse.json({ property: { ...property, _id: result.insertedId } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create property." }, { status: 500 });
  }
}
