"use client";

// Builds the "Shop the Collection" peek feed (one vertical card per
// published look, horizontal peek-swipe through that look's own piece
// photos) and renders it through the shared FullScreenSwiper.
//
// Used embedded, in normal page flow, right below a shoppable collection's
// intro (see app/collection/[slug]/shoppable-collection-client.tsx) so
// scrolling the hub page naturally carries you from the intro into the shop
// - there's no separate "/shop" page to navigate to anymore.

import {
  FullScreenSwiper,
  type SwiperGroup,
} from "@/components/full-screen-swiper";
import { getShopLooks, type Collection } from "@/lib/collections";
import { getProduct } from "@/lib/products";

function buildShopGroups(collection: Collection): SwiperGroup[] {
  const looks = getShopLooks(collection);

  return looks.map((look, index) => {
    // Every published look currently resolves to exactly one piece, so the
    // horizontal swipe inside its card browses that piece's own photo
    // gallery (front, back, detail shots, ...) rather than jumping between
    // different garments. If a look ever references more than one piece,
    // fall back to one cover-photo tile per piece so nothing breaks.
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
        ? `${singlePiece.category} \u00b7 ${singlePiece.price}`
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
            label: `${product.category.toUpperCase()} \u00b7 ${product.name}`,
            href: `/product/${product.slug}`,
          })),
    };
  });
}

function EmbeddedEmptyState({ collection }: { collection: Collection }) {
  return (
    <div className="flex h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-white/50 text-xs uppercase tracking-[0.25em]">
        The shop for {collection.name} is coming soon.
      </p>
    </div>
  );
}

export function ShopFeed({ collection }: { collection: Collection }) {
  const groups = buildShopGroups(collection);

  return (
    <FullScreenSwiper
      groups={groups}
      variant="embedded"
      emptyState={<EmbeddedEmptyState collection={collection} />}
    />
  );
}
