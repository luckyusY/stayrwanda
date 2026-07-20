import { Resend } from "resend";
import { env } from "@/lib/env";

type BookingEmailView = {
  reference: string;
  guest: { name: string; email: string };
  propertyName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalRwf: number;
  publicToken?: string;
};

function asBookingEmailView(value: unknown): BookingEmailView | null {
  if (!value || typeof value !== "object") return null;
  const booking = value as Record<string, unknown>;
  const guest = booking.guest as Record<string, unknown> | undefined;
  const property = booking.propertySnapshot as Record<string, unknown> | undefined;
  const pricing = booking.pricingSnapshot as Record<string, unknown> | undefined;
  if (typeof booking.reference !== "string" || typeof guest?.email !== "string" || typeof guest.name !== "string") return null;
  return {
    reference: booking.reference,
    guest: { name: guest.name, email: guest.email },
    propertyName: typeof property?.name === "string" ? property.name : "your StayRwanda property",
    checkIn: String(booking.checkIn || ""),
    checkOut: String(booking.checkOut || ""),
    nights: Number(booking.nights || 0),
    totalRwf: Number(pricing?.totalRwf || pricing?.subtotalRwf || 0),
    publicToken: typeof booking.publicToken === "string" ? booking.publicToken : undefined,
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

export async function sendBookingRequestEmails(rawBooking: unknown) {
  const booking = asBookingEmailView(rawBooking);
  if (!booking || !env.RESEND_API_KEY) return { guestSent: false, operationsSent: false };

  const resend = new Resend(env.RESEND_API_KEY);
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const statusUrl = booking.publicToken
    ? `${appOrigin}/bookings/${encodeURIComponent(booking.reference)}?token=${encodeURIComponent(booking.publicToken)}`
    : appOrigin;
  const details = `${escapeHtml(booking.checkIn)} to ${escapeHtml(booking.checkOut)} · ${booking.nights} night${booking.nights === 1 ? "" : "s"}`;
  const total = new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(booking.totalRwf);

  const guestResult = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: booking.guest.email,
    subject: `StayRwanda request ${booking.reference} received`,
    html: `<h1>Your request is received</h1><p>Hello ${escapeHtml(booking.guest.name)},</p><p>Your request for <strong>${escapeHtml(booking.propertyName)}</strong> has been received for ${details}.</p><p>Estimated stay total: <strong>${escapeHtml(total)}</strong>. No payment has been collected. The host will review your request while the dates are held.</p><p>Reference: <strong>${escapeHtml(booking.reference)}</strong></p><p><a href="${escapeHtml(statusUrl)}">Track your request</a></p>`,
  });

  let operationsSent = false;
  if (env.BOOKING_NOTIFICATION_EMAIL) {
    const operationsResult = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.BOOKING_NOTIFICATION_EMAIL,
      subject: `New StayRwanda booking request ${booking.reference}`,
      html: `<h1>New booking request</h1><p><strong>${escapeHtml(booking.propertyName)}</strong></p><p>Reference: ${escapeHtml(booking.reference)}</p><p>${details}</p><p>Estimated total: ${escapeHtml(total)}</p><p>Guest: ${escapeHtml(booking.guest.name)} (${escapeHtml(booking.guest.email)})</p>`,
    });
    operationsSent = !operationsResult.error;
  }

  return { guestSent: !guestResult.error, operationsSent };
}
