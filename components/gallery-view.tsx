"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { collections } from "@/lib/collections";
import { cn } from "@/lib/utils";

export function GalleryView() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    align: "center",
    skipSnaps: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", () => setIsDragging(true));
    emblaApi.on("pointerUp", () => {
      setTimeout(() => setIsDragging(false), 100);
    });
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi, router]);

  const handleSlideClick = (slug: string) => {
    if (!isDragging) {
      router.push(`/collection/${slug}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black touch-none overscroll-none">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {collections.map((collection, index) => (
            <div
              key={collection.slug}
              className="relative flex-[0_0_100%] min-w-0 h-full cursor-pointer"
              onClick={() => handleSlideClick(collection.slug)}
            >
              <Image
                src={collection.heroImage.src}
                alt={collection.heroImage.alt}
                fill
                priority={index <= 1}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <motion.div
                className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: current === index ? 1 : 0,
                  y: current === index ? 0 : 20,
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
                  {collection.season} {collection.year}
                </p>
                <h2 className="font-brand text-3xl md:text-5xl tracking-[0.35em] text-white mb-3">
                  {collection.name}
                </h2>
                <p className="text-xs md:text-sm text-white/60 max-w-md leading-relaxed">
                  {collection.description}
                </p>
                <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Tap to explore
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
        {collections.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="py-3 px-0.5"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={cn(
                "h-[2px] rounded-full transition-all duration-500",
                current === index
                  ? "w-8 bg-white"
                  : "w-3 bg-white/30 hover:bg-white/50"
              )}
            />
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 z-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-rl]">
          {String(current + 1).padStart(2, "0")} / {String(collections.length).padStart(2, "0")}
        </p>
      </div>

      {/* Swipe hint on edges */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-0 top-0 bottom-0 w-16 md:w-24 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-4"
        aria-label="Previous"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1"
          className="opacity-50"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-0 top-0 bottom-0 w-16 md:w-24 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-4"
        aria-label="Next"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1"
          className="opacity-50"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
