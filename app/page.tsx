"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { collections } from "@/lib/collections";

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/xxv-hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/xxv-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
        style={{ opacity }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="font-brand text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.25em] sm:tracking-[0.4em] md:tracking-[0.5em] text-white text-center"
        >
          LEMARQUE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-6 text-xs md:text-sm uppercase tracking-[0.3em] text-white/60"
        >
          Manufactured 1/1 Attire
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-white/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturedCollections() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Latest
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-wider">
              Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {collections.map((collection, index) => (
          <ScrollReveal key={collection.slug} delay={index * 0.1}>
            <Link
              href={`/collection/${collection.slug}`}
              className="group block relative aspect-3/4 overflow-hidden"
            >
              <Image
                src={collection.heroImage.src}
                alt={collection.heroImage.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-transparent" />
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

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedCollections />
      <Footer />
    </main>
  );
}
