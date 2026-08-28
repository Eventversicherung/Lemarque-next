import { getCollection } from "@/lib/collections";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  fallbackOgCard,
  loadOgImageSrc,
  renderOgCard,
} from "@/lib/og";
import { getProduct } from "@/lib/products";

export const alt = "LEMARQUE piece";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return fallbackOgCard();
  }

  const collection = getCollection(product.collectionSlug);
  const imageSrc = await loadOgImageSrc(product.images[0].src);

  return renderOgCard({
    imageSrc,
    eyebrow: collection
      ? `${collection.name} · ${product.category}`
      : product.category,
    title: product.name,
    subtitle: product.price,
  });
}
