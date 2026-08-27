export interface CollectionImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * One outfit within a shoppable collection: a full editorial "look" photo
 * plus the individual garments ("pieces") that make it up, referenced by
 * their `Product.slug` from lib/products.ts. Order in `pieceSlugs` is the
 * order pieces appear when swiping through the look.
 */
export interface Look {
  image: CollectionImage;
  pieceSlugs: string[];
}

export interface Collection {
  slug: string;
  name: string;
  season: string;
  year: string;
  description: string;
  longDescription: string;
  heroImage: CollectionImage;
  /**
   * Optional CSS `object-position` for the hero image (e.g. "30% center").
   * Useful for landscape hero shots whose subject isn't centered, so wide
   * desktop viewports (which crop the image's sides more aggressively than
   * its native aspect ratio) don't clip the subject out of frame.
   */
  heroImagePosition?: string;
  /**
   * Optional dedicated Open Graph / social-share image (ideally 1200x630
   * with the logo and collection name already baked in, since most chat
   * apps render only this image + the page title/description). Falls back
   * to `heroImage` when not set, which keeps every other collection working
   * unchanged.
   */
  ogImage?: CollectionImage;
  /**
   * Optional dedicated cover for the /collections overview swiper. Falls
   * back to `heroImage`. Useful when the Hub-page hero is an atmospheric
   * mood shot (no garment in frame) but the browse tile should still show
   * an actual piece from the collection, the way every other collection's
   * `heroImage` already does double duty as both.
   */
  browseImage?: CollectionImage;
  images: CollectionImage[];
  /**
   * Optional. When present, the collection gets a "Shop the Collection"
   * immersive experience (scroll = looks, swipe = pieces of that look,
   * tap a piece = its product detail page). Collections without `looks`
   * behave exactly as before - this is fully additive and dynamic.
   */
  looks?: Look[];
}

const IMG_BASE = "https://le-marque.com/wp-content/uploads";

