import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { clerkConfigured } from "./auth";
import { seededNightlyRateRwf } from "./pricing";

export type GuestProfile = {
  userId: string;
  email: string;
  name: string;
  phone: string;
};

export type GuestBooking = {
  id: string;
  reference: string;
  hotelId: string;
  hotelName: string;
  hotelSlug: string;
  hotelImage?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  status: string;
  nightlyPriceRwf: number;
  totalPriceRwf: number;
  createdAt: string;
  // Compatibility fields for GuestBookingList
  propertyName: string;
  propertyImage?: string;
  nightlyRwf: number;
  totalRwf: number;
  isUpcoming: boolean;
};

export type GuestFavorite = {
  id: string;
  name: string;
  slug: string;
  neighborhood: string;
  city: string;
  heroImage?: string;
  amenities: string[];
  startingPriceRwf?: number;
};

export async function getSafeProfile(userId: string, userEmail?: string): Promise<{ data: GuestProfile | null; error: boolean }> {
  try {
    let name = "Guest User";
    let phone = "";
    let email = userEmail || "";

    if (clerkConfigured) {
      try {
        const { currentUser } = await import("@clerk/nextjs/server");
        const user = await currentUser();
        if (user) {
          name = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || name;
          phone = user.primaryPhoneNumber?.phoneNumber || phone;
          email = user.emailAddresses[0]?.emailAddress || email;
        }
      } catch (err) {
        console.error("Clerk is down or unreachable when loading profile:", err);
      }
    }

    return {
      data: {
        userId,
        email,
        name,
        phone,
      },
      error: false,
    };
  } catch (err) {
    console.error("Failed to load profile:", err);
    return { data: null, error: true };
  }
}

