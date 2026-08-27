"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ShopFeed } from "@/components/shop-feed";
import { RelatedCollections } from "./collection-detail-client";
import type { Collection } from "@/lib/collections";

// Distinct hub template for collections with a live shop feed (currently
// MALUM): a full-bleed intro that scrolls straight into the shop instead of
// linking out to a separate "/shop" page. See components/shop-feed.tsx for
// the embedded feed itself and lib/collections.ts (`Look.published`) for
// how looks get added here one at a time.

function Intro({ collection }: { collection: Collection }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToShop = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section ref={ref} className="relative h-dvh w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={collection.heroImage.src}
          alt={collection.heroImage.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ opacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60 mb-4"
        >
          {collection.season} {collection.year}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          className="font-brand text-4xl sm:text-6xl md:text-8xl tracking-[0.25em] sm:tracking-[0.35em] text-white"
        >
          {collection.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 max-w-md text-sm md:text-base text-white/70 leading-relaxed"
        >
          {collection.description}
        </motion.p>

        <motion.a
          href="#shop"
          onClick={scrollToShop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="group absolute bottom-10 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors duration-300"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Shop the Collection
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}

function AboutSection({ collection }: { collection: Collection }) {
  return (
    <section className="px-6 md:px-16 py-16 md:py-24 max-w-3xl">
      <ScrollReveal>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
          About the Collection
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
          {collection.longDescription}
        </p>
      </ScrollReveal>
    </section>
  );
}

export function ShoppableCollectionClient({
  collection,
}: {
  collection: Collection;
}) {
  return (
    <main className="min-h-screen">
      <Navigation />

      <Intro collection={collection} />

      {/* Scrolling here from the intro drops you straight into the shop
          feed - no separate page, no "Close" button, just the site's own
          persistent nav staying pinned above it. */}
      <div id="shop" className="scroll-mt-0">
        <ShopFeed collection={collection} />
      </div>

      <AboutSection collection={collection} />
      <RelatedCollections currentSlug={collection.slug} />
      <Footer />
    </main>
  );
}
