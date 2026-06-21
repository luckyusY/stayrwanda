import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sr_admin";

// Demo-friendly defaults so the panel works out of the box. Override in the
// environment for any real deployment (see .env.example).
export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "stayrwanda2024";
}

export function adminToken() {
  return process.env.ADMIN_SESSION_SECRET || `sr-session-${adminPassword()}`;
}

export async function isAdminAuthed() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}
