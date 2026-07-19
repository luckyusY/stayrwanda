export type MobileNavigationMode = "public" | "account" | "hidden";

const HIDDEN_ROUTE_PREFIXES = ["/admin", "/host", "/sign-in", "/register", "/booking/"];

export function getMobileNavigationMode(pathname: string): MobileNavigationMode {
  if (HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return "hidden";
  if (pathname === "/account" || pathname.startsWith("/account/")) return "account";
  return "public";
}
