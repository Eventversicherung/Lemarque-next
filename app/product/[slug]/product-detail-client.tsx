"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CONTACT_HREF } from "@/lib/brand";
import type { Collection } from "@/lib/collections";
import {
  type Product,
  type ProductImage,
  getLookSiblings,
  getRelatedProducts,
} from "@/lib/products";
import { getShopPieceHref } from "@/lib/shop-groups";

const ease = [0.25, 0.1, 0.25, 1] as const;

function FullFrameImage({
  image,
  priority = false,
  sizes,
}: {
  image: ProductImage;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      priority={priority}
      className="h-auto w-full"
      sizes={sizes}
    />
  );
}

function ProductIdentity({
  product,
  collection,
}: {
  product: Product;
  collection: Collection | undefined;
}) {
  const backHref = collection
    ? getShopPieceHref(collection.slug, product.slug)
    : "/collections";
  const backLabel = collection ? collection.name : "Collections";

  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <Link
        href={backHref}
        scroll={false}
        className="inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden />
        {backLabel}
      </Link>

      <div className="flex flex-col gap-5">
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          {product.category}
        </p>
        <h1 className="font-brand text-[1.65rem] uppercase leading-[1.15] tracking-[0.1em] text-foreground sm:text-[1.9rem] lg:text-[2.05rem] lg:tracking-[0.12em]">
          {product.name}
        </h1>
        {collection && (
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            {collection.name}
            {collection.year ? ` · ${collection.year}` : ""}
          </p>
        )}
      </div>

      <p className="max-w-[42ch] text-sm leading-[1.75] text-muted-foreground">
        {product.description}
      </p>

      <div className="flex flex-col items-start gap-6">
        <p className="text-[11px] uppercase tracking-[0.26em] text-foreground">
          {product.price}
        </p>
        <a
          href={CONTACT_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Inquire about ${product.name}`}
          className="inline-flex items-center gap-3 border border-foreground/25 px-7 py-3.5 text-[10px] uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          Inquire
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </a>
      </div>
    </div>
  );
}

function PieceRail({
  label,
  pieces,
}: {
  label: string;
  pieces: Product[];
}) {
  if (pieces.length === 0) return null;

  return (
    <section className="border-t border-white/8 px-6 py-16 md:px-10 md:py-24 lg:px-16">
      <ScrollReveal>
        <p className="mb-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </p>
      </ScrollReveal>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {pieces.map((piece, index) => (
          <li key={piece.slug}>
            <ScrollReveal delay={index * 0.08}>
              <Link
                href={`/product/${piece.slug}`}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                <div className="relative aspect-3/4 overflow-hidden">
                  <Image
                    src={piece.images[0].src}
                    alt={piece.images[0].alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {piece.category}
                </p>
                <h3 className="mt-1 text-xs uppercase tracking-[0.16em] text-foreground">
                  {piece.name}
                </h3>
              </Link>
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProductDetailClient({
  product,
  collection,
}: {
  product: Product;
  collection: Collection | undefined;
}) {
  const [cover, ...rest] = product.images;
  const gallerySizes = "(max-width: 1023px) 100vw, 58vw";

  return (
    <main className="min-h-screen">
      <Navigation />

      <article>
        <div className="grid grid-cols-1 [grid-template-areas:'cover'_'info'_'gallery'] lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:[grid-template-areas:'cover_info'_'gallery_info']">
          <motion.figure
            className="[grid-area:cover] m-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            <FullFrameImage image={cover} priority sizes={gallerySizes} />
          </motion.figure>

          <motion.aside
            className="[grid-area:info] no-scrollbar px-6 py-12 md:px-10 md:py-16 lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-l lg:border-white/8 lg:px-12 lg:py-28 xl:px-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
          >
            <ProductIdentity product={product} collection={collection} />
          </motion.aside>

          {rest.length > 0 && (
            <div className="[grid-area:gallery] flex flex-col gap-1">
              {rest.map((image) => (
                <figure key={image.src} className="m-0">
                  <FullFrameImage image={image} sizes={gallerySizes} />
                </figure>
              ))}
            </div>
          )}
        </div>

        <PieceRail label="Shop This Look" pieces={getLookSiblings(product)} />
        <PieceRail label="More Pieces" pieces={getRelatedProducts(product, 4)} />
      </article>

      <Footer />
    </main>
  );
}
