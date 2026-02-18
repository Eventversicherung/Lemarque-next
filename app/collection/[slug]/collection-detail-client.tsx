"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { type Collection, getRelatedCollections } from "@/lib/collections";

function HeroParallax({ collection }: { collection: Collection }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={collection.heroImage.src}
          alt={collection.heroImage.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 p-8 md:p-16"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50 mb-3">
            {collection.season} {collection.year}
          </p>
          <h1 className="font-brand text-4xl md:text-6xl lg:text-7xl tracking-[0.35em] text-white">
            {collection.name}
          </h1>
        </motion.div>
      </motion.div>
    </section>
  );
}

function CollectionInfo({ collection }: { collection: Collection }) {
  return (
    <section className="px-6 md:px-16 py-16 md:py-24 max-w-4xl">
      <ScrollReveal>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-2xl">
          {collection.longDescription}
        </p>
      </ScrollReveal>
    </section>
  );
}

function ImageGrid({ collection }: { collection: Collection }) {
  return (
    <section className="px-6 md:px-16 pb-16 md:pb-24">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Looks
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {collection.images.map((image, index) => (
          <ScrollReveal key={index} delay={index * 0.1}>
            <motion.div
              className="relative aspect-[2/3] overflow-hidden group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                  Look {String(index + 1).padStart(2, "0")}
                </p>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function RelatedCollections({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedCollections(currentSlug, 3);

  return (
    <section className="px-6 md:px-16 py-16 md:py-24 border-t border-white/5">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          More Collections
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {related.map((collection, index) => (
          <ScrollReveal key={collection.slug} delay={index * 0.1}>
            <Link
              href={`/collection/${collection.slug}`}
              className="group block relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src={collection.heroImage.src}
                alt={collection.heroImage.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">
                  {collection.season} {collection.year}
                </p>
                <h3 className="text-sm uppercase tracking-[0.25em] text-white font-light">
                  {collection.name}
                </h3>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function CollectionDetailClient({
  collection,
}: {
  collection: Collection;
}) {
  return (
    <main className="min-h-screen">
      <Navigation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroParallax collection={collection} />

        <div className="pt-4 px-6 md:px-16">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Gallery
          </Link>
        </div>

        <CollectionInfo collection={collection} />
        <ImageGrid collection={collection} />
        <RelatedCollections currentSlug={collection.slug} />
      </motion.div>

      <Footer />
    </main>
  );
}
