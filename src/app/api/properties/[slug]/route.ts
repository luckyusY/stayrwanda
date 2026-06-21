import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import {
  deletePropertyBySlug,
  getPropertyBySlug,
  updatePropertyStatus,
  type PropertyStatus,
} from "@/lib/data";

const STATUSES: PropertyStatus[] = ["active", "pending", "inactive", "rejected"];

export async function GET(_request: Request, ctx: RouteContext<"/api/properties/[slug]">) {
  const { slug } = await ctx.params;
  const property = await getPropertyBySlug(slug);
  if (!property) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/properties/[slug]">) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { slug } = await ctx.params;
  let status: string;
  try {
    status = String((await request.json()).status ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!STATUSES.includes(status as PropertyStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const ok = await updatePropertyStatus(slug, status as PropertyStatus);
  if (!ok) return NextResponse.json({ error: "Not found or database unavailable." }, { status: 404 });
  return NextResponse.json({ ok: true, status });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/properties/[slug]">) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { slug } = await ctx.params;
  const ok = await deletePropertyBySlug(slug);
  if (!ok) return NextResponse.json({ error: "Not found or database unavailable." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
