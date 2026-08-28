import { collections } from "@/lib/collections";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  loadOgImageSrc,
  renderOgCard,
} from "@/lib/og";

export const alt = "Collections | LEMARQUE";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const cover = collections[0]?.browseImage ?? collections[0]?.heroImage;
  const imageSrc = cover ? await loadOgImageSrc(cover.src) : null;

  return renderOgCard({
    imageSrc,
    eyebrow: "LEMARQUE",
    title: "Collections",
    subtitle: "Every chapter, every look",
  });
}
