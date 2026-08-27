import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// The "Shop the Collection" experience now lives directly on the collection
// hub page (scroll down from the intro into the shop feed) instead of a
// separate takeover route - see app/collection/[slug]/shoppable-collection-client.tsx.
// This redirect keeps any existing links to /shop working.
export default async function CollectionShopRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/collection/${slug}#shop`);
}
