import type { SwiperGroup } from "@/components/full-screen-swiper";
import { getShopLooks, type Collection } from "@/lib/collections";
import { getProduct } from "@/lib/products";

/**
 * Builds the "scroll = looks, swipe = pieces of that look" feed for a
 * shoppable collection. Shared by the standalone immersive /shop route and
 * the embedded shop section on the collection hub page, so both stay in
 * sync and there's a single place to change how looks map to slides.
 *
 * Only reads looks with `published: true` (see lib/collections.ts), so a
 * collection's remaining looks can be curated/ranked ahead of time and go
 * live one at a time without ever touching this file.
 */
/** Shop URL that restores the given piece's look card via hash. */
export function getShopPieceHref(collectionSlug: string, pieceSlug: string): string {
  return `/collection/${collectionSlug}/shop#${pieceSlug}`;
}

export function buildShopGroups(collection: Collection): SwiperGroup[] {
  const looks = getShopLooks(collection);

  return looks.map((look, index) => {
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
      eyebrow: `${collection.name} \u00b7 Look ${String(index + 1).padStart(2, "0")} / ${String(looks.length).padStart(2, "0")}`,
      title: look.name ?? (singlePiece ? singlePiece.name : `Look ${String(index + 1).padStart(2, "0")}`),
      description: singlePiece
        ? `${singlePiece.category} \u00b7 ${singlePiece.price}`
        : pieces.length > 0
          ? `${pieces[0].category} \u00b7 ${pieces.length} variants \u00b7 ${pieces[0].price}`
          : "Swipe right to shop every piece from this look.",
      coverHref: pieces[0] ? `/product/${pieces[0].slug}` : undefined,
      // Product slugs used as URL hashes so returning from a detail page
      // (or sharing a shop URL) lands on this exact look, not the top.
      anchorIds: pieces.map((product) => product.slug),
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
