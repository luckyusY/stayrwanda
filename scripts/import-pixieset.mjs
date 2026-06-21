import { mkdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const collection = "kibagabagaapartments";
const origin = "https://fullyfurnishedapartment73.pixieset.com";
const galleries = [
  { slug: "apartmentinkagarama", folder: "kagarama" },
  { slug: "apartmentkibagabaga1", folder: "kibagabaga-1" },
  { slug: "apartmentkibagabaga2", folder: "kibagabaga-2" },
  { slug: "apartmentinkimmironko1", folder: "kimironko-1" },
  { slug: "tgapartment1", folder: "tga-apartment-1" },
  { slug: "rebeccasapartment", folder: "rebeccas-apartment" },
  { slug: "kimironkomamalina", folder: "kimironko-mama-lina" },
];

const headers = { "user-agent": "Mozilla/5.0", "x-requested-with": "XMLHttpRequest" };
const root = path.resolve("public", "images", "properties");

function decodeJs(value) {
  return value.replace(/\\x([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)));
}

function cleanName(name) {
  return path.basename(name, path.extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function fetchText(url, extraHeaders = {}) {
  const response = await fetch(url, { headers: { ...headers, ...extraHeaders } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

async function download(url, destination, referer) {
  try {
    if ((await stat(destination)).size > 10_000) return false;
  } catch {}

  const response = await fetch(url, { headers: { "user-agent": headers["user-agent"], referer } });
  if (!response.ok) throw new Error(`${response.status} downloading ${url}`);
  const temporary = `${destination}.part`;
  await writeFile(temporary, Buffer.from(await response.arrayBuffer()));
  await rename(temporary, destination);
  return true;
}

async function importGallery(gallery) {
  const pageUrl = `${origin}/${collection}/${gallery.slug}/`;
  const html = await fetchText(pageUrl);
  const collectionId = html.match(/'collectionId':(\d+)/)?.[1];
  const collectionName = decodeJs(html.match(/'collectionName':'([^']+)'/)?.[1] ?? "Kigali Apartments");
  const pageTitle = decodeJs(html.match(/<title>\s*([^<]+?)\s*<\/title>/i)?.[1] ?? gallery.slug);
  const galleryLabel = decodeJs(
    html.match(new RegExp(`<li id="nav-${gallery.slug}"[^>]*>[\\s\\S]*?<a[^>]*>([\\s\\S]*?)<\\/a>`, "i"))?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ?? gallery.slug,
  );
  if (!collectionId) throw new Error(`Collection ID missing for ${gallery.slug}`);

  const photos = [];
  for (let page = 1; ; page += 1) {
    const query = new URLSearchParams({
      cuk: collection,
      cid: collectionId,
      gs: gallery.slug,
      fk: "",
      clientDownloads: "false",
      page: String(page),
      size: "64",
      "is-gd-preview": "false",
    });
    const payload = JSON.parse(await fetchText(`${origin}/client/loadphotos/?${query}`, { referer: pageUrl }));
    if (payload.status !== "success") throw new Error(`Gallery API failed for ${gallery.slug}`);
    photos.push(...JSON.parse(payload.content || "[]"));
    if (payload.isLastPage) break;
  }

  const directory = path.join(root, gallery.folder);
  await mkdir(directory, { recursive: true });
  const imageRecords = photos.map((photo, index) => {
    const extension = path.extname(photo.name).toLowerCase() || ".jpg";
    const filename = `${String(index + 1).padStart(2, "0")}-${cleanName(photo.name)}${extension}`;
    return {
      filename,
      localPath: `/images/properties/${gallery.folder}/${filename}`,
      originalName: photo.name,
      width: photo.width,
      height: photo.height,
      source: `https:${photo.pathXxlarge}`,
    };
  });

  let downloaded = 0;
  const concurrency = 6;
  for (let index = 0; index < imageRecords.length; index += concurrency) {
    const batch = imageRecords.slice(index, index + concurrency);
    const results = await Promise.all(batch.map((image) => download(image.source, path.join(directory, image.filename), pageUrl)));
    downloaded += results.filter(Boolean).length;
  }

  const metadata = {
    slug: gallery.slug,
    folder: gallery.folder,
    label: galleryLabel.replace(/\s+/g, " "),
    pageTitle: pageTitle.replace(/\s+/g, " "),
    collectionName,
    sourceUrl: pageUrl,
    photoCount: imageRecords.length,
    importedAt: new Date().toISOString(),
    images: imageRecords.map((image) => ({
      filename: image.filename,
      localPath: image.localPath,
      originalName: image.originalName,
      width: image.width,
      height: image.height,
    })),
  };
  await writeFile(path.join(directory, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  return { gallery: gallery.folder, photos: photos.length, downloaded, label: metadata.label };
}

for (const gallery of galleries) {
  try {
    const result = await importGallery(gallery);
    console.log(`${result.gallery}: ${result.photos} photos (${result.downloaded} new) — ${result.label}`);
  } catch (error) {
    console.error(`${gallery.folder}: ${error.message}`);
    process.exitCode = 1;
  }
}
