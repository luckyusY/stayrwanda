import { z } from "zod";
import { HOTEL_TEMPLATES, ROLES } from "@/lib/platform-types";

export const organizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
});

export const hotelDraftSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().trim().min(3).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  category: z.enum(["hotel", "residence", "guesthouse"]),
  template: z.enum(HOTEL_TEMPLATES).default("classic"),
  description: z.string().trim().min(40).max(6000),
  location: z.object({
    address: z.string().trim().min(3).max(250),
    neighborhood: z.string().trim().min(2).max(100),
    city: z.string().trim().min(2).max(100).default("Kigali"),
    country: z.string().trim().min(2).max(100).default("Rwanda"),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }),
  gallery: z.array(z.string().url()).min(1).max(80),
  amenities: z.array(z.string().trim().min(2).max(80)).max(80),
});

export const bookingRequestSchema = z.object({
  hotelId: z.string().min(1),
  unitTypeId: z.string().min(1),
  guestName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).default(""),
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  guests: z.number().int().min(1).max(30),
  quantity: z.number().int().min(1).max(10).default(1),
  message: z.string().trim().max(2000).default(""),
  currency: z.enum(["RWF", "USD"]).default("RWF"),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["confirmed", "rejected", "cancelled", "completed"]),
  note: z.string().trim().max(1000).optional(),
});

export const invitationSchema = z.object({
  organizationId: z.string().min(1),
  email: z.string().trim().email(),
  role: z.enum(ROLES).refine((role) => role !== "platform_admin"),
});

export const propertyCompatibilitySchema = z.object({
  organizationId: z.string().min(1),
  hotelId: z.string().optional(),
  title: z.string().trim().min(3).max(160),
  slug: z.string().optional(),
  location: z.string().trim().min(2),
  neighborhood: z.string().trim().min(2),
  address: z.string().trim().default(""),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  type: z.string().trim().min(2),
  description: z.string().trim().min(40),
  price: z.coerce.number().int().nonnegative(),
  guests: z.coerce.number().int().min(1).default(2),
  bedrooms: z.coerce.number().int().nonnegative().default(1),
  beds: z.coerce.number().int().nonnegative().default(1),
  baths: z.coerce.number().nonnegative().default(1),
  quantity: z.coerce.number().int().min(1).max(1000).default(1),
  minStay: z.coerce.number().int().min(1).max(365).default(1),
  template: z.enum(HOTEL_TEMPLATES).default("classic"),
  images: z.array(z.string().url()).min(1),
  amenities: z.array(z.string()).default([]),
  host: z.string().default("StayRwanda Partner"),
});
