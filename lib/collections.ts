export interface CollectionImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Collection {
  slug: string;
  name: string;
  season: string;
  year: string;
  description: string;
  longDescription: string;
  heroImage: CollectionImage;
  images: CollectionImage[];
}

const IMG_BASE = "https://le-marque.com/wp-content/uploads";

export const collections: Collection[] = [
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

export function getRelatedCollections(
  currentSlug: string,
  count = 3
): Collection[] {
  return collections.filter((c) => c.slug !== currentSlug).slice(0, count);
}
