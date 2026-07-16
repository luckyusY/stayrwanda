import { readFile } from "node:fs/promises";
import { MongoClient } from "mongodb";

const dryRun = process.argv.includes("--dry-run");
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "stayrwanda");
const migrationId = "2026-07-16-multi-hotel-v1";

const catalogue = [
  ["kibagabaga-apartment-one", "Kibagabaga Garden Apartment I", "Kibagabaga", "kibagabaga-1", "A bright furnished residence with landscaped entrance and secure compound parking."],
  ["kibagabaga-apartment-two", "Kibagabaga Garden Apartment II", "Kibagabaga", "kibagabaga-2", "A welcoming furnished residence with indoor and outdoor living in a gated compound."],
  ["kimironko-twin-apartment", "Kimironko Twin Apartment", "Kimironko", "kimironko-1", "A contemporary twin residence with furnished interiors, balconies and secure access."],
  ["kagarama-furnished-residence", "Kagarama Furnished Residence", "Kagarama", "kagarama", "A calm furnished residence in Kagarama with a complete photographic tour."],
  ["tg-executive-apartment", "TG Executive Apartment", "Kigali", "tga-apartment-1", "A modern multi-level executive residence with generous balconies and secure parking."],
  ["rebeccas-furnished-apartment", "Rebecca's Furnished Apartment", "Kigali", "rebeccas-apartment", "A spacious furnished apartment in a secure Kigali compound."],
  ["mama-lina-kimironko-home", "Mama Lina Kimironko Home", "Kimironko", "kimironko-mama-lina", "A private furnished home with mature greenery and a walled compound."],
];

async function gallery(folder) {
  const url = new URL(`../public/images/properties/${folder}/metadata.json`, import.meta.url);
  const metadata = JSON.parse(await readFile(url, "utf8"));
  return {
    images: metadata.images.map((image) => image.cloudinaryUrl || image.localPath),
    sourceUrl: metadata.sourceUrl,
  };
}

async function indexes() {
  await Promise.all([
    db.collection("users").createIndex({ clerkUserId: 1 }, { unique: true }),
    db.collection("organizations").createIndex({ slug: 1 }, { unique: true }),
    db.collection("memberships").createIndex({ organizationId: 1, userId: 1 }, { unique: true }),
    db.collection("hotels").createIndex({ slug: 1 }, { unique: true }),
    db.collection("hotels").createIndex({ organizationId: 1, status: 1 }),
    db.collection("hotelProfileVersions").createIndex({ hotelId: 1, version: -1 }, { unique: true }),
    db.collection("unitTypes").createIndex({ organizationId: 1, hotelId: 1 }),
    db.collection("availabilityNights").createIndex({ organizationId: 1, unitTypeId: 1, date: 1 }, { unique: true }),
    db.collection("bookings").createIndex({ organizationId: 1, idempotencyKey: 1 }, { unique: true }),
    db.collection("bookings").createIndex({ organizationId: 1, status: 1, checkIn: 1 }),
    db.collection("bookings").createIndex({ publicAccessTokenHash: 1 }, { unique: true, sparse: true }),
    db.collection("favorites").createIndex({ userId: 1, hotelId: 1 }, { unique: true }),
    db.collection("reviews").createIndex({ bookingId: 1 }, { unique: true }),
    db.collection("auditLogs").createIndex({ organizationId: 1, createdAt: -1 }),
    db.collection("invitations").createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection("invitations").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("rateLimits").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}

try {
  await client.connect();
  const applied = await db.collection("schemaMigrations").findOne({ migrationId });
  if (applied) {
    console.log(`${migrationId} already applied`);
    process.exitCode = 0;
  } else {
    const plan = { migrationId, hotels: catalogue.length, dryRun };
    console.log(JSON.stringify(plan, null, 2));
    if (!dryRun) {
      await indexes();
      const now = new Date();
      let organization = await db.collection("organizations").findOne({ slug: "stayrwanda-default" });
      if (!organization) {
        const result = await db.collection("organizations").insertOne({
          name: "StayRwanda Collection", slug: "stayrwanda-default", status: "active",
          ownerUserId: "migration-pending-owner", holdHours: 24, createdAt: now, updatedAt: now,
        });
        organization = { _id: result.insertedId };
      }
      const organizationId = String(organization._id);

      for (let index = 0; index < catalogue.length; index += 1) {
        const [slug, name, neighborhood, folder, description] = catalogue[index];
        const media = await gallery(folder);
        let hotel = await db.collection("hotels").findOne({ slug });
        if (!hotel) {
          const result = await db.collection("hotels").insertOne({
            organizationId, slug, legacySlug: slug, name, category: "residence", status: "published",
            template: ["classic", "editorial", "modern"][index % 3],
            location: { address: neighborhood, neighborhood, city: "Kigali", country: "Rwanda" },
            heroImage: media.images[0], gallery: media.images,
            amenities: ["Fully furnished", "Equipped kitchen", "On-site parking", "Private living area"],
            description, sourceUrl: media.sourceUrl, holdHours: 24,
            createdAt: now, updatedAt: now, publishedAt: now,
          });
          hotel = { _id: result.insertedId };
        }
        const hotelId = String(hotel._id);
        await db.collection("unitTypes").updateOne(
          { hotelId, name: "Entire residence" },
          { $setOnInsert: {
            organizationId, hotelId, name: "Entire residence", quantity: 1, maxGuests: 4,
            bedrooms: 2, beds: 2, baths: 2, basePriceRwf: 85000, minStay: 1,
            status: "published", amenities: ["Kitchen", "Parking", "WiFi"], images: media.images,
            createdAt: now, updatedAt: now,
          } },
          { upsert: true },
        );
        await db.collection("legacyRedirects").updateOne(
          { from: `/stays/${slug}` },
          { $set: { to: `/hotels/${slug}`, permanent: true, updatedAt: now } },
          { upsert: true },
        );
      }
      await db.collection("schemaMigrations").insertOne({ migrationId, appliedAt: new Date(), hotelCount: catalogue.length });
      console.log("Migration completed");
    }
  }
} finally {
  await client.close();
}
