import type { Hotel } from "@/lib/platform-types";
import { HotelCard } from "@/components/hotel-card";

export function HotelDirectory({ hotels, eyebrow, title, copy }: { hotels: Hotel[]; eyebrow: string; title: string; copy: string }) {
  return <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <p className="eyebrow">{eyebrow}</p>
    <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold text-[var(--ink)]">{title}</h1>
    <p className="mt-5 max-w-2xl leading-7 text-[var(--muted)]">{copy}</p>
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}</div>
    {!hotels.length && <div className="surface-3d mt-10 bg-[var(--cream)] p-10 text-center"><h2 className="font-serif text-2xl text-[var(--ink)]">More places are being prepared</h2><p className="mt-2 text-sm text-[var(--muted)]">Our local team is reviewing new profiles now.</p></div>}
  </section>;
}
