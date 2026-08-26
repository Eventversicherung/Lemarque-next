// Shared image-preloading helpers used by the fullscreen swipe experiences
// (collections overview and the per-collection "Shop the Collection" view).
// Kept in one place so both experiences preload consistently and cheaply.

const preloadedUrls = new Set<string>();

export function buildNextImageUrl(src: string, width = 1920): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

export function preloadImage(src: string, width = 1920) {
  if (typeof window === "undefined") return;
  const url = buildNextImageUrl(src, width);
  if (preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const img = new window.Image();
  img.src = url;
}
