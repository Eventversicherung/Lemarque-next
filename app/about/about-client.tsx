"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

const IMG_BASE = "https://le-marque.com/wp-content/uploads";

function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={`${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_35-scaled.webp`}
          alt="LEMARQUE at Kuhlhaus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <div className="relative z-10 flex items-end h-full p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-3">
            Manufactured 1/1 Attire
          </p>
          <h1 className="font-brand text-4xl md:text-6xl tracking-[0.35em] text-white">
            ABOUT
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-3xl">
        <ScrollReveal>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Philosophy
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-2xl md:text-4xl font-light leading-relaxed tracking-wide mb-8">
            Every piece is a unique creation. Manufactured 1/1, never
            reproduced.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
            LEMARQUE was founded on the conviction that true luxury lies in
            singularity. Each garment and accessory is handmade as a one-of-one
            piece, crafted from the finest genuine leather, stainless steel, and
            cotton. There are no production runs, no mass manufacturing.
            Only individual creations that carry the mark of their maker.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            From bomber jackets to leather goods, harnesses to bags.
            Every item may require fittings and the process of production
            usually takes up to six weeks. This is fashion at its most
            intentional: unhurried, uncompromising, and entirely unique.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FullBleedImage() {
  return (
    <ScrollReveal>
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <Image
          src={`${IMG_BASE}/2025/01/LeMarque_Kuhlhaus_65-scaled.webp`}
          alt="LEMARQUE Kuhlhaus editorial"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </section>
    </ScrollReveal>
  );
}

function Craftsmanship() {
  return (
    <section className="px-6 md:px-16 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <ScrollReveal>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Craftsmanship
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-2xl md:text-3xl font-light leading-relaxed tracking-wide mb-8">
              Genuine leather. Stainless steel. Cotton. Nothing less.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Our bags feature reinforced leather edges and bottoms with
              stainless steel screws. The bombers combine technical construction
              with handcrafted leather details. Every material is chosen for its
              durability, its tactile quality, and its ability to age with
              character. Select items may require individual fittings,
              because what fits one body should not be forced to fit another.
            </p>
          </ScrollReveal>
        </div>

        <div className="space-y-12">
          <ScrollReveal delay={0.2}>
            <div>
              <p className="font-brand text-4xl md:text-5xl tracking-wider mb-2">
                1/1
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Every Piece Unique
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div>
              <p className="font-brand text-4xl md:text-5xl tracking-wider mb-2">
                6
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Weeks Production Time
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div>
              <p className="font-brand text-4xl md:text-5xl tracking-wider mb-2">
                XXV
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Collections &amp; Counting
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section className="px-6 md:px-16 py-24 md:py-32 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <blockquote className="text-xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-wide">
            &ldquo;We don&apos;t follow trends. We manufacture conviction,
            one piece at a time.&rdquo;
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            LEMARQUE
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function AboutPageClient() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AboutHero />
        <Philosophy />
        <FullBleedImage />
        <Craftsmanship />
        <Vision />
      </motion.div>
      <Footer />
    </main>
  );
}
