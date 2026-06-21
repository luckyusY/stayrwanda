import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function NotFound() { return <main><SiteHeader compact /><div className="mx-auto max-w-xl px-4 py-24 text-center"><MapPinOff className="mx-auto text-[#006ce4]" size={48} /><h1 className="mt-5 text-4xl font-extrabold">Page not found</h1><p className="mt-3 text-[#595959]">We couldn&apos;t find the page you were looking for.</p><Link href="/search" className="mt-6 inline-block rounded bg-[#006ce4] px-5 py-3 font-bold text-white">Find a stay</Link></div><SiteFooter /></main>; }
