import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection, hasShoppableLooks } from "@/lib/collections";
import { LookShopClient } from "./look-shop-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return collections
    .filter((collection) => hasShoppableLooks(collection))
    .map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: `Shop ${collection.name} | LEMARQUE`,
    description: `Browse every look and piece from the ${collection.name} collection.`,
  };
}

export default async function CollectionShopPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection || !hasShoppableLooks(collection)) {
    notFound();
  }

  return <LookShopClient collection={collection} />;
}
