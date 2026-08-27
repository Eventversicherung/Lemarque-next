"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  FullScreenSwiper,
  type SwiperGroup,
} from "@/components/full-screen-swiper";
import type { Collection } from "@/lib/collections";
import { getProduct } from "@/lib/products";

function ShopHeader({ collection }: { collection: Collection }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/70 via-black/25 to-transparent"
      />
      <div className="relative flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
        <BrandLogo size="sm" priority />
        <div className="flex items-center gap-6">
          <p className="hidden sm:block text-white/40 text-[10px] uppercase tracking-[0.2em]">
            Shopping {collection.name}
          </p>
          <Link
            href={`/collection/${collection.slug}`}
            className="text-white/60 hover:text-white transition-colors duration-300 text-xs uppercase tracking-[0.2em]"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LookShopClient({ collection }: { collection: Collection }) {
  const looks = collection.looks ?? [];

  const groups: SwiperGroup[] = looks.map((look, index) => {
    // Every look currently resolves to exactly one piece, so the horizontal
    // swipe inside its card browses that piece's own photo gallery (front,
    // back, detail shots, ...) rather than jumping between different
    // garments. If a look ever references more than one piece, fall back to
    // one cover-photo tile per piece so nothing breaks.
    const pieces = look.pieceSlugs
      .map((slug) => getProduct(slug))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));
    const singlePiece = pieces.length === 1 ? pieces[0] : null;

    return {
      key: `${collection.slug}-look-${index}`,
      media: look.image,
      eyebrow: singlePiece
        ? `${collection.name} \u00b7 Look ${String(index + 1).padStart(2, "0")} / ${String(looks.length).padStart(2, "0")}`
        : `${collection.name} / Scroll for more looks`,
      title: singlePiece ? singlePiece.name : `Look ${String(index + 1).padStart(2, "0")}`,
      description: singlePiece
        ? `${singlePiece.category} \u2014 ${singlePiece.price}`
        : "Swipe right to shop every piece from this look.",
      coverHref: singlePiece ? `/product/${singlePiece.slug}` : undefined,
      linkLabel: singlePiece ? "View full details" : undefined,
      persistentOverlay: Boolean(singlePiece),
      items: singlePiece
        ? singlePiece.images.slice(1).map((image) => ({
            media: image,
            href: `/product/${singlePiece.slug}`,
          }))
        : pieces.map((product) => ({
            media: product.images[0],
            label: `${product.category.toUpperCase()} \u2014 ${product.name}`,
            href: `/product/${product.slug}`,
          })),
    };
  });

  return (
    <FullScreenSwiper
      groups={groups}
      header={<ShopHeader collection={collection} />}
      emptyState={
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 px-6 text-center">
          <ShopHeader collection={collection} />
          <p className="text-white/60 text-xs uppercase tracking-[0.25em]">
            No shoppable looks yet for {collection.name}.
          </p>
          <Link
            href={`/collection/${collection.slug}`}
            className="text-white text-xs uppercase tracking-[0.2em] underline underline-offset-4"
          >
            Back to {collection.name}
          </Link>
        </div>
      }
    />
  );
}
