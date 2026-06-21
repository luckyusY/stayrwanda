// Custom next/image loader. For Cloudinary-hosted images it injects
// format/quality/responsive-width transformations so the CDN delivers a
// right-sized, modern-format image (fast LCP). Any non-Cloudinary src is
// returned untouched.

type LoaderArgs = { src: string; width: number; quality?: number };

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    const transforms = `f_auto,q_${quality || "auto"},c_limit,w_${width}`;
    return src.replace("/upload/", `/upload/${transforms}/`);
  }
  return src;
}
