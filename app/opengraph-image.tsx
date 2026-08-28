import { BRAND_OG_TITLE, BRAND_TAGLINE } from "@/lib/brand";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  loadOgImageSrc,
  renderOgCard,
} from "@/lib/og";

export const alt = BRAND_OG_TITLE;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const imageSrc = await loadOgImageSrc("/og-image.webp");

  return renderOgCard({
    imageSrc,
    eyebrow: BRAND_TAGLINE,
    title: "LEMARQUE",
    subtitle: BRAND_TAGLINE,
  });
}
