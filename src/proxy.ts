import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const proxy = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  ? clerkMiddleware()
  : () => NextResponse.next();

export default proxy;

export const config = {
  matcher: ["/((?!_next|.*\\.(?:html?|css|js(?!on)|jpg|jpeg|png|gif|svg|webp|ico|woff2?|map)).*)", "/(api|trpc)(.*)"],
};
