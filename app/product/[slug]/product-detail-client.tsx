"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProductGallery } from "@/components/product-gallery";
import { hasShoppableLooks, type Collection } from "@/lib/collections";
import {
  type Product,
  getLookSiblings,
  getRelatedProducts,
} from "@/lib/products";

function ProductInfo({
  product,
  collection,
}: {
  product: Product;
  collection: Collection | undefined;
}) {
  return (
    <section className="px-6 md:px-16 py-16 md:py-24 max-w-4xl">
      <ScrollReveal>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl mb-6">
          {product.description}
        </p>
        <p className="text-sm uppercase tracking-[0.25em] text-foreground mb-1">
          {product.price}
        </p>
        {collection && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            From the {collection.name} collection
          </p>
        )}
      </ScrollReveal>
    </section>
  );
}

function ShopTheLook({ product }: { product: Product }) {
  const siblings = getLookSiblings(product);
  if (siblings.length === 0) return null;

  return (
    <section className="px-6 md:px-16 py-16 md:py-24 border-t border-white/5">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Shop This Look
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {siblings.map((piece, index) => (
          <ScrollReveal key={piece.slug} delay={index * 0.1}>
            <Link
              href={`/product/${piece.slug}`}
              className="group block relative aspect-2/3 overflow-hidden"
            >
              <Image
                src={piece.images[0].src}
                alt={piece.images[0].alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">
                  {piece.category}
                </p>
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-light">
                  {piece.name}
                </h3>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 3);
  if (related.length === 0) return null;

  return (
    <section className="px-6 md:px-16 py-16 md:py-24 border-t border-white/5">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          More Pieces
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {related.map((piece, index) => (
          <ScrollReveal key={piece.slug} delay={index * 0.1}>
            <Link
              href={`/product/${piece.slug}`}
              className="group block relative aspect-4/5 overflow-hidden"
            >
              <Image
                src={piece.images[0].src}
                alt={piece.images[0].alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">
                  {piece.category}
                </p>
                <h3 className="text-sm uppercase tracking-[0.25em] text-white font-light">
                  {piece.name}
                </h3>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
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
  return (
    <main className="min-h-screen">
      <Navigation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ProductGallery
          images={product.images}
          productName={product.name}
          category={product.category}
        />

        <div className="pt-4 px-6 md:px-16">
          <Link
            href={
              collection && hasShoppableLooks(collection)
                ? `/collection/${collection.slug}#shop`
                : collection
                  ? `/collection/${collection.slug}`
                  : "/collections"
            }
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-3 h-3" />
            {collection ? `Back to ${collection.name}` : "Back to Collections"}
          </Link>
        </div>

        <ProductInfo product={product} collection={collection} />
        <ShopTheLook product={product} />
        <RelatedProducts product={product} />
      </motion.div>

      <Footer />
    </main>
  );
}
