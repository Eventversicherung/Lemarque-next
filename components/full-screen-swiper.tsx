"use client";

// Generic fullscreen "vertical scroll = groups, horizontal swipe = slides
// within a group" experience.
//
// Used by:
//  - app/collections/collections-client.tsx (groups = collections, slides =
//    look photos, tapping the cover slide opens the collection detail page)
//  - app/collection/[slug]/shop/look-shop-client.tsx (groups = looks within
//    one collection, slides = the pieces of that look, tapping a piece opens
//    its product detail page)
//
// Keeping this logic in one place means both experiences stay visually and
// behaviorally consistent, and any future "swipe through things" view (e.g.
// a lookbook, a campaign) can reuse it instead of re-implementing wheel /
// touch / keyboard handling and embla wiring from scratch.

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { preloadImage } from "@/lib/image-preload";
import { cn } from "@/lib/utils";

export interface SwiperMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface SwiperSlideItem {
  media: SwiperMedia;
  /** Bottom-left caption shown on this slide (non-cover slides only). */
  label?: string;
  /** When set, the slide becomes a link (e.g. to a product detail page). */
  href?: string;
}

export interface SwiperGroup {
  key: string;
  /** Cover image, always the first horizontal slide of the group. */
  media: SwiperMedia;
  eyebrow: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  /** Remaining horizontal slides after the cover. */
  items: SwiperSlideItem[];
}

function useGroupPreloader(groups: SwiperGroup[], activeIndex: number) {
  const preloadedGroups = useRef(new Set<number>());

  const preloadGroup = useCallback((group: SwiperGroup) => {
    preloadImage(group.media.src);
    group.items.forEach((item) => preloadImage(item.media.src));
  }, []);

  useEffect(() => {
    const group = groups[activeIndex];
    if (!group) return;
    preloadGroup(group);
    preloadedGroups.current.add(activeIndex);

    const neighbors = [activeIndex - 1, activeIndex + 1];
    neighbors.forEach((i) => {
      if (i >= 0 && i < groups.length) {
        preloadImage(groups[i].media.src);
      }
    });

    const timer = setTimeout(() => {
      neighbors.forEach((i) => {
        if (i >= 0 && i < groups.length && !preloadedGroups.current.has(i)) {
          preloadGroup(groups[i]);
          preloadedGroups.current.add(i);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [activeIndex, groups, preloadGroup]);

  useEffect(() => {
    let delay = 800;
    const timers: ReturnType<typeof setTimeout>[] = [];
    groups.forEach((group, i) => {
      if (preloadedGroups.current.has(i)) return;
      timers.push(
        setTimeout(() => {
          preloadGroup(group);
          preloadedGroups.current.add(i);
        }, delay)
      );
      delay += 400;
    });
    return () => timers.forEach(clearTimeout);
    // Intentionally run once on mount to warm the remaining groups.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function GroupSlides({
  group,
  isActive,
  onEmblaApi,
}: {
  group: SwiperGroup;
  isActive: boolean;
  onEmblaApi?: (api: ReturnType<typeof useEmblaCarousel>[1]) => void;
}) {
  const allSlides: SwiperSlideItem[] = [{ media: group.media }, ...group.items];
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
    // Sync `current` once embla finishes its own setup ("init"), then keep
    // it in sync on every subsequent "select" - both are embla-driven
    // events, so state is always updated from an event callback rather than
    // synchronously in the effect body.
    emblaApi.on("init", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("init", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && onEmblaApi) {
      onEmblaApi(emblaApi);
    }
  }, [emblaApi, onEmblaApi]);

  return (
    <div className="h-full w-full">
      <div
        ref={emblaRef}
        className="h-full overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="flex h-full">
          {allSlides.map((slide, index) => {
            const isCover = index === 0;
            const slideClassName = "relative flex-[0_0_100%] min-w-0 h-full";

            const content = (
              <>
                <Image
                  src={slide.media.src}
                  alt={slide.media.alt}
                  fill
                  priority={index <= 1}
                  loading="eager"
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/30" />

                <AnimatePresence>
                  {isActive && current === index && isCover && (
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
                        {group.eyebrow}
                      </p>
                      <h2 className="font-brand text-3xl md:text-5xl lg:text-6xl tracking-[0.35em] text-white mb-3">
                        {group.title}
                      </h2>
                      {group.description && (
                        <p className="text-xs md:text-sm text-white/60 max-w-md leading-relaxed">
                          {group.description}
                        </p>
                      )}
                      {group.linkHref && (
                        <Link
                          href={group.linkHref}
                          className="inline-block mt-5 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors duration-300"
                        >
                          {group.linkLabel ?? "View"}
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isCover && slide.label && (
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {slide.label}
                    </p>
                  </div>
                )}
              </>
            );

            if (!isCover && slide.href) {
              return (
                <Link key={index} href={slide.href} className={slideClassName}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={index} className={slideClassName}>
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* Horizontal progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
        {allSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="py-2 px-0.5"
            aria-label={`Image ${index + 1}`}
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
    </div>
  );
}

export interface FullScreenSwiperProps {
  groups: SwiperGroup[];
  /** Fixed header overlay (logo, close link, etc.). */
  header?: ReactNode;
  /** Rendered instead of the swiper when `groups` is empty. */
  emptyState?: ReactNode;
}

export function FullScreenSwiper({
  groups,
  header,
  emptyState,
}: FullScreenSwiperProps) {
  const [activeGroup, setActiveGroup] = useState(0);
  const isScrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const horizontalApiRef = useRef<ReturnType<typeof useEmblaCarousel>[1]>(null);

  useGroupPreloader(groups, activeGroup);

  const handleEmblaApi = useCallback(
    (api: ReturnType<typeof useEmblaCarousel>[1]) => {
      horizontalApiRef.current = api;
    },
    []
  );

  const scrollTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= groups.length) return;
      if (isScrolling.current) return;
      isScrolling.current = true;
      setActiveGroup(index);
      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    },
    [groups.length]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) scrollTo(activeGroup + 1);
        else scrollTo(activeGroup - 1);
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
        if (deltaY > 0) scrollTo(activeGroup + 1);
        else scrollTo(activeGroup - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollTo(activeGroup + 1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollTo(activeGroup - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        horizontalApiRef.current?.scrollNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        horizontalApiRef.current?.scrollPrev();
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
  }, [activeGroup, scrollTo]);

  if (groups.length === 0) {
    return <>{emptyState}</>;
  }

  const active = groups[activeGroup];

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black overflow-hidden">
      {header}

      {/* Vertical group stack */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.key}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <GroupSlides group={active} isActive={true} onEmblaApi={handleEmblaApi} />
        </motion.div>
      </AnimatePresence>

      {/* Group indicator (right side) */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3">
        {groups.map((group, index) => (
          <button
            key={group.key}
            onClick={() => scrollTo(index)}
            className="group p-1"
            aria-label={`Go to ${group.title}`}
          >
            <div
              className={cn(
                "w-[2px] rounded-full transition-all duration-500",
                activeGroup === index
                  ? "h-8 bg-white"
                  : "h-3 bg-white/25 group-hover:bg-white/50"
              )}
            />
          </button>
        ))}
      </div>

      {/* Group counter */}
      <div className="absolute top-1/2 left-6 md:left-10 -translate-y-1/2 z-30">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-rl] rotate-180">
          {String(activeGroup + 1).padStart(2, "0")} /{" "}
          {String(groups.length).padStart(2, "0")}
        </p>
      </div>

      {/* Scroll hint */}
      {activeGroup === 0 && (
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
