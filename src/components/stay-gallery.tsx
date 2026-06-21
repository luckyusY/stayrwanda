"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import { SmartImage } from "@/components/smart-image";
import { Lightbox } from "@/components/lightbox";

/** Hero collage (up to 5 tiles) that opens the full zoomable gallery on click. */
export function StayHeroGallery({
  images,
  title,
  photoCount,
}: {
  images: string[];
  title: string;
  photoCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const hero = images.slice(0, 5);

  const launch = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="relative mt-7 grid h-[520px] grid-cols-2 gap-1.5 overflow-hidden md:grid-cols-4">
        {hero.map((image, i) => (
          <button
            key={image}
            onClick={() => launch(i)}
            className={`group relative overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            aria-label={`Open photo ${i + 1}`}
          >
            <SmartImage
              src={image}
              alt={`${title} photo ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-95"
              sizes={i === 0 ? "50vw" : "25vw"}
            />
          </button>
        ))}
        <button
          onClick={() => launch(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)] shadow transition hover:bg-[var(--cream)]"
        >
          <Images size={16} /> All {photoCount} photos
        </button>
      </div>

      <Lightbox images={images} open={open} index={index} alt={title} onClose={() => setOpen(false)} />
    </>
  );
}

/** Full photo grid that opens the zoomable gallery at the clicked image. */
export function StayPhotoGrid({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] overflow-hidden"
            aria-label={`Open photo ${i + 1}`}
          >
            <SmartImage
              src={image}
              alt={`${title} photo ${i + 1}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 100vw, 33vw"
            />
            <span className="pointer-events-none absolute inset-0 bg-[var(--ink)]/0 transition group-hover:bg-[var(--ink)]/10" />
          </button>
        ))}
      </div>

      <Lightbox images={images} open={open} index={index} alt={title} onClose={() => setOpen(false)} />
    </>
  );
}
