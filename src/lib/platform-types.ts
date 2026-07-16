export const ROLES = [
  "platform_admin",
  "organization_owner",
  "organization_manager",
  "reservations_agent",
  "content_editor",
] as const;
export type Role = (typeof ROLES)[number];

export type Organization = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended";
  ownerUserId: string;
  holdHours: number;
  createdAt: string;
  updatedAt: string;
};

export type Membership = {
  id: string;
  organizationId: string;
  userId: string;
  role: Exclude<Role, "platform_admin">;
  status: "active" | "invited" | "revoked";
  createdAt: string;
};

export const HOTEL_TEMPLATES = ["classic", "editorial", "modern"] as const;
export type HotelTemplate = (typeof HOTEL_TEMPLATES)[number];
export type HotelStatus = "draft" | "pending" | "published" | "rejected" | "suspended";

export type Hotel = {
  id: string;
  organizationId: string;
  slug: string;
  name: string;
  category: "hotel" | "residence" | "guesthouse";
  status: HotelStatus;
  template: HotelTemplate;
  location: { address: string; neighborhood: string; city: string; country: string; lat?: number; lng?: number };
  heroImage?: string;
  gallery: string[];
  amenities: string[];
  description: string;
  publishedVersionId?: string;
  draftVersionId?: string;
  legacySlug?: string;
  createdAt: string;
  updatedAt: string;
};

export type UnitType = {
  id: string;
  organizationId: string;
  hotelId: string;
  name: string;
  quantity: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  basePriceRwf: number;
  minStay: number;
  status: "draft" | "published" | "inactive";
  amenities: string[];
  images: string[];
};

export type AuditAction =
  | "organization.create" | "membership.invite" | "membership.update"
  | "hotel.create" | "hotel.update" | "hotel.submit" | "hotel.publish" | "hotel.rollback"
  | "unit.create" | "unit.update" | "inventory.update"
  | "booking.create" | "booking.confirm" | "booking.reject" | "booking.cancel" | "booking.complete" | "booking.expire"
  | "offer.update" | "review.moderate";
