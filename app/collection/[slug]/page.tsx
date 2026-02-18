import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/lib/collections";
import { CollectionDetailClient } from "./collection-detail-client";

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

  return {
    title: `${collection.name} | ${collection.season} ${collection.year}`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} | LEMARQUE`,
      description: collection.description,
      images: [
        {
          url: collection.heroImage.src,
          width: 1200,
          height: 630,
          alt: collection.heroImage.alt,
        },
      ],
    },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    notFound();
  }

  return <CollectionDetailClient collection={collection} />;
}
