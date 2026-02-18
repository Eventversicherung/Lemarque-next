import type { Metadata } from "next";
import { collections } from "@/lib/collections";
import { CollectionsPageClient } from "./collections-client";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore all LEMARQUE collections. Handcrafted leather goods, avant-garde outerwear, and unique accessories.",
};

function buildPreloadUrl(src: string, width = 1920): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

export default function CollectionsPage() {
  const firstCollection = collections[0];
  const preloadSrcs = [
    firstCollection.heroImage.src,
    ...firstCollection.images.slice(0, 3).map((img) => img.src),
    collections[1]?.heroImage.src,
  ].filter(Boolean);

  return (
    <>
      {preloadSrcs.map((src) => (
        <link
          key={src}
          rel="preload"
          as="image"
          href={buildPreloadUrl(src)}
          fetchPriority="high"
        />
      ))}
      <CollectionsPageClient />
    </>
  );
}
