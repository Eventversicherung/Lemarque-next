// Product ("Kleidungsstück") data model.
//
// Every product listed here automatically gets:
//  - its own detail page at /product/[slug] (see app/product/[slug]/page.tsx)
//  - a slide inside the "Shop the collection" piece-swiper for its collection
//  - a "Shop the look" cross-link to the other pieces from the same look
//
// To add a new piece: append one object to `products` below and reference its
// `slug` from the matching look's `pieceSlugs` array in lib/collections.ts.
// Nothing else needs to change - pages, links and previews are generated
// dynamically from this single source of truth.

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Product {
  slug: string;
  name: string;
  collectionSlug: string;
  /** Index of the look (in the collection's `looks` array) this piece belongs to. */
  lookIndex: number;
  category: string;
  price: string;
  description: string;
  images: ProductImage[];
}

// Demo data for the MALUM collection. This proves the full flow end-to-end
// (collection -> look -> piece -> product page) with clearly-labelled
// placeholder content. Replace name/category/price/description/images with
// the real garment data once it is available, keeping the same slugs (or
// updating the matching `pieceSlugs` in lib/collections.ts if you rename
// them).
function malumPlaceholder(
  look: number,
  piece: number,
  category: string
): Product {
  const slug = `malum-look-${look}-piece-${piece}`;
  return {
    slug,
    name: `MALUM Sample Piece ${look}.${piece}`,
    collectionSlug: "malum",
    lookIndex: look - 1,
    category,
    price: "Price Upon Request",
    description:
      "Placeholder product - replace this entry in lib/products.ts with the real piece (name, price, description and photography) once the final MALUM assets are available.",
    images: [
      {
        src: `/collections/malum/pieces/${slug}.png`,
        alt: `MALUM | Look ${look} | ${category} (placeholder)`,
        width: 1200,
        height: 1500,
      },
    ],
  };
}

export const products: Product[] = [
  malumPlaceholder(1, 1, "Jacket"),
  malumPlaceholder(1, 2, "Trousers"),
  malumPlaceholder(1, 3, "Boots"),
  malumPlaceholder(2, 1, "Jacket"),
  malumPlaceholder(2, 2, "Trousers"),
  malumPlaceholder(2, 3, "Bag"),
  malumPlaceholder(3, 1, "Coat"),
  malumPlaceholder(3, 2, "Trousers"),
  malumPlaceholder(3, 3, "Boots"),
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((p) => p.collectionSlug === collectionSlug);
}

export function getProductsByLook(
  collectionSlug: string,
  lookIndex: number
): Product[] {
  return products.filter(
    (p) => p.collectionSlug === collectionSlug && p.lookIndex === lookIndex
  );
}

/** Other pieces from the same look, excluding the current product. */
export function getLookSiblings(product: Product): Product[] {
  return getProductsByLook(product.collectionSlug, product.lookIndex).filter(
    (p) => p.slug !== product.slug
  );
}

export function getRelatedProducts(product: Product, count = 3): Product[] {
  const sameCollection = products.filter(
    (p) => p.collectionSlug === product.collectionSlug && p.slug !== product.slug
  );
  if (sameCollection.length >= count) return sameCollection.slice(0, count);

  const others = products.filter(
    (p) => p.collectionSlug !== product.collectionSlug
  );
  return [...sameCollection, ...others].slice(0, count);
}
