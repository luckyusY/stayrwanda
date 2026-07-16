"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * next/image with a built-in shimmer skeleton. Shows the warm skeleton until
 * the image finishes decoding, then fades it in. The parent must be
 * `position: relative` (these images use `fill`).
 */
export function SmartImage({ className = "", onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Cached images may already be complete before hydration — onLoad won't fire.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <span className="sr-skeleton absolute inset-0 z-0" aria-hidden="true" />}
      <Image
        alt={alt}
        ref={ref}
        {...props}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
