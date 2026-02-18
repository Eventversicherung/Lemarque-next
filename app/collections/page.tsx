import type { Metadata } from "next";
import { CollectionsPageClient } from "./collections-client";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore all LEMARQUE collections. Handcrafted leather goods, avant-garde outerwear, and unique accessories.",
};

export default function CollectionsPage() {
  return <CollectionsPageClient />;
}
