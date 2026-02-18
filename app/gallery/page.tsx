import type { Metadata } from "next";
import { GalleryPageClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore LEMARQUE collections in an immersive fullscreen gallery experience.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
