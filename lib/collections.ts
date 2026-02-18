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

export const collections: Collection[] = [
  {
    slug: "void",
    name: "VOID",
    season: "Fall/Winter",
    year: "2026",
    description: "An exploration of absence and the beauty found in emptiness.",
    longDescription:
      "VOID interrogates the spaces between — the pauses in conversation, the gaps in memory, the negative space that defines form. Through deconstructed silhouettes and monochromatic palettes, this collection strips fashion to its essential elements, revealing that what is absent speaks as loudly as what remains.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80&fit=crop",
      alt: "VOID collection hero — dark minimal fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop",
        alt: "VOID look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80&fit=crop",
        alt: "VOID look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&fit=crop",
        alt: "VOID look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80&fit=crop",
        alt: "VOID look 4",
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    slug: "eclipse",
    name: "ECLIPSE",
    season: "Spring/Summer",
    year: "2026",
    description:
      "When light meets shadow — the moment of transformation captured in fabric.",
    longDescription:
      "ECLIPSE captures the fleeting instant when darkness overtakes light, creating a liminal space of extraordinary beauty. Translucent layers, gradients of black to white, and architectural draping reference celestial mechanics while remaining deeply grounded in the human form.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80&fit=crop",
      alt: "ECLIPSE collection hero — light and shadow fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80&fit=crop",
        alt: "ECLIPSE look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80&fit=crop",
        alt: "ECLIPSE look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&fit=crop",
        alt: "ECLIPSE look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1581044777550-4cfa60707998?w=800&q=80&fit=crop",
        alt: "ECLIPSE look 4",
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    slug: "fracture",
    name: "FRACTURE",
    season: "Fall/Winter",
    year: "2025",
    description:
      "Broken lines reassembled — finding strength in imperfection.",
    longDescription:
      "FRACTURE draws from the Japanese philosophy of kintsugi — the art of repairing broken pottery with gold. Each garment in this collection features deliberate breaks in pattern, asymmetric cuts, and raw edges that celebrate imperfection as a form of beauty. The collection argues that what has been broken and mended is more beautiful than what was never damaged.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80&fit=crop",
      alt: "FRACTURE collection hero — deconstructed fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80&fit=crop",
        alt: "FRACTURE look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80&fit=crop",
        alt: "FRACTURE look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80&fit=crop",
        alt: "FRACTURE look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1544957992-20514f595d6f?w=800&q=80&fit=crop",
        alt: "FRACTURE look 4",
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    slug: "monolith",
    name: "MONOLITH",
    season: "Spring/Summer",
    year: "2025",
    description:
      "Singular vision, unmoving presence — fashion as architecture.",
    longDescription:
      "MONOLITH is a meditation on permanence in a disposable world. Inspired by brutalist architecture and ancient standing stones, this collection features rigid structures softened by luxurious fabrics. Concrete grays meet flowing silks, creating a dialogue between the immovable and the ethereal.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80&fit=crop",
      alt: "MONOLITH collection hero — architectural fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80&fit=crop",
        alt: "MONOLITH look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&fit=crop",
        alt: "MONOLITH look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=800&q=80&fit=crop",
        alt: "MONOLITH look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80&fit=crop",
        alt: "MONOLITH look 4",
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    slug: "obsidian",
    name: "OBSIDIAN",
    season: "Fall/Winter",
    year: "2024",
    description: "Volcanic glass — sharp, dark, reflective. Fashion forged in fire.",
    longDescription:
      "OBSIDIAN takes its name and inspiration from volcanic glass — a material born of extreme heat and rapid cooling. This collection features razor-sharp tailoring in jet-black fabrics with subtle iridescent finishes that catch the light like polished stone. Every piece embodies controlled intensity.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1536243298747-ea8874136d64?w=1920&q=80&fit=crop",
      alt: "OBSIDIAN collection hero — dark reflective fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop",
        alt: "OBSIDIAN look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fit=crop",
        alt: "OBSIDIAN look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&fit=crop",
        alt: "OBSIDIAN look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80&fit=crop",
        alt: "OBSIDIAN look 4",
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    slug: "silhouette",
    name: "SILHOUETTE",
    season: "Spring/Summer",
    year: "2024",
    description:
      "The outline of form — where body meets fabric meets light.",
    longDescription:
      "SILHOUETTE reduces the human form to its essential outline. Through backlit photography and garments that play with opacity, this collection explores the boundary between visibility and concealment. Oversized forms create dramatic profiles while close-fitting underlayers reveal the body beneath.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80&fit=crop",
      alt: "SILHOUETTE collection hero — dramatic form fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop",
        alt: "SILHOUETTE look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop",
        alt: "SILHOUETTE look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&fit=crop",
        alt: "SILHOUETTE look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80&fit=crop",
        alt: "SILHOUETTE look 4",
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    slug: "tension",
    name: "TENSION",
    season: "Fall/Winter",
    year: "2023",
    description:
      "The pull between opposing forces — restraint and release.",
    longDescription:
      "TENSION explores the dynamic equilibrium between opposing forces: tight and loose, structured and fluid, concealed and revealed. Garments feature contrasting elements — a rigid corset paired with flowing trousers, a severe blazer over a gossamer blouse. The collection asks what happens at the point where opposing forces meet.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80&fit=crop",
      alt: "TENSION collection hero — contrasting fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80&fit=crop",
        alt: "TENSION look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80&fit=crop",
        alt: "TENSION look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80&fit=crop",
        alt: "TENSION look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80&fit=crop",
        alt: "TENSION look 4",
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    slug: "archive",
    name: "ARCHIVE",
    season: "Resort",
    year: "2023",
    description:
      "A retrospective journey — past collections reimagined for now.",
    longDescription:
      "ARCHIVE is both an ending and a beginning. Drawing from a decade of LEMARQUE collections, this retrospective reinterprets signature pieces through a contemporary lens. Iconic silhouettes are updated with new fabrications, classic colorways are inverted, and forgotten prototypes finally see the light. This collection is a love letter to everything that came before.",
    heroImage: {
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80&fit=crop",
      alt: "ARCHIVE collection hero — retrospective fashion",
      width: 1920,
      height: 1280,
    },
    images: [
      {
        src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80&fit=crop",
        alt: "ARCHIVE look 1",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80&fit=crop",
        alt: "ARCHIVE look 2",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1544957992-20514f595d6f?w=800&q=80&fit=crop",
        alt: "ARCHIVE look 3",
        width: 800,
        height: 1200,
      },
      {
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop",
        alt: "ARCHIVE look 4",
        width: 800,
        height: 1200,
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
