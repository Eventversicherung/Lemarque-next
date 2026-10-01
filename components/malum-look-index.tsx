"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getShopLooks, type Collection, type Look } from "@/lib/collections";
import { getProduct } from "@/lib/products";
import { getShopPieceHref } from "@/lib/shop-groups";

function lookTitle(look: Look): string {
  if (look.name) return look.name;
  const product = look.pieceSlugs[0] ? getProduct(look.pieceSlugs[0]) : undefined;
  return product?.name ?? "Look";
}

/**
 * Malum opens as a contact sheet, not a full-viewport still.
 * Eight columns on large screens put the published looks in two rows
 * so the whole collection is readable before any scroll. Fewer columns
 * on smaller screens keep each frame tappable.
 */
export function MalumLookIndex({ collection }: { collection: Collection }) {
  const looks = getShopLooks(collection);

  return (
    <section aria-labelledby="malum-look-index-title" className="pt-24 md:pt-28">
      <div className="px-6 md:px-10 pb-6 md:pb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {collection.season} {collection.year}
            <span className="mx-2 text-white/25" aria-hidden>
              /
            </span>
            {String(looks.length).padStart(2, "0")} Looks
          </p>
          <h1
            id="malum-look-index-title"
            className="font-brand text-[clamp(2.75rem,6vw,5.5rem)] leading-none tracking-[0.28em] text-white"
          >
            {collection.name}
          </h1>
        </div>

        <div className="flex flex-col gap-5 lg:items-end lg:max-w-[34ch] lg:pb-1">
          <p className="text-sm leading-relaxed text-muted-foreground lg:text-right">
            Every look in one sheet. Open a frame to shop the piece.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <ArrowLeft className="w-3 h-3" aria-hidden />
              Collections
            </Link>
            <Link
              href={`/collection/${collection.slug}/shop`}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-foreground hover:text-white/70 transition-colors duration-300"
            >
              Shop the collection
              <ArrowRight className="w-3 h-3" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-3 gap-1 px-1 sm:grid-cols-4 lg:grid-cols-8 lg:gap-1.5 lg:px-1.5">
        {looks.map((look, index) => {
          const title = lookTitle(look);
          const number = String(index + 1).padStart(2, "0");
          const pieceSlug = look.pieceSlugs[0];
          const href = pieceSlug
            ? getShopPieceHref(collection.slug, pieceSlug)
            : `/collection/${collection.slug}/shop`;

          return (
            <li key={`${look.image.src}-${index}`}>
              <Link
                href={href}
                aria-label={`Look ${number}, ${title}`}
                className="group relative block aspect-3/4 overflow-hidden bg-background outline-none focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white"
              >
                <Image
                  src={look.image.src}
                  alt=""
                  fill
                  priority={index < 8}
                  className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 12.5vw"
                />
                <span className="pointer-events-none absolute top-1.5 left-1.5 bg-background/90 px-1.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white">
                  {number}
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-background/80 px-2 py-2 opacity-0 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="line-clamp-2 text-[9px] uppercase leading-snug tracking-[0.14em] text-white">
                    {title}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
