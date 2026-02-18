"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { BrandLogo } from "@/components/brand-logo";
import { collections, type Collection } from "@/lib/collections";
import { cn } from "@/lib/utils";

function HorizontalSlides({
  collection,
  isActive,
}: {
  collection: Collection;
  isActive: boolean;
}) {
  const allImages = [collection.heroImage, ...collection.images];
  const [current, setCurrent] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    align: "center",
    skipSnaps: false,
    active: isActive,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!isActive && emblaApi) {
      emblaApi.scrollTo(0, true);
      setCurrent(0);
    }
  }, [isActive, emblaApi]);

  return (
    <div className="h-full w-full">
      <div
        ref={emblaRef}
        className="h-full overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="flex h-full">
          {allImages.map((image, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/30" />

              <AnimatePresence>
                {isActive && current === index && index === 0 && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
                      {collection.season} {collection.year}
                    </p>
                    <h2 className="font-brand text-3xl md:text-5xl lg:text-6xl tracking-[0.35em] text-white mb-3">
                      {collection.name}
                    </h2>
                    <p className="text-xs md:text-sm text-white/60 max-w-md leading-relaxed">
                      {collection.description}
                    </p>
                    <Link
                      href={`/collection/${collection.slug}`}
                      className="inline-block mt-5 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors duration-300"
                    >
                      View full collection
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {index > 0 && (
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {collection.name} / Look{" "}
                    {String(index).padStart(2, "0")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
        {allImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="py-2 px-0.5"
            aria-label={`Image ${index + 1}`}
          >
            <div
              className={cn(
                "h-[2px] rounded-full transition-all duration-400",
                current === index
                  ? "w-6 bg-white"
                  : "w-2 bg-white/25"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function CollectionsPageClient() {
  const [activeCollection, setActiveCollection] = useState(0);
  const isScrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const scrollTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= collections.length) return;
      if (isScrolling.current) return;
      isScrolling.current = true;
      setActiveCollection(index);
      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) scrollTo(activeCollection + 1);
        else scrollTo(activeCollection - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) scrollTo(activeCollection + 1);
        else scrollTo(activeCollection - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollTo(activeCollection + 1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollTo(activeCollection - 1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCollection, scrollTo]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 py-5 mix-blend-difference">
        <BrandLogo size="sm" className="text-white" />
        <Link
          href="/"
          className="text-white/60 hover:text-white transition-colors duration-300 text-xs uppercase tracking-[0.2em]"
        >
          Close
        </Link>
      </div>

      {/* Vertical collection stack */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCollection}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <HorizontalSlides
            collection={collections[activeCollection]}
            isActive={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* Collection indicator (right side) */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
        {collections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="group p-1"
            aria-label={`Go to ${collections[index].name}`}
          >
            <div
              className={cn(
                "w-[2px] rounded-full transition-all duration-500",
                activeCollection === index
                  ? "h-8 bg-white"
                  : "h-3 bg-white/25 group-hover:bg-white/50"
              )}
            />
          </button>
        ))}
      </div>

      {/* Collection counter */}
      <div className="absolute top-1/2 left-6 md:left-10 -translate-y-1/2 z-30">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-rl] rotate-180">
          {String(activeCollection + 1).padStart(2, "0")} /{" "}
          {String(collections.length).padStart(2, "0")}
        </p>
      </div>

      {/* Scroll hint */}
      {activeCollection === 0 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              className="opacity-30"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
