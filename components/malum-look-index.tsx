"use client";

import Image from "next/image";
import Link from "next/link";
import {
  getShopLooks,
  type Collection,
  type CollectionImage,
  type Look,
} from "@/lib/collections";
import { getProduct } from "@/lib/products";
import { getShopPieceHref } from "@/lib/shop-groups";

function lookProduct(look: Look) {
  return look.pieceSlugs[0] ? getProduct(look.pieceSlugs[0]) : undefined;
}

function isHandbagLook(look: Look): boolean {
  return look.pieceSlugs.every((slug) => getProduct(slug)?.category === "Handbag");
}

/**
 * The sheet only shows a model on a white studio ground.
 * Night editorials are skipped. The siren gown's first studio frame is the
 * dress on a form; the worn frame is image 12.
 */
function sheetImage(look: Look): CollectionImage {
  const product = lookProduct(look);
  if (look.pieceSlugs[0] === "malum-siren-gown") {
    const worn = product?.images.find((image) => image.src.endsWith("/12.webp"));
    if (worn) return worn;
  }
  const studio = product?.images.find((image) => !image.src.includes("/editorial/"));
  return studio ?? look.image;
}

function lookTitle(look: Look): string {
  if (look.name) return look.name;
  return lookProduct(look)?.name ?? "Look";
}

/**
 * Malum opens as a contact sheet that fills the first screen.
 * Handbags stay in the shop. No title sits above the frames.
 */
export function MalumLookIndex({ collection }: { collection: Collection }) {
  const looks = getShopLooks(collection).filter((look) => !isHandbagLook(look));

  return (
    <section className="flex h-dvh flex-col pt-28 md:pt-32">
      <h1 className="sr-only">{collection.name}</h1>
      <ul className="grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-px bg-background md:grid-cols-6 md:grid-rows-2">
        {looks.map((look, index) => {
          const image = sheetImage(look);
          const title = lookTitle(look);
          const number = String(index + 1).padStart(2, "0");
          const pieceSlug = look.pieceSlugs[0];
          const href = pieceSlug
            ? getShopPieceHref(collection.slug, pieceSlug)
            : `/collection/${collection.slug}/shop`;

          return (
            <li key={`${image.src}-${index}`} className="min-h-0 min-w-0">
              <Link
                href={href}
                aria-label={`Look ${number}, ${title}`}
                className="group relative block h-full bg-[oklch(0.99_0_0)] outline-none focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-foreground"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index < 6}
                  className="object-contain motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out group-hover:scale-[1.02] group-active:scale-[0.99]"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
