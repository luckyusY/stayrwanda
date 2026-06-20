import { NextResponse } from "next/server";
import { getCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "A valid image is required." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be smaller than 8MB." }, { status: 413 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = getCloudinary().uploader.upload_stream({ folder: "stayrwanda/properties", resource_type: "image" }, (error, upload) => {
        if (error || !upload) reject(error); else resolve(upload);
      });
      stream.end(bytes);
    });
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