export const collections: Collection[] = [
  {
    slug: "malum",
    name: "MALUM",
    season: "Collection",
    year: "2026",
    description:
      "The newest LEMARQUE collection. Scroll through every look, swipe to shop each piece.",
    longDescription:
      "MALUM is the newest chapter for LEMARQUE: gowns cut like armor, cashmere outerwear closed with shark-tooth hardware, and leather goods built to outlast trend cycles. Scroll through every look, swipe right to shop the piece, and tap through to its own page for the full story.",
    // Wide/landscape mood shot (aerial view of a stormy sea at night, a
    // ship's light cutting through the waves) so the Collection Hub hero
    // fills wide desktop viewports without an awkward crop the way a
    // portrait garment photo would. Generated placeholder - swap for a real
    // MALUM campaign still whenever one is shot. The focal point (glowing
    // wave crest + light beam) sits near the horizontal center, so the
    // default centered object-position crops cleanly even on ultra-wide
    // screens.
    heroImage: {
      src: "/collections/malum/hero/malum-hero-wide.webp",
      alt: "MALUM Collection | Stormy sea at night",
      width: 1536,
      height: 1024,
    },
    // Same generated scene with the LEMARQUE mark and collection name
    // burned in, sized to the 1200x630 Open Graph standard - chat apps
    // (WhatsApp, Telegram, iMessage, ...) only ever show this flat image,
    // never the live page, so the branding needs to live in the pixels.
    ogImage: {
      src: "/collections/malum/og/malum-og-image.webp",
      alt: "MALUM Collection | LEMARQUE",
      width: 1200,
      height: 630,
    },
    // Same generated visual world as the hero/OG art (stormy sea at night,
    // same cold color grade), but framed on an actual garment - a man in
    // the Otodus Cashmere Coat on a dark shoreline - rather than the empty
    // sea. This is what shows as the collection's "cover" when browsing
    // /collections, matching how every other collection's cover is a real
    // look photo.
    browseImage: {
      src: "/collections/malum/editorial/malum-editorial-coat.webp",
      alt: "MALUM Collection | Otodus Cashmere Coat, stormy shoreline at night",
      width: 1024,
      height: 1365,
    },
    images: [
      {
        // Generated editorial shot, same stormy-sea-at-night setting as the
        // hero/cover, so the first thing you see swiping past the cover
        // isn't a plain white-background product photo.
        src: "/collections/malum/editorial/malum-editorial-latex.webp",
        alt: "MALUM Collection | Latex Slit Dress, stormy shoreline at night",
        width: 1024,
        height: 1365,
      },
      {
        src: "/collections/malum/products/malum-siren-gown/01.webp",
        alt: "MALUM Collection | Siren Gown",
        width: 960,
        height: 1600,
      },
      {
        src: "/collections/malum/products/malum-ao-dai-gown/01.webp",
        alt: "MALUM Collection | Ao Dai Gown",
        width: 1086,
        height: 1448,
      },
      {
        src: "/collections/malum/products/malum-cashmere-barathea-suit/01.webp",
        alt: "MALUM Collection | Cashmere Barathea Suit",
        width: 1166,
        height: 1600,
      },
      {
        // Same sea-shore editorial shot used as the collection's browseImage,
        // reused here as the piece's own cover instead of a plain studio
        // photo so the browsing feed stays in the collection's visual world.
        src: "/collections/malum/editorial/malum-editorial-coat.webp",
        alt: "MALUM Collection | Otodus Cashmere Coat, stormy shoreline at night",
        width: 1024,
        height: 1365,
      },
      {
        src: "/collections/malum/products/malum-otodus-trench-coat/01.webp",
        alt: "MALUM Collection | Otodus Trench Coat",
        width: 1195,
        height: 1600,
      },
      {
        src: "/collections/malum/products/malum-bomber-jacket/01.webp",
        alt: "MALUM Collection | MALUM Bomber Jacket",
        width: 1086,
        height: 1448,
      },
      {
        src: "/collections/malum/products/malum-blk-co-dress/01.webp",
        alt: "MALUM Collection | Cut-Out Knit Dress",
        width: 1086,
        height: 1448,
      },
    ],
    // Curated shop order (client-approved ranking). Products not in this
    // ranking (heels, Lumos bags) stay in lib/products.ts with
    // `lookIndex: -1` - their own /product/[slug] pages keep working, they
    // just don't appear in this swipeable feed.
    looks: [
      {
        image: {
          src: "/collections/malum/editorial/malum-editorial-coat.webp",
          alt: "MALUM | Otodus Cashmere Coat, stormy shoreline at night",
          width: 1024,
          height: 1365,
        },
        pieceSlugs: ["malum-otodus-cashmere-coat"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-otodus-trench-coat/01.webp",
          alt: "MALUM | Otodus Trench Coat",
          width: 1195,
          height: 1600,
        },
        pieceSlugs: ["malum-otodus-trench-coat"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-bomber-jacket/01.webp",
          alt: "MALUM | MALUM Bomber Jacket",
          width: 1086,
          height: 1448,
        },
        pieceSlugs: ["malum-bomber-jacket"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-cashmere-barathea-suit/01.webp",
          alt: "MALUM | Cashmere Barathea Suit",
          width: 1166,
          height: 1600,
        },
        pieceSlugs: ["malum-cashmere-barathea-suit"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-ao-dai-gown/01.webp",
          alt: "MALUM | Ao Dai Gown",
          width: 1086,
          height: 1448,
        },
        pieceSlugs: ["malum-ao-dai-gown"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-siren-gown/01.webp",
          alt: "MALUM | Siren Gown",
          width: 960,
          height: 1600,
        },
        pieceSlugs: ["malum-siren-gown"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-black-latex-dress/01.webp",
          alt: "MALUM | Latex Slit Dress",
          width: 914,
          height: 1600,
        },
        pieceSlugs: ["malum-black-latex-dress"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-blk-co-dress/01.webp",
          alt: "MALUM | Cut-Out Knit Dress",
          width: 1086,
          height: 1448,
        },
        pieceSlugs: ["malum-blk-co-dress"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-brawl-hoodie/01.webp",
          alt: "MALUM | Brawl Hoodie",
          width: 1247,
          height: 1600,
        },
        pieceSlugs: ["malum-brawl-hoodie"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-halfsleeve-suiting-set/01.webp",
          alt: "MALUM | Halfsleeve Knit & Suiting Trousers",
          width: 1084,
          height: 1451,
        },
        pieceSlugs: ["malum-halfsleeve-suiting-set"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-tank-top-suiting-set/01.webp",
          alt: "MALUM | Tank Top & Suiting Trousers",
          width: 1083,
          height: 1452,
        },
        pieceSlugs: ["malum-tank-top-suiting-set"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-leather-harness/01.webp",
          alt: "MALUM | Leather Chest Harness",
          width: 1084,
          height: 1451,
        },
        pieceSlugs: ["malum-leather-harness"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-mono-bag/01.webp",
          alt: "MALUM | Mono Bag",
          width: 1084,
          height: 1451,
        },
        pieceSlugs: ["malum-mono-bag"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-kidney-sling-bag/01.webp",
          alt: "MALUM | Kidney Sling Bag",
          width: 1218,
          height: 1600,
        },
        pieceSlugs: ["malum-kidney-sling-bag"],
      },
      {
        image: {
          src: "/collections/malum/products/malum-mini-handbag/01.webp",
          alt: "MALUM | Mini Handbag",
          width: 1278,
          height: 1231,
        },
        pieceSlugs: ["malum-mini-handbag"],
      },
    ],
  },
  {
    slug: "xxv",
    name: "XXV",
    season: "Collection",
    year: "2025",
    description:
      "Manufactured 1/1 attire. Handcrafted leather goods and avant-garde outerwear.",
    longDescription:
      "The XXV Collection marks a defining chapter for LEMARQUE. Shot at the iconic Kuhlhaus, this collection brings together handcrafted leather goods, bomber jackets, and accessories. Each piece manufactured as a unique 1/1 creation. Featuring genuine leather, stainless steel hardware, and cotton linings, every item embodies uncompromising craftsmanship. All items are handmade while select items may require fittings. The process of production usually takes up to 6 weeks.",
    heroImage: {
      src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_82-scaled.webp`,
      alt: "XXV Collection | LEMARQUE at Kuhlhaus",
      width: 2560,
      height: 1707,
    },
    images: [
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_7-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 1",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_35-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 2",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_39-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 3",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_44-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 4",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_65-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 5",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_69-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 6",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_75-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 7",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_80-scaled.webp`,
        alt: "XXV Collection | Kuhlhaus look 8",
        width: 2560,
        height: 1707,
      },
    ],
  },
  {
    slug: "xxv-products",
    name: "XXV PRODUCTS",
    season: "Collection",
    year: "2025",
    description:
      "The complete XXV product range: bombers, leather bags, harnesses, and accessories.",
    longDescription:
      "Each piece in the XXV product line is a testament to LEMARQUE's commitment to singular craftsmanship. From the Enduro Bomber and Skunk Worx Bomber to the leather shoppers and EMR accessories, every item features genuine leather, stainless steel details, and cotton linings. The bags feature reinforced leather edges and bottoms with stainless steel screws. All items are manufactured as unique 1/1 pieces. Price upon request.",
    heroImage: {
      src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-ENDURO-BOMBER-SEBIT-I-scaled.webp`,
      alt: "XXV Products | Enduro Bomber",
      width: 2560,
      height: 1707,
    },
    images: [
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-SKUNK-WORX-BOMBER-FRONT-scaled.webp`,
        alt: "XXV Products | Skunk Worx Bomber",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-WHITE-SHIRT-FRONT-OPEN-scaled.webp`,
        alt: "XXV Products | Suiting Shirt White",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-BLACK-SHIRT-FRONT-OPEN-scaled.webp`,
        alt: "XXV Products | Suiting Shirt Black",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-BROWN-LEATHER-SHOPPER-SEBIT-II-scaled.webp`,
        alt: "XXV Products | Brown Leather Shopper",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-ETADRY-SHOPPER-NALY-III-scaled.webp`,
        alt: "XXV Products | Etadry Shopper",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-EMR-DUFFLE-AARON-V-scaled.webp`,
        alt: "XXV Products | EMR Duffle",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-EMR-CROSSBODY-BAG-DIAGONAL-scaled.webp`,
        alt: "XXV Products | EMR Crossbody Bag",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2025/01/XXV-PRODUCTS-LEATHER-HARNESS-FEMALE-FRONT-scaled.webp`,
        alt: "XXV Products | Leather Harness",
        width: 2560,
        height: 1707,
      },
    ],
  },
  {
    slug: "xxi",
    name: "XXI",
    season: "Collection",
    year: "2019",
    description:
      "Captured by Lisa Lankes and Henning Strueve. Raw intimacy meets sculptural form.",
    longDescription:
      "The XXI Collection is a study in contrasts: the raw and the refined, the intimate and the monumental. Photographed by Lisa Lankes and Henning Strueve, this body of work captures LEMARQUE's vision of clothing as a second skin. Each piece speaks to the tension between vulnerability and armor, softness and structure.",
    heroImage: {
      src: `${IMG_BASE}/2024/02/2019_01_19_8-scaled.jpg`,
      alt: "XXI Collection | Lisa Lankes / Henning Strueve",
      width: 2560,
      height: 1707,
    },
    images: [
      {
        src: `${IMG_BASE}/2024/02/2019_01_19_20-scaled.jpg`,
        alt: "XXI Collection | look 1",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/2019_01_19_25-scaled.jpg`,
        alt: "XXI Collection | look 2",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/2019_01_19_31-scaled.jpg`,
        alt: "XXI Collection | look 3",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/2019_01_19_33-scaled.jpg`,
        alt: "XXI Collection | look 4",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/2019_01_19_39-scaled.jpg`,
        alt: "XXI Collection | look 5",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/2019_01_19_46-scaled.jpg`,
        alt: "XXI Collection | look 6",
        width: 2560,
        height: 1707,
      },
    ],
  },
  {
    slug: "xx",
    name: "XX",
    season: "Collection",
    year: "2018",
    description:
      "Saint X Barcelona. Mediterranean light meets industrial edge.",
    longDescription:
      "Shot against the backdrop of Barcelona, the XX Collection draws on the tension between the city's Mediterranean warmth and its raw industrial architecture. The Saint X series captures LEMARQUE's garments in natural light, revealing textures and construction details that define the brand's approach to wearable art.",
    heroImage: {
      src: `${IMG_BASE}/2024/02/AG_2553_s.jpg`,
      alt: "XX Collection | Saint X Barcelona",
      width: 1600,
      height: 1067,
    },
    images: [
      {
        src: `${IMG_BASE}/2024/02/AG_3561_s.jpg`,
        alt: "XX Collection | Barcelona look 1",
        width: 1600,
        height: 1067,
      },
      {
        src: `${IMG_BASE}/2024/02/AG_4895_s.jpg`,
        alt: "XX Collection | Barcelona look 2",
        width: 1600,
        height: 1067,
      },
      {
        src: `${IMG_BASE}/2024/03/AG_2424_s.jpg`,
        alt: "XX Collection | Barcelona look 3",
        width: 1600,
        height: 1067,
      },
      {
        src: `${IMG_BASE}/2024/03/AG_2540_s.jpg`,
        alt: "XX Collection | Barcelona look 4",
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    slug: "xix",
    name: "XIX",
    season: "Collection",
    year: "2018",
    description:
      "Athens. Ancient geometry reimagined through contemporary silhouettes.",
    longDescription:
      "The XIX Collection was born in Athens, where ancient geometry and modern life converge. Against the city's sun-bleached facades and weathered stone, LEMARQUE presents a series of silhouettes that reference classical proportions while pushing into uncharted territory. The result is a collection that feels both timeless and urgently contemporary.",
    heroImage: {
      src: `${IMG_BASE}/2024/02/LEMARQUE_ATHEN_17-scaled.jpg`,
      alt: "XIX Collection | Athens",
      width: 2560,
      height: 1707,
    },
    images: [
      {
        src: `${IMG_BASE}/2024/02/LEMARQUE_ATHEN_22-scaled.jpg`,
        alt: "XIX Collection | Athens look 1",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/LEMARQUE_ATHEN_23-scaled.jpg`,
        alt: "XIX Collection | Athens look 2",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/untitled-17-scaled.jpg`,
        alt: "XIX Collection | Athens look 3",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/untitled-22-scaled.jpg`,
        alt: "XIX Collection | Athens look 4",
        width: 2560,
        height: 1707,
      },
      {
        src: `${IMG_BASE}/2024/02/untitled-48-scaled.jpg`,
        alt: "XIX Collection | Athens look 5",
        width: 2560,
        height: 1707,
      },
    ],
  },
  {
    slug: "debut",
    name: "DEBUT",
    season: "Meisterklasse",
    year: "2017",
    description:
      "Where it all began. The first LEMARQUE collection, raw and uncompromising.",
    longDescription:
      "The Debut collection marks the genesis of LEMARQUE. Photographed by Andreas Klein and Dennis Zorn, this Meisterklasse presentation introduced the world to LEMARQUE's vision: clothing as sculpture, fashion as a form of resistance. These early pieces laid the foundation for everything that followed: raw materials, uncompromising construction, and a refusal to follow convention.",
    heroImage: {
      src: `${IMG_BASE}/2024/02/MANUFAKTUR-2018-ANDREAS-KLEIN-1.jpg`,
      alt: "DEBUT | Meisterklasse by Andreas Klein",
      width: 1600,
      height: 1067,
    },
    images: [
      {
        src: `${IMG_BASE}/2024/02/MANUFAKTUR-2018-ANDREAS-KLEIN-2.jpg`,
        alt: "DEBUT | Meisterklasse look 1",
        width: 1600,
        height: 1067,
      },
      {
        src: `${IMG_BASE}/2024/02/MANUFAKTUR-2018-ANDREAS-KLEIN-3.jpg`,
        alt: "DEBUT | Meisterklasse look 2",
        width: 1600,
        height: 1067,
      },
      {
        src: `${IMG_BASE}/2024/02/MANUFAKTUR-2018-ANDREAS-KLEIN-4.jpg`,
        alt: "DEBUT | Meisterklasse look 3",
        width: 1600,
        height: 1067,
      },
      {
        src: `${IMG_BASE}/2024/02/DENNIS-ZORN-comp.jpg`,
        alt: "DEBUT | Dennis Zorn",
        width: 1600,
        height: 1067,
      },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

/** True when the collection has an immersive, shoppable piece-by-piece experience. */
export function hasShoppableLooks(collection: Collection): boolean {
  return Boolean(collection.looks && collection.looks.length > 0);
}

export function getRelatedCollections(
  currentSlug: string,
  count = 3
): Collection[] {
  return collections.filter((c) => c.slug !== currentSlug).slice(0, count);
}
