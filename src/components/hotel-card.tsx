import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Hotel } from "@/lib/platform-types";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return <article className="group border border-[var(--line)] bg-white">
    <Link href={`/hotels/${hotel.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--cream)]">
      {hotel.heroImage && <Image src={hotel.heroImage} alt={hotel.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />}
      <span className="absolute left-4 top-4 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[var(--ink)]">{hotel.category}</span>
    </Link>
    <div className="p-5">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-[.14em] text-[var(--muted)]"><MapPin size={13} className="text-[var(--gold-deep)]" />{hotel.location.neighborhood}, {hotel.location.city}</p>
      <Link href={`/hotels/${hotel.slug}`} className="mt-2 block font-serif text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--gold-deep)]">{hotel.name}</Link>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{hotel.description}</p>
      <Link href={`/hotels/${hotel.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[var(--gold-deep)]">View profile <ArrowRight size={14} /></Link>
    </div>
  </article>;
}
