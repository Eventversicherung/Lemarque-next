"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { collections, type Collection } from "@/lib/collections";
import { cn } from "@/lib/utils";

function CollectionCarousel({ collection }: { collection: Collection }) {
  const allImages = [collection.heroImage, ...collection.images];
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    align: "start",
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group/carousel">
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="flex gap-3 md:gap-4">
          {allImages.map((image, index) => (
            <div
              key={index}
              className="relative flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_35%] min-w-0"
            >
              <div className="relative aspect-3/4 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, 35vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
          aria-label="Previous images"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
          aria-label="Next images"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-1 mt-4">
        {allImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="py-2 px-0.5"
            aria-label={`Go to image ${index + 1}`}
          >
            <div
              className={cn(
                "h-[1.5px] rounded-full transition-all duration-400",
                current === index
                  ? "w-6 bg-white"
                  : "w-2 bg-white/20 hover:bg-white/40"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function CollectionSection({
  collection,
  index,
}: {
  collection: Collection;
  index: number;
}) {
  return (
    <section className="py-16 md:py-24">
      <ScrollReveal delay={index * 0.05}>
        <div className="px-6 md:px-10 mb-6 md:mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              {collection.season} {collection.year}
            </p>
            <Link
              href={`/collection/${collection.slug}`}
              className="group inline-flex items-center gap-3"
            >
              <h2 className="font-brand text-2xl md:text-4xl tracking-[0.3em] uppercase group-hover:opacity-70 transition-opacity duration-300">
                {collection.name}
              </h2>
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-lg">
              {collection.description}
            </p>
          </div>
          <Link
            href={`/collection/${collection.slug}`}
            className="hidden md:inline-flex text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            View Collection
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={index * 0.05 + 0.1}>
        <div className="pl-6 md:pl-10">
          <CollectionCarousel collection={collection} />
        </div>
      </ScrollReveal>
    </section>
  );
}

export function CollectionsPageClient() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <section className="pt-28 md:pt-36 pb-8 px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Archive
            </p>
            <h1 className="font-brand text-3xl md:text-5xl tracking-[0.35em]">
              COLLECTIONS
            </h1>
          </motion.div>
        </section>

        {collections.map((collection, index) => (
          <CollectionSection
            key={collection.slug}
            collection={collection}
            index={index}
          />
        ))}
      </motion.div>

      <Footer />
    </main>
  );
}
