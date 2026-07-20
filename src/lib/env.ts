import { z } from "zod";

const optionalEmail = z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional());
const optionalPhone = z.preprocess(
  (value) => value === "" ? undefined : value,
  z.string().regex(/^\+?[0-9]{8,15}$/).optional(),
);

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().min(1).optional(),
  MONGODB_DB: z.string().default("stayrwanda"),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().default("StayRwanda <bookings@stayrwanda.com>"),
  BOOKING_NOTIFICATION_EMAIL: optionalEmail,
  CRON_SECRET: z.string().min(24).optional(),
  PLATFORM_ADMIN_EMAILS: z.string().default(""),
  ALLOW_DEMO_AUTH: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: optionalPhone,
});

export const env = serverSchema.parse(process.env);

export function assertProductionConfiguration() {
  if (env.NODE_ENV !== "production") return;
  const required = [
    ["MONGODB_URI", env.MONGODB_URI],
    ["CLERK_SECRET_KEY", env.CLERK_SECRET_KEY],
    ["CLOUDINARY_CLOUD_NAME", env.CLOUDINARY_CLOUD_NAME],
    ["CLOUDINARY_API_KEY", env.CLOUDINARY_API_KEY],
    ["CLOUDINARY_API_SECRET", env.CLOUDINARY_API_SECRET],
    ["CRON_SECRET", env.CRON_SECRET],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (required.length) throw new Error(`Missing production configuration: ${required.join(", ")}`);
}

/** True only when both Clerk keys are non-empty after trim (empty Vercel vars still “exist”). */
export const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() && env.CLERK_SECRET_KEY?.trim(),
);
