import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection, hasShoppableLooks } from "@/lib/collections";
import { CollectionDetailClient } from "./collection-detail-client";
import { ShoppableCollectionClient } from "./shoppable-collection-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  const shareImage = collection.ogImage ?? collection.heroImage;

  return {
    title: `${collection.name} | ${collection.season} ${collection.year}`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} | LEMARQUE`,
      description: collection.description,
      images: [
        {
          url: shareImage.src,
          width: shareImage.width,
          height: shareImage.height,
          alt: shareImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.name} | LEMARQUE`,
      description: collection.description,
      images: [shareImage.src],
    },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  if (hasShoppableLooks(collection)) {
    return <ShoppableCollectionClient collection={collection} />;
  }

  return <CollectionDetailClient collection={collection} />;
}
