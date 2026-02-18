"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

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
          src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80&fit=crop"
          alt="LEMARQUE atelier"
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
            Est. 2015
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
            We believe fashion exists at the intersection of art and architecture.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
            LEMARQUE was founded on the principle that clothing is more than
            function — it is a form of expression, a statement of identity, and
            a work of art. Each collection is conceived as a complete universe,
            with its own language, its own logic, and its own emotional
            landscape.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Drawing inspiration from brutalist architecture, contemporary art,
            and the raw beauty of natural materials, our designs challenge
            conventional notions of beauty while remaining deeply committed to
            craftsmanship and quality.
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
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80&fit=crop"
          alt="LEMARQUE design process"
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
              Every stitch carries intention. Every cut tells a story.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Our atelier in Paris brings together master craftspeople who share
              our uncompromising vision. From sourcing the finest fabrics to the
              final fitting, every stage of production is guided by a relentless
              pursuit of perfection. We work with natural materials — raw silk,
              virgin wool, organic cotton — chosen for their beauty, their
              texture, and their longevity.
            </p>
          </ScrollReveal>
        </div>

        <div className="space-y-12">
          <ScrollReveal delay={0.2}>
            <div>
              <p className="font-brand text-4xl md:text-5xl tracking-wider mb-2">
                10+
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Years of Design
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div>
              <p className="font-brand text-4xl md:text-5xl tracking-wider mb-2">
                16
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Collections Released
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div>
              <p className="font-brand text-4xl md:text-5xl tracking-wider mb-2">
                3
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Global Ateliers
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
            &ldquo;The future of fashion lies not in following trends, but in
            creating timeless pieces that transcend seasons and speak to the
            human condition.&rdquo;
          </blockquote>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            &mdash; Creative Director, LEMARQUE
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
