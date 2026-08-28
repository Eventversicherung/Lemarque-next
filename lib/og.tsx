import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { BRAND_OG_TITLE, BRAND_TAGLINE } from "@/lib/brand";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export type OgCardProps = {
  imageSrc?: string | null;
  eyebrow: string;
  title: string;
  subtitle?: string;
};

/**
 * Load a local `/public` file or a remote URL, then convert it to a
 * 1200×630 JPEG. `next/og` / Satori cannot reliably decode WebP, which is
 * what the product photography uses.
 * Official ImageResponse local-asset pattern:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */
export async function loadOgImageSrc(src: string): Promise<string | null> {
  try {
    let buffer: Buffer;

    if (src.startsWith("http://") || src.startsWith("https://")) {
      const response = await fetch(src, { next: { revalidate: 86400 } });
      if (!response.ok) return null;
      buffer = Buffer.from(await response.arrayBuffer());
    } else {
      const filePath = join(process.cwd(), "public", src.replace(/^\//, ""));
      buffer = await readFile(filePath);
    }

    const jpeg = await sharp(buffer)
      .rotate()
      .resize(OG_SIZE.width, OG_SIZE.height, {
        fit: "cover",
        position: "top",
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

export function renderOgCard({ imageSrc, eyebrow, title, subtitle }: OgCardProps) {
  const titleSize = title.length > 32 ? 46 : title.length > 18 ? 56 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#050505",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: OG_SIZE.width,
              height: OG_SIZE.height,
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_SIZE.width,
            height: OG_SIZE.height,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.12) 42%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_SIZE.width,
            height: OG_SIZE.height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            LEMARQUE
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.62)",
                marginBottom: 14,
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                lineHeight: 1.08,
                letterSpacing: title.length > 24 ? "0.02em" : "0.08em",
                maxWidth: 980,
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  display: "flex",
                  marginTop: 16,
                  fontSize: 22,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}

export function fallbackOgCard() {
  return renderOgCard({
    eyebrow: BRAND_TAGLINE,
    title: BRAND_OG_TITLE,
  });
}
