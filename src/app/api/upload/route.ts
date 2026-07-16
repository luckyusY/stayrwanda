import { NextResponse } from "next/server";
import { getCloudinary } from "@/lib/cloudinary";
import { requireMembership } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const organizationId = String(formData.get("organizationId") || "");
    const { identity } = await requireMembership(organizationId, ["organization_owner", "organization_manager", "content_editor"]);
    const file = formData.get("file");
    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "A valid image is required." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 8MB." }, { status: 413 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string; public_id: string; width: number; height: number; format: string }>((resolve, reject) => {
      const stream = getCloudinary().uploader.upload_stream({ folder: `stayrwanda/organizations/${organizationId}`, resource_type: "image", allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"] }, (error, upload) => {
        if (error || !upload) reject(error); else resolve(upload);
      });
      stream.end(bytes);
    });
    const asset = { organizationId, ownerUserId: identity.userId, url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height, format: result.format, createdAt: new Date() };
    const db = await getDb();
    const saved = await db.collection("mediaAssets").insertOne(asset);
    return NextResponse.json({ id: String(saved.insertedId), ...asset });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: message === "UNAUTHENTICATED" ? "Sign in required." : "Upload failed." }, { status: message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500 });
  }
}
