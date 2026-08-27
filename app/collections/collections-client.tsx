"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  FullScreenSwiper,
  type SwiperGroup,
} from "@/components/full-screen-swiper";
import { collections } from "@/lib/collections";

const groups: SwiperGroup[] = collections.map((collection) => {
  const href = `/collection/${collection.slug}`;
  return {
    key: collection.slug,
    media: collection.browseImage ?? collection.heroImage,
    eyebrow: `${collection.season} ${collection.year}`,
    title: collection.name,
    description: collection.description,
    // Every photo here (cover + peek images) belongs to the same
    // collection, so tapping any of them - not just a small text link on
    // the cover - should open that collection. Embla already distinguishes
    // a drag/swipe from a tap, so this doesn't fight the horizontal swipe
    // gesture.
    coverHref: href,
    linkLabel: "View full collection",
    items: collection.images.map((image, index) => ({
      media: image,
      label: `${collection.name} / Look ${String(index + 1).padStart(2, "0")}`,
      href,
    })),
  };
});

function CollectionsHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 z-30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/70 via-black/25 to-transparent"
      />
      <div className="relative flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
        <BrandLogo size="sm" priority />
        <Link
          href="/"
          className="text-white/60 hover:text-white transition-colors duration-300 text-xs uppercase tracking-[0.2em]"
        >
          Close
        </Link>
      </div>
    </div>
  );
}

export function CollectionsPageClient() {
  return (
    <FullScreenSwiper groups={groups} header={<CollectionsHeader />} edgeToEdge />
  );
}
