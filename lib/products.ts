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

import { getCollection, getShopLooks } from "@/lib/collections";

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
  /**
   * Optional CSS `object-position` for the product detail page's hero
   * (e.g. "center 20%"). Most cover photos are plain studio shots centered
   * on the torso, where the default center crop reads fine on a wide hero.
   * Editorial/environmental cover photos (subject lower in frame, scenery
   * above) need to be anchored higher so the wide desktop crop doesn't cut
   * the subject's head off.
   */
  heroImagePosition?: string;
}

export const products: Product[] = [
  {
    slug: "malum-ao-dai-gown",
    name: "Ao Dai Gown",
    collectionSlug: "malum",
    lookIndex: 4,
    category: "Gown",
    price: "Price Upon Request",
    description:
      "A floor-length column gown with an asymmetric shoulder cutout and dramatic draped sleeves. Cut from fluid black fabric that pools into a train.",
    images: [
      { src: "/collections/malum/products/malum-ao-dai-gown/01.webp", alt: "MALUM | Ao Dai Gown", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-ao-dai-gown/02.webp", alt: "MALUM | Ao Dai Gown | detail 2", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-ao-dai-gown/03.webp", alt: "MALUM | Ao Dai Gown | detail 3", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-ao-dai-gown/04.webp", alt: "MALUM | Ao Dai Gown | detail 4", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-ao-dai-gown/05.webp", alt: "MALUM | Ao Dai Gown | detail 5", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-ao-dai-gown/06.webp", alt: "MALUM | Ao Dai Gown | detail 6", width: 1412, height: 1114 },
    ],
  },
  {
    slug: "malum-black-latex-dress",
    name: "Latex Slit Dress",
    collectionSlug: "malum",
    lookIndex: 6,
    category: "Dress",
    price: "Price Upon Request",
    description:
      "A halter-neck latex dress with a high side slit and a cascading ruffle train. Liquid black finish, styled with statement jewelry.",
    images: [
      { src: "/collections/malum/products/malum-black-latex-dress/01.webp", alt: "MALUM | Latex Slit Dress", width: 914, height: 1600 },
      { src: "/collections/malum/products/malum-black-latex-dress/02.webp", alt: "MALUM | Latex Slit Dress | detail 2", width: 1024, height: 1536 },
      { src: "/collections/malum/products/malum-black-latex-dress/03.webp", alt: "MALUM | Latex Slit Dress | detail 3", width: 1023, height: 1537 },
      { src: "/collections/malum/products/malum-black-latex-dress/04.webp", alt: "MALUM | Latex Slit Dress | detail 4", width: 1122, height: 1402 },
      { src: "/collections/malum/products/malum-black-latex-dress/05.webp", alt: "MALUM | Latex Slit Dress | detail 5", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-black-latex-dress/06.webp", alt: "MALUM | Latex Slit Dress | detail 6", width: 1200, height: 1600 },
      { src: "/collections/malum/products/malum-black-latex-dress/07.webp", alt: "MALUM | Latex Slit Dress | detail 7", width: 1065, height: 1600 },
      { src: "/collections/malum/products/malum-black-latex-dress/08.webp", alt: "MALUM | Latex Slit Dress | detail 8", width: 1024, height: 1536 },
      { src: "/collections/malum/products/malum-black-latex-dress/09.webp", alt: "MALUM | Latex Slit Dress | detail 9", width: 1086, height: 1448 },
    ],
  },
  {
    slug: "malum-blk-co-dress",
    name: "Cut-Out Knit Dress",
    collectionSlug: "malum",
    lookIndex: 7,
    category: "Dress",
    price: "Price Upon Request",
    description:
      "A body-conscious midi dress in fine black knit, with a plunging halter neckline and an open back. Finished with a side slit.",
    images: [
      { src: "/collections/malum/products/malum-blk-co-dress/01.webp", alt: "MALUM | Cut-Out Knit Dress", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-blk-co-dress/02.webp", alt: "MALUM | Cut-Out Knit Dress | detail 2", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-blk-co-dress/03.webp", alt: "MALUM | Cut-Out Knit Dress | detail 3", width: 1122, height: 1402 },
      { src: "/collections/malum/products/malum-blk-co-dress/04.webp", alt: "MALUM | Cut-Out Knit Dress | detail 4", width: 1024, height: 1536 },
      { src: "/collections/malum/products/malum-blk-co-dress/05.webp", alt: "MALUM | Cut-Out Knit Dress | detail 5", width: 1024, height: 1536 },
      { src: "/collections/malum/products/malum-blk-co-dress/06.webp", alt: "MALUM | Cut-Out Knit Dress | detail 6", width: 1323, height: 1189 },
      { src: "/collections/malum/products/malum-blk-co-dress/07.webp", alt: "MALUM | Cut-Out Knit Dress | detail 7", width: 1412, height: 1114 },
    ],
  },
  {
    slug: "malum-bomber-jacket",
    name: "MALUM Bomber Jacket",
    collectionSlug: "malum",
    lookIndex: 2,
    category: "Jacket",
    price: "Price Upon Request",
    description:
      "A boxy bomber in matte technical fabric with a high funnel collar and heavy-duty zip. Built for the MALUM outerwear line.",
    images: [
      { src: "/collections/malum/products/malum-bomber-jacket/01.webp", alt: "MALUM | MALUM Bomber Jacket", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-bomber-jacket/02.webp", alt: "MALUM | MALUM Bomber Jacket | detail 2", width: 1024, height: 1536 },
      { src: "/collections/malum/products/malum-bomber-jacket/03.webp", alt: "MALUM | MALUM Bomber Jacket | detail 3", width: 1109, height: 1600 },
      { src: "/collections/malum/products/malum-bomber-jacket/04.webp", alt: "MALUM | MALUM Bomber Jacket | detail 4", width: 1042, height: 1509 },
      { src: "/collections/malum/products/malum-bomber-jacket/05.webp", alt: "MALUM | MALUM Bomber Jacket | detail 5", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-bomber-jacket/06.webp", alt: "MALUM | MALUM Bomber Jacket | detail 6", width: 1086, height: 1448 },
      { src: "/collections/malum/products/malum-bomber-jacket/07.webp", alt: "MALUM | MALUM Bomber Jacket | detail 7", width: 1023, height: 1537 },
      { src: "/collections/malum/products/malum-bomber-jacket/08.webp", alt: "MALUM | MALUM Bomber Jacket | detail 8", width: 1210, height: 1600 },
      { src: "/collections/malum/products/malum-bomber-jacket/09.webp", alt: "MALUM | MALUM Bomber Jacket | detail 9", width: 1084, height: 1600 },
    ],
  },
  {
    slug: "malum-brawl-hoodie",
    name: "Brawl Hoodie",
    collectionSlug: "malum",
    lookIndex: 8,
    category: "Hoodie",
    price: "Price Upon Request",
    description:
      "An oversized fleece hoodie with a graphic print across the back. Heavyweight cotton, dropped shoulders, kangaroo pocket.",
    images: [
      { src: "/collections/malum/products/malum-brawl-hoodie/01.webp", alt: "MALUM | Brawl Hoodie", width: 1247, height: 1600 },
      { src: "/collections/malum/products/malum-brawl-hoodie/02.webp", alt: "MALUM | Brawl Hoodie | detail 2", width: 1244, height: 1600 },
    ],
  },
  {
    slug: "malum-cashmere-barathea-suit",
    name: "Cashmere Barathea Suit",
    collectionSlug: "malum",
    lookIndex: 3,
    category: "Suit",
    price: "Price Upon Request",
    description:
      "A single-breasted suit in cashmere barathea wool, tailored for a clean silhouette. Shown here with the matching leather duffle.",
    images: [
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/01.webp", alt: "MALUM | Cashmere Barathea Suit", width: 1166, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/02.webp", alt: "MALUM | Cashmere Barathea Suit | detail 2", width: 1014, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/03.webp", alt: "MALUM | Cashmere Barathea Suit | detail 3", width: 1014, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/04.webp", alt: "MALUM | Cashmere Barathea Suit | detail 4", width: 1211, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/05.webp", alt: "MALUM | Cashmere Barathea Suit | detail 5", width: 974, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/06.webp", alt: "MALUM | Cashmere Barathea Suit | detail 6", width: 1013, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/07.webp", alt: "MALUM | Cashmere Barathea Suit | detail 7", width: 1011, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/08.webp", alt: "MALUM | Cashmere Barathea Suit | detail 8", width: 1219, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/09.webp", alt: "MALUM | Cashmere Barathea Suit | detail 9", width: 1014, height: 1600 },
      { src: "/collections/malum/products/malum-cashmere-barathea-suit/10.webp", alt: "MALUM | Cashmere Barathea Suit | detail 10", width: 1145, height: 1600 },
    ],
  },
  {
    slug: "malum-halfsleeve-suiting-set",
    name: "Halfsleeve Knit & Suiting Trousers",
    collectionSlug: "malum",
    lookIndex: 9,
    category: "Set",
    price: "Price Upon Request",
    description:
      "A textured half-sleeve knit top paired with tailored suiting trousers. Sold as a two-piece set, worn together as one look.",
    images: [
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/01.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/02.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 2", width: 1075, height: 1463 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/03.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 3", width: 1077, height: 1461 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/04.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 4", width: 1077, height: 1461 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/05.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 5", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/06.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 6", width: 1075, height: 1464 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/07.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 7", width: 1075, height: 1464 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/08.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 8", width: 1230, height: 1600 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/09.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 9", width: 1212, height: 1600 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/10.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 10", width: 1229, height: 1600 },
      { src: "/collections/malum/products/malum-halfsleeve-suiting-set/11.webp", alt: "MALUM | Halfsleeve Knit & Suiting Trousers | detail 11", width: 1230, height: 1600 },
    ],
  },
  {
    slug: "malum-leather-harness",
    name: "Leather Chest Harness",
    collectionSlug: "malum",
    lookIndex: 11,
    category: "Harness",
    price: "Price Upon Request",
    description:
      "A structured leather chest harness with adjustable straps and stainless steel hardware. Worn over tailoring for a hard-soft contrast.",
    images: [
      { src: "/collections/malum/products/malum-leather-harness/01.webp", alt: "MALUM | Leather Chest Harness", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-leather-harness/02.webp", alt: "MALUM | Leather Chest Harness | detail 2", width: 1195, height: 1600 },
      { src: "/collections/malum/products/malum-leather-harness/03.webp", alt: "MALUM | Leather Chest Harness | detail 3", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-leather-harness/04.webp", alt: "MALUM | Leather Chest Harness | detail 4", width: 1084, height: 1451 },
    ],
  },
  {
    slug: "malum-fish-leather-heels",
    name: "Fish Leather Heels",
    collectionSlug: "malum",
    // Not part of the current curated MALUM look ranking; kept as a
    // standalone product page (still reachable via /product/[slug]) but
    // excluded from the shop feed and look-sibling matching.
    lookIndex: -1,
    category: "Heels",
    price: "Price Upon Request",
    description:
      "Square open-toe heels in embossed fish-leather texture. Sculpted block heel, minimal upper.",
    images: [
      { src: "/collections/malum/products/malum-fish-leather-heels/01.webp", alt: "MALUM | Fish Leather Heels", width: 1144, height: 1375 },
      { src: "/collections/malum/products/malum-fish-leather-heels/02.webp", alt: "MALUM | Fish Leather Heels | detail 2", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-fish-leather-heels/03.webp", alt: "MALUM | Fish Leather Heels | detail 3", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-fish-leather-heels/04.webp", alt: "MALUM | Fish Leather Heels | detail 4", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-fish-leather-heels/05.webp", alt: "MALUM | Fish Leather Heels | detail 5", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-fish-leather-heels/06.webp", alt: "MALUM | Fish Leather Heels | detail 6", width: 1122, height: 1402 },
    ],
  },
  {
    slug: "malum-nubuk-heels",
    name: "Nubuk Heels",
    collectionSlug: "malum",
    // Excluded from the current curated MALUM look ranking (see note above).
    lookIndex: -1,
    category: "Heels",
    price: "Price Upon Request",
    description:
      "Square open-toe heels in soft nubuk leather. Sculpted block heel, minimal upper.",
    images: [
      { src: "/collections/malum/products/malum-nubuk-heels/01.webp", alt: "MALUM | Nubuk Heels", width: 1122, height: 1402 },
      { src: "/collections/malum/products/malum-nubuk-heels/02.webp", alt: "MALUM | Nubuk Heels | detail 2", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-heels/03.webp", alt: "MALUM | Nubuk Heels | detail 3", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-heels/04.webp", alt: "MALUM | Nubuk Heels | detail 4", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-heels/05.webp", alt: "MALUM | Nubuk Heels | detail 5", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-heels/06.webp", alt: "MALUM | Nubuk Heels | detail 6", width: 1122, height: 1402 },
    ],
  },
  {
    slug: "malum-nubuk-matt-heels",
    name: "Nubuk Matt Heels",
    collectionSlug: "malum",
    // Excluded from the current curated MALUM look ranking (see note above).
    lookIndex: -1,
    category: "Heels",
    price: "Price Upon Request",
    description:
      "Square open-toe heels in matte nubuk leather for a softer, muted finish. Sculpted block heel, minimal upper.",
    images: [
      { src: "/collections/malum/products/malum-nubuk-matt-heels/01.webp", alt: "MALUM | Nubuk Matt Heels", width: 1122, height: 1402 },
      { src: "/collections/malum/products/malum-nubuk-matt-heels/02.webp", alt: "MALUM | Nubuk Matt Heels | detail 2", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-matt-heels/03.webp", alt: "MALUM | Nubuk Matt Heels | detail 3", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-matt-heels/04.webp", alt: "MALUM | Nubuk Matt Heels | detail 4", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-matt-heels/05.webp", alt: "MALUM | Nubuk Matt Heels | detail 5", width: 1448, height: 1086 },
      { src: "/collections/malum/products/malum-nubuk-matt-heels/06.webp", alt: "MALUM | Nubuk Matt Heels | detail 6", width: 1122, height: 1402 },
    ],
  },
  {
    slug: "malum-lumos-bag-black-fish",
    name: "Lumos Bag — Black Fish",
    collectionSlug: "malum",
    // Excluded from the current curated MALUM look ranking (see note above).
    lookIndex: -1,
    category: "Handbag",
    price: "Price Upon Request",
    description:
      "A structured shoulder bag with dual front pockets, in embossed black fish-leather. Zip-top closure with an adjustable strap.",
    images: [
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/01.webp", alt: "MALUM | Lumos Bag — Black Fish", width: 1323, height: 1189 },
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/02.webp", alt: "MALUM | Lumos Bag — Black Fish | detail 2", width: 1191, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/03.webp", alt: "MALUM | Lumos Bag — Black Fish | detail 3", width: 1191, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/04.webp", alt: "MALUM | Lumos Bag — Black Fish | detail 4", width: 1108, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/05.webp", alt: "MALUM | Lumos Bag — Black Fish | detail 5", width: 1108, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/06.webp", alt: "MALUM | Lumos Bag — Black Fish | detail 6", width: 1402, height: 1122 },
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/07.webp", alt: "MALUM | Lumos Bag — Black Fish | detail 7", width: 1213, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-fish/08.webp", alt: "MALUM | Lumos Bag — Black Fish | detail 8", width: 1213, height: 1600 },
    ],
  },
  {
    slug: "malum-lumos-bag-black-nubuk",
    name: "Lumos Bag — Black Nubuk",
    collectionSlug: "malum",
    // Excluded from the current curated MALUM look ranking (see note above).
    lookIndex: -1,
    category: "Handbag",
    price: "Price Upon Request",
    description:
      "A structured shoulder bag with dual front pockets, in smooth black nubuk leather. Zip-top closure with an adjustable strap.",
    images: [
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/01.webp", alt: "MALUM | Lumos Bag — Black Nubuk", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/02.webp", alt: "MALUM | Lumos Bag — Black Nubuk | detail 2", width: 1192, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/03.webp", alt: "MALUM | Lumos Bag — Black Nubuk | detail 3", width: 1192, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/04.webp", alt: "MALUM | Lumos Bag — Black Nubuk | detail 4", width: 1092, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/05.webp", alt: "MALUM | Lumos Bag — Black Nubuk | detail 5", width: 1092, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/06.webp", alt: "MALUM | Lumos Bag — Black Nubuk | detail 6", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/07.webp", alt: "MALUM | Lumos Bag — Black Nubuk | detail 7", width: 1191, height: 1600 },
      { src: "/collections/malum/products/malum-lumos-bag-black-nubuk/08.webp", alt: "MALUM | Lumos Bag — Black Nubuk | detail 8", width: 1191, height: 1600 },
    ],
  },
  {
    slug: "malum-lumos-bag-creme-fish",
    name: "Lumos Bag — Crème Fish",
    collectionSlug: "malum",
    // Excluded from the current curated MALUM look ranking (see note above).
    lookIndex: -1,
    category: "Handbag",
    price: "Price Upon Request",
    description:
      "A structured shoulder bag with dual front pockets, in embossed crème fish-leather. Zip-top closure with an adjustable strap.",
    images: [
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/01.webp", alt: "MALUM | Lumos Bag — Crème Fish", width: 1114, height: 1412 },
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/02.webp", alt: "MALUM | Lumos Bag — Crème Fish | detail 2", width: 1600, height: 1512 },
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/03.webp", alt: "MALUM | Lumos Bag — Crème Fish | detail 3", width: 1600, height: 1512 },
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/04.webp", alt: "MALUM | Lumos Bag — Crème Fish | detail 4", width: 1083, height: 1452 },
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/05.webp", alt: "MALUM | Lumos Bag — Crème Fish | detail 5", width: 1083, height: 1452 },
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/06.webp", alt: "MALUM | Lumos Bag — Crème Fish | detail 6", width: 1085, height: 1449 },
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/07.webp", alt: "MALUM | Lumos Bag — Crème Fish | detail 7", width: 1085, height: 1450 },
      { src: "/collections/malum/products/malum-lumos-bag-creme-fish/08.webp", alt: "MALUM | Lumos Bag — Crème Fish | detail 8", width: 1085, height: 1450 },
    ],
  },
  {
    slug: "malum-mini-handbag",
    name: "Mini Handbag",
    collectionSlug: "malum",
    lookIndex: 14,
    category: "Handbag",
    price: "Price Upon Request",
    description:
      "A compact top-handle bag in black leather with dual front pockets. Sized for essentials, finished with matte hardware.",
    images: [
      { src: "/collections/malum/products/malum-mini-handbag/01.webp", alt: "MALUM | Mini Handbag", width: 1278, height: 1231 },
      { src: "/collections/malum/products/malum-mini-handbag/02.webp", alt: "MALUM | Mini Handbag | detail 2", width: 1083, height: 1452 },
      { src: "/collections/malum/products/malum-mini-handbag/03.webp", alt: "MALUM | Mini Handbag | detail 3", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-mini-handbag/04.webp", alt: "MALUM | Mini Handbag | detail 4", width: 1023, height: 1537 },
      { src: "/collections/malum/products/malum-mini-handbag/05.webp", alt: "MALUM | Mini Handbag | detail 5", width: 1289, height: 1232 },
      { src: "/collections/malum/products/malum-mini-handbag/06.webp", alt: "MALUM | Mini Handbag | detail 6", width: 1072, height: 1600 },
      { src: "/collections/malum/products/malum-mini-handbag/07.webp", alt: "MALUM | Mini Handbag | detail 7", width: 1600, height: 1462 },
      { src: "/collections/malum/products/malum-mini-handbag/08.webp", alt: "MALUM | Mini Handbag | detail 8", width: 1600, height: 1462 },
    ],
  },
  {
    slug: "malum-kidney-sling-bag",
    name: "Kidney Sling Bag",
    collectionSlug: "malum",
    lookIndex: 13,
    category: "Handbag",
    price: "Price Upon Request",
    description:
      "A curved sling bag worn cross-body, cut from smooth leather with a single adjustable strap. Streamlined, hands-free carry.",
    images: [
      { src: "/collections/malum/products/malum-kidney-sling-bag/01.webp", alt: "MALUM | Kidney Sling Bag", width: 1218, height: 1600 },
      { src: "/collections/malum/products/malum-kidney-sling-bag/02.webp", alt: "MALUM | Kidney Sling Bag | detail 2", width: 1218, height: 1600 },
      { src: "/collections/malum/products/malum-kidney-sling-bag/03.webp", alt: "MALUM | Kidney Sling Bag | detail 3", width: 1012, height: 1600 },
      { src: "/collections/malum/products/malum-kidney-sling-bag/04.webp", alt: "MALUM | Kidney Sling Bag | detail 4", width: 1218, height: 1600 },
      { src: "/collections/malum/products/malum-kidney-sling-bag/05.webp", alt: "MALUM | Kidney Sling Bag | detail 5", width: 1012, height: 1600 },
    ],
  },
  {
    slug: "malum-mono-bag",
    name: "Mono Bag",
    collectionSlug: "malum",
    lookIndex: 12,
    category: "Handbag",
    price: "Price Upon Request",
    description:
      "A minimal single-compartment shoulder bag in smooth black leather, with a clean top-handle and understated hardware.",
    images: [
      { src: "/collections/malum/products/malum-mono-bag/01.webp", alt: "MALUM | Mono Bag", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-mono-bag/02.webp", alt: "MALUM | Mono Bag | detail 2", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-mono-bag/03.webp", alt: "MALUM | Mono Bag | detail 3", width: 1084, height: 1451 },
      { src: "/collections/malum/products/malum-mono-bag/04.webp", alt: "MALUM | Mono Bag | detail 4", width: 1085, height: 1450 },
      { src: "/collections/malum/products/malum-mono-bag/05.webp", alt: "MALUM | Mono Bag | detail 5", width: 1084, height: 1451 },
    ],
  },
  {
    slug: "malum-otodus-cashmere-coat",
    name: "Otodus Cashmere Coat",
    collectionSlug: "malum",
    lookIndex: 0,
    category: "Coat",
    price: "Price Upon Request",
    description:
      "A full-length double-breasted coat in brushed cashmere, closed with signature shark-tooth-shaped hardware.",
    images: [
      { src: "/collections/malum/editorial/malum-editorial-coat.webp", alt: "MALUM | Otodus Cashmere Coat, stormy shoreline at night", width: 1024, height: 1365 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/01.webp", alt: "MALUM | Otodus Cashmere Coat", width: 1197, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/02.webp", alt: "MALUM | Otodus Cashmere Coat | detail 2", width: 1197, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/03.webp", alt: "MALUM | Otodus Cashmere Coat | detail 3", width: 1195, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/04.webp", alt: "MALUM | Otodus Cashmere Coat | detail 4", width: 1195, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/05.webp", alt: "MALUM | Otodus Cashmere Coat | detail 5", width: 1109, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/06.webp", alt: "MALUM | Otodus Cashmere Coat | detail 6", width: 1109, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/07.webp", alt: "MALUM | Otodus Cashmere Coat | detail 7", width: 1044, height: 1507 },
      { src: "/collections/malum/products/malum-otodus-cashmere-coat/08.webp", alt: "MALUM | Otodus Cashmere Coat | detail 8", width: 1029, height: 1529 },
    ],
  },
  {
    slug: "malum-otodus-trench-coat",
    name: "Otodus Trench Coat",
    collectionSlug: "malum",
    lookIndex: 1,
    category: "Coat",
    price: "Price Upon Request",
    description:
      "A belted trench coat in tan faux-leather, cut long with a structured collar. Part of the Otodus outerwear family.",
    images: [
      { src: "/collections/malum/products/malum-otodus-trench-coat/01.webp", alt: "MALUM | Otodus Trench Coat", width: 1195, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-trench-coat/02.webp", alt: "MALUM | Otodus Trench Coat | detail 2", width: 1194, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-trench-coat/03.webp", alt: "MALUM | Otodus Trench Coat | detail 3", width: 1192, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-trench-coat/04.webp", alt: "MALUM | Otodus Trench Coat | detail 4", width: 1241, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-trench-coat/05.webp", alt: "MALUM | Otodus Trench Coat | detail 5", width: 1195, height: 1600 },
      { src: "/collections/malum/products/malum-otodus-trench-coat/06.webp", alt: "MALUM | Otodus Trench Coat | detail 6", width: 1195, height: 1600 },
    ],
  },
  {
    slug: "malum-siren-gown",
    name: "Siren Gown",
    collectionSlug: "malum",
    lookIndex: 5,
    category: "Gown",
    price: "Price Upon Request",
    description:
      "A fully beaded mermaid gown in an ombre fade from seafoam to rose. Deep V neckline, fitted through the body, dramatic train.",
    images: [
      { src: "/collections/malum/products/malum-siren-gown/01.webp", alt: "MALUM | Siren Gown", width: 960, height: 1600 },
      { src: "/collections/malum/products/malum-siren-gown/02.webp", alt: "MALUM | Siren Gown | detail 2", width: 1024, height: 1536 },
      { src: "/collections/malum/products/malum-siren-gown/03.webp", alt: "MALUM | Siren Gown | detail 3", width: 1061, height: 1483 },
      { src: "/collections/malum/products/malum-siren-gown/04.webp", alt: "MALUM | Siren Gown | detail 4", width: 1044, height: 1506 },
      { src: "/collections/malum/products/malum-siren-gown/05.webp", alt: "MALUM | Siren Gown | detail 5", width: 1085, height: 1450 },
      { src: "/collections/malum/products/malum-siren-gown/06.webp", alt: "MALUM | Siren Gown | detail 6", width: 1045, height: 1506 },
      { src: "/collections/malum/products/malum-siren-gown/07.webp", alt: "MALUM | Siren Gown | detail 7", width: 869, height: 1600 },
      { src: "/collections/malum/products/malum-siren-gown/08.webp", alt: "MALUM | Siren Gown | detail 8", width: 1122, height: 1402 },
      { src: "/collections/malum/products/malum-siren-gown/09.webp", alt: "MALUM | Siren Gown | detail 9", width: 839, height: 1600 },
      { src: "/collections/malum/products/malum-siren-gown/10.webp", alt: "MALUM | Siren Gown | detail 10", width: 1046, height: 1504 },
      { src: "/collections/malum/products/malum-siren-gown/11.webp", alt: "MALUM | Siren Gown | detail 11", width: 1075, height: 1463 },
      { src: "/collections/malum/products/malum-siren-gown/12.webp", alt: "MALUM | Siren Gown | detail 12", width: 1120, height: 1600 },
      { src: "/collections/malum/products/malum-siren-gown/13.webp", alt: "MALUM | Siren Gown | detail 13", width: 953, height: 1499 },
    ],
  },
  {
    slug: "malum-tank-top-suiting-set",
    name: "Tank Top & Suiting Trousers",
    collectionSlug: "malum",
    lookIndex: 10,
    category: "Set",
    price: "Price Upon Request",
    description:
      "A fitted white tank top paired with wide-leg suiting trousers. Sold as a two-piece set, worn together as one look.",
    images: [
      { src: "/collections/malum/products/malum-tank-top-suiting-set/01.webp", alt: "MALUM | Tank Top & Suiting Trousers", width: 1083, height: 1452 },
      { src: "/collections/malum/products/malum-tank-top-suiting-set/02.webp", alt: "MALUM | Tank Top & Suiting Trousers | detail 2", width: 1080, height: 1456 },
      { src: "/collections/malum/products/malum-tank-top-suiting-set/03.webp", alt: "MALUM | Tank Top & Suiting Trousers | detail 3", width: 1080, height: 1456 },
      { src: "/collections/malum/products/malum-tank-top-suiting-set/04.webp", alt: "MALUM | Tank Top & Suiting Trousers | detail 4", width: 1080, height: 1456 },
      { src: "/collections/malum/products/malum-tank-top-suiting-set/05.webp", alt: "MALUM | Tank Top & Suiting Trousers | detail 5", width: 1080, height: 1456 },
      { src: "/collections/malum/products/malum-tank-top-suiting-set/06.webp", alt: "MALUM | Tank Top & Suiting Trousers | detail 6", width: 1081, height: 1455 },
      { src: "/collections/malum/products/malum-tank-top-suiting-set/07.webp", alt: "MALUM | Tank Top & Suiting Trousers | detail 7", width: 1082, height: 1454 },
      { src: "/collections/malum/products/malum-tank-top-suiting-set/08.webp", alt: "MALUM | Tank Top & Suiting Trousers | detail 8", width: 1082, height: 1454 },
    ],
  },
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

/**
 * True when a product belongs to a look that's currently live in the shop
 * feed. Collections without a `looks` model (e.g. legacy static galleries)
 * have nothing to gate, so every one of their products is "shoppable".
 * This keeps "Shop This Look" / "More Pieces" from ever surfacing a piece
 * whose look hasn't been published yet.
 */
function isProductCurrentlyShoppable(product: Product): boolean {
  const collection = getCollection(product.collectionSlug);
  if (!collection?.looks) return true;
  return getShopLooks(collection).some((look) =>
    look.pieceSlugs.includes(product.slug)
  );
}

/**
 * Other pieces from the same look, excluding the current product. A piece
 * whose own look isn't published yet doesn't get to recommend anything
 * either - its detail page exists (direct link, not linked from anywhere
 * yet) but shouldn't act like a normal, live catalog page.
 */
export function getLookSiblings(product: Product): Product[] {
  if (!isProductCurrentlyShoppable(product)) return [];
  return getProductsByLook(product.collectionSlug, product.lookIndex)
    .filter((p) => p.slug !== product.slug)
    .filter(isProductCurrentlyShoppable);
}

export function getRelatedProducts(product: Product, count = 3): Product[] {
  if (!isProductCurrentlyShoppable(product)) return [];

  const sameCollection = products.filter(
    (p) =>
      p.collectionSlug === product.collectionSlug &&
      p.slug !== product.slug &&
      isProductCurrentlyShoppable(p)
  );
  if (sameCollection.length >= count) return sameCollection.slice(0, count);

  const others = products.filter(
    (p) => p.collectionSlug !== product.collectionSlug && isProductCurrentlyShoppable(p)
  );
  return [...sameCollection, ...others].slice(0, count);
}
