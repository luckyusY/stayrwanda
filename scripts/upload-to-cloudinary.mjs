// Uploads every local property image to Cloudinary and records the delivery
// URL + public_id back into each property's metadata.json.
//
//   node --env-file=.env.local scripts/upload-to-cloudinary.mjs
//
// Idempotent: images that already carry a `cloudinaryUrl` are skipped, and
// uploads use a deterministic public_id with overwrite:false so re-runs are
// cheap and safe.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ROOT = process.cwd();
const PROPERTIES_DIR = path.join(ROOT, "public", "images", "properties");

async function main() {
  const folders = await readdir(PROPERTIES_DIR, { withFileTypes: true });
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of folders) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;
    const metaPath = path.join(PROPERTIES_DIR, folder, "metadata.json");
    if (!existsSync(metaPath)) continue;

    const meta = JSON.parse(await readFile(metaPath, "utf8"));
    let changed = false;

    for (const image of meta.images) {
      if (image.cloudinaryUrl) {
        skipped += 1;
        continue;
      }
      const localFile = path.join(ROOT, "public", image.localPath.replace(/^\//, ""));
      if (!existsSync(localFile)) {
        console.warn(`  missing file: ${image.localPath}`);
        failed += 1;
        continue;
      }
      const baseName = image.filename.replace(/\.[^.]+$/, "");
      const publicId = `stayrwanda/properties/${folder}/${baseName}`;
      try {
        const result = await cloudinary.uploader.upload(localFile, {
          public_id: publicId,
          overwrite: false,
          resource_type: "image",
          // Strip metadata + cap the stored master at a sane size for the web.
          transformation: [{ width: 2560, height: 2560, crop: "limit" }],
        });
        image.cloudinaryUrl = result.secure_url;
        image.cloudinaryId = result.public_id;
        changed = true;
        uploaded += 1;
        process.stdout.write(`  ✓ ${folder}/${image.filename}\n`);
      } catch (error) {
        failed += 1;
        console.error(`  ✗ ${folder}/${image.filename}: ${error?.message || error}`);
      }
    }

    if (changed) {
      await writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n", "utf8");
      console.log(`Updated ${folder}/metadata.json`);
    }
  }

  console.log(`\nDone. uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
