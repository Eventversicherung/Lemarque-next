import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection } from "@/lib/collections";
import { getProduct, products } from "@/lib/products";
import { ProductDetailClient } from "./product-detail-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Piece Not Found" };
  }

  return {
    title: `${product.name} | LEMARQUE`,
    description: product.description,
    openGraph: {
      title: `${product.name} | LEMARQUE`,
      description: product.description,
      images: [
        {
          url: product.images[0].src,
          width: product.images[0].width,
          height: product.images[0].height,
          alt: product.images[0].alt,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const collection = getCollection(product.collectionSlug);

  return <ProductDetailClient product={product} collection={collection} />;
}
