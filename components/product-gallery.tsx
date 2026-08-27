"use client";

// The primary visual on a product detail page: every photo of the piece in
// one browsable strip instead of a cropped hero + a grid underneath. Each
// slide is sized by *its own* aspect ratio (max-height/max-width, not the
// viewport width), so portrait photography is never cropped - the whole
// garment stays in frame instead of e.g. only showing the feet. Only the
// focused photo is sharp; its left/right neighbors peek in blurred so
// people can see there's more to look at without it fighting for
// attention. Clicking a peeking neighbor focuses it (it does not
// navigate - there's nowhere further to go, this already *is* the detail
// page); swiping and the arrow keys move through the set the same way.
//
// Visual language (peek sizing, blur/opacity/scale) intentionally mirrors
// components/full-screen-swiper.tsx's per-look carousel, but this stays a
// separate component on purpose: that one drives a vertical feed of
// *different* pieces, this one browses a single piece's own photo set, and
// keeping them decoupled means a change to either can never regress the
// other.

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/products";

export interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  category: string;
}

export function ProductGallery({
  images,
  productName,
  category,
}: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    skipSnaps: false,
    containScroll: "trimSnaps",
  });
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("init", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("init", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi]);

  if (images.length === 0) return null;

  return (
    <section className="relative h-[80dvh] md:h-[90dvh] w-full overflow-hidden bg-black">
      <div
        ref={emblaRef}
        className="h-full overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="flex h-full">
          {images.map((image, index) => {
            const isFocused = current === index;
            return (
              <div
                key={image.src}
                className="relative h-full flex-[0_0_auto] flex items-center justify-center px-1.5 md:px-2.5 first:pl-6 sm:first:pl-10 last:pr-6 sm:last:pr-10"
              >
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`View ${productName} \u2014 image ${index + 1} of ${images.length}`}
                  aria-current={isFocused}
                  className={cn(
                    "relative inline-block transition-all duration-300 ease-out will-change-transform",
                    isFocused
                      ? "opacity-100 scale-100 blur-none"
                      : "opacity-40 scale-[0.92] blur-[3px]"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    priority={index === 0}
                    className="h-auto w-auto max-h-[66dvh] sm:max-h-[72dvh] md:max-h-[80dvh] max-w-[82vw] sm:max-w-[68vw] md:max-w-[50vw] lg:max-w-[38vw]"
                    sizes="(max-width: 640px) 82vw, (max-width: 768px) 68vw, (max-width: 1024px) 50vw, 38vw"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10 pointer-events-none">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
          {category}
        </p>
        <h1 className="font-brand text-2xl md:text-4xl tracking-[0.2em] text-white">
          {productName}
        </h1>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous image"
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 text-white/40 hover:text-white transition-colors duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next image"
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 text-white/40 hover:text-white transition-colors duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 flex items-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className="py-2 px-0.5"
                aria-label={`Go to image ${index + 1}`}
              >
                <div
                  className={cn(
                    "h-[2px] rounded-full transition-all duration-400",
                    current === index ? "w-6 bg-white" : "w-2 bg-white/25"
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