export async function getSafeBookings(userId: string, email?: string): Promise<{ data: GuestBooking[] | null; error: boolean }> {
  try {
    let db;
    try {
      db = await getDb();
    } catch (err) {
      console.error("MongoDB connection failed when loading bookings:", err);
      return { data: null, error: true };
    }

    const query = {
      $or: [
        { userId: userId },
        { clerkUserId: userId },
        ...(email ? [{ "guest.email": email.toLowerCase() }, { email: email.toLowerCase() }] : []),
      ],
    };

    const rows = await db.collection("bookings").find(query).sort({ createdAt: -1 }).limit(100).toArray();

    const hotelIds = rows.map((r) => r.hotelId).filter(Boolean);
    const objectIds = hotelIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    const stringIds = hotelIds.filter((id) => !ObjectId.isValid(id));

    const hotels: Record<string, { name: string; slug: string; heroImage?: string }> = {};

    try {
      const hotelRows = await db.collection("hotels").find({
        $or: [
          ...(objectIds.length ? [{ _id: { $in: objectIds } }] : []),
          ...(stringIds.length ? [{ id: { $in: stringIds } }] : []),
        ],
      }).toArray();

      for (const h of hotelRows) {
        hotels[String(h._id)] = {
          name: h.name,
          slug: h.slug,
          heroImage: h.heroImage,
        };
      }
    } catch (err) {
      console.error("Failed to fetch hotels for bookings view-model mapping:", err);
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    const bookings: GuestBooking[] = rows.map((b) => {
      const hotelInfo = hotels[String(b.hotelId)] || {};
      const pricing = b.pricingSnapshot || {};

      const nightlyPriceRwf = pricing.nightlyRwf || 0;
      const totalPriceRwf = pricing.subtotalRwf || (nightlyPriceRwf * (b.nights || 1));

      const hotelName = hotelInfo.name || b.propertyTitle || "StayRwanda Partner Residence";
      const hotelImage = hotelInfo.heroImage;
      const isUpcoming = String(b.checkOut || "") >= todayStr;

      return {
        id: String(b._id),
        reference: String(b.reference || b._id),
        hotelId: String(b.hotelId || ""),
        hotelName,
        hotelSlug: hotelInfo.slug || b.propertySlug || "stays",
        hotelImage,
        checkIn: String(b.checkIn || "—"),
        checkOut: String(b.checkOut || "—"),
        guests: Number(b.guests || 1),
        nights: Number(b.nights || 1),
        status: String(b.status || "pending"),
        nightlyPriceRwf,
        totalPriceRwf,
        createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString(),
        propertyName: hotelName,
        propertyImage: hotelImage,
        nightlyRwf: nightlyPriceRwf,
        totalRwf: totalPriceRwf,
        isUpcoming,
      };
    });

    return { data: bookings, error: false };
  } catch (err) {
    console.error("Failed to load guest bookings:", err);
    return { data: null, error: true };
  }
}

export async function getSafeFavorites(userId: string): Promise<{ data: GuestFavorite[] | null; error: boolean }> {
  try {
    let db;
    try {
      db = await getDb();
    } catch (err) {
      console.error("MongoDB connection failed when loading favorites:", err);
      return { data: null, error: true };
    }

    const favourites = await db
      .collection("favorites")
      .find({
        $or: [{ userId: userId }, { clerkUserId: userId }],
      })
      .toArray();

    if (!favourites.length) {
      return { data: [], error: false };
    }

    const hotelIds = favourites.map((favourite) => favourite.hotelId).filter(Boolean) as string[];
    const objectIds = hotelIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    const slugs = hotelIds.filter((id) => !ObjectId.isValid(id));

    const rows =
      objectIds.length || slugs.length
        ? await db
            .collection("hotels")
            .find({
              status: "published",
              $or: [
                ...(objectIds.length ? [{ _id: { $in: objectIds } }] : []),
                ...(slugs.length ? [{ slug: { $in: slugs } }] : []),
              ],
            })
            .toArray()
        : [];

    const hotelIdsForUnits = rows.map((row) => String(row._id));
    const units = await db.collection("unitTypes").find({ hotelId: { $in: hotelIdsForUnits }, status: "published" }).toArray();
    const lowestRateByHotel = new Map<string, number>();
    for (const unit of units) {
      const rate = Number(unit.basePriceRwf || 0);
      const hotelId = String(unit.hotelId || "");
      if (rate > 0 && (!lowestRateByHotel.has(hotelId) || rate < (lowestRateByHotel.get(hotelId) || rate))) {
        lowestRateByHotel.set(hotelId, rate);
      }
    }

    const dbHotels: GuestFavorite[] = rows.map((row) => {
      const location = (row.location || {}) as { neighborhood?: string; city?: string };
      const slug = String(row.slug || row._id);
      const id = String(row._id);

      const startingPriceRwf = lowestRateByHotel.get(id) || seededNightlyRateRwf(slug);

      return {
        id,
        name: String(row.name || "Stay"),
        slug,
        neighborhood: String(location.neighborhood || "Kigali"),
        city: String(location.city || "Rwanda"),
        heroImage: typeof row.heroImage === "string" ? row.heroImage : undefined,
        amenities: Array.isArray(row.amenities) ? row.amenities : [],
        startingPriceRwf,
      };
    });

    const foundSlugs = new Set(dbHotels.map(h => h.slug));
    const foundIds = new Set(dbHotels.map(h => h.id));
    const missingFavorites = favourites.filter(fav => {
      const id = fav.hotelId;
      const slug = fav.hotelSlug;
      return (!id || (!foundIds.has(id) && !foundSlugs.has(id))) && (!slug || !foundSlugs.has(slug));
    });

    const { featuredProperties } = await import("./properties");
    const fallbackHotels = missingFavorites.map(fav => {
      const slug = fav.hotelSlug || fav.hotelId;
      const seed = featuredProperties.find(p => p.slug === slug);
      if (!seed) return null;
      return {
        id: seed.slug,
        name: seed.title,
        slug: seed.slug,
        neighborhood: seed.neighborhood,
        city: "Kigali",
        heroImage: seed.image,
        amenities: seed.amenities || [],
        startingPriceRwf: seed.price || seededNightlyRateRwf(seed.slug),
      };
    }).filter(Boolean) as GuestFavorite[];

    const hotels = [...dbHotels, ...fallbackHotels];

    return { data: hotels, error: false };
  } catch (err) {
    console.error("Failed to load favorites:", err);
    return { data: null, error: true };
  }
}
