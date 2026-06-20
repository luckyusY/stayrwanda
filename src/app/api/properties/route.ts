import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { featuredProperties } from "@/lib/properties";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  try {
    const db = await getDb();
    const filter = query ? { $text: { $search: query } } : {};
    const properties = await db.collection("properties").find(filter).limit(40).toArray();
    return NextResponse.json({ properties: properties.length ? properties : featuredProperties });
  } catch {
    return NextResponse.json({ properties: featuredProperties, source: "seed" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.location || !Number.isFinite(Number(body.price))) {
      return NextResponse.json({ error: "Title, location and a valid price are required." }, { status: 400 });
    }
    const db = await getDb();
    const property = { ...body, price: Number(body.price), status: "pending", createdAt: new Date() };
    const result = await db.collection("properties").insertOne(property);
    return NextResponse.json({ property: { ...property, _id: result.insertedId } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create property." }, { status: 500 });
  }
}
