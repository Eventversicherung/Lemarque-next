import { BRAND_TAGLINE } from "@/lib/brand";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  loadOgImageSrc,
  renderOgCard,
} from "@/lib/og";

export const alt = `About | LEMARQUE | ${BRAND_TAGLINE}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const imageSrc = await loadOgImageSrc(
    "https://le-marque.com/wp-content/uploads/2025/01/LeMarque_Kuhlhaus_35-scaled.webp"
  );

  return renderOgCard({
    imageSrc,
    eyebrow: BRAND_TAGLINE,
    title: "About",
    subtitle: "LEMARQUE",
  });
}
