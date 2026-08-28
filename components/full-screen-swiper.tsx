"use client";

// Generic "vertical feed of cards = groups, horizontal peek-swipe = slides
// within a card" experience, in the spirit of a native app feed (Instagram /
// TikTok style): one card fills most of the screen, snaps into place, and a
// sliver of the next card always peeks at the bottom so people know there's
// more below. Swiping right inside a card peeks the next photo (blurred at
// the edge) before it snaps into focus.
//
// Used by:
//  - app/collections/collections-client.tsx (groups = collections, slides =
//    look photos, tapping the "View full collection" link opens the
//    collection detail page)
//  - app/collection/[slug]/shop/look-shop-client.tsx (groups = looks within
//    one collection, slides = every photo of that look's piece, tapping
//    anywhere opens the piece's product detail page)
//
// Keeping this logic in one place means both experiences stay visually and
// behaviorally consistent, and any future "swipe through things" view (e.g.
// a lookbook, a campaign) can reuse it instead of re-implementing snap /
// peek / embla wiring from scratch.
//
// Vertical navigation is native CSS scroll-snap (`overflow-y-auto` +
// `snap-y snap-mandatory`) rather than hand-rolled wheel/touch delta
// tracking - this gives correct trackpad/touch/keyboard momentum for free,
// is far more robust across devices, and is the browser-native way to build
// a snapping feed. Horizontal navigation inside a card stays on Embla, which
// already sets `touch-action: pan-y` on its viewport so vertical drags pass
// through to the outer scroller while horizontal drags are captured by it.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  /** Bottom-left caption shown on this slide. */
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
  /** Inline text link rendered inside the overlay (e.g. "View full collection"). */
  linkHref?: string;
  linkLabel?: string;
  /**
   * When set, every slide in this card (cover included) becomes a full tap
   * target linking here - used when all slides are photos of the same
   * shoppable piece, so the whole card behaves as "tap to view this piece".
   */
  coverHref?: string;
  /** Keep the eyebrow/title/description overlay visible on every slide, not just the cover. */
  persistentOverlay?: boolean;
  /** Remaining horizontal slides after the cover. */
  items: SwiperSlideItem[];
  /**
   * Product/look slugs used as URL hashes. The shop's snap scroller is
   * not the document, so native `#id` scrolling is not enough — these
   * ids let the feed restore the exact card after leaving a detail page.
   */
  anchorIds?: string[];
}

// Wide letter-spacing reads as intentional and premium on a short word like
// "MALUM" or "XXV", but the exact same tracking on a real product name like
// "Halfsleeve Knit & Suiting Trousers" spaces every letter apart until the
// word is unreadable and the block wraps across half the card. Scale both
// size and tracking down as the title gets longer instead of using one fixed
// value for every group.
function getTitleScale(title: string): { size: string; tracking: string } {
  const length = title.length;
  if (length <= 8) {
    return {
      size: "text-2xl md:text-4xl lg:text-5xl",
      tracking: "tracking-[0.25em]",
    };
  }
  if (length <= 14) {
    return {
      size: "text-xl md:text-3xl lg:text-4xl",
      tracking: "tracking-[0.1em]",
    };
  }
  if (length <= 24) {
    return {
      size: "text-lg md:text-2xl lg:text-3xl",
      tracking: "tracking-[0.04em]",
    };
  }
  return {
    size: "text-base md:text-xl lg:text-2xl",
    tracking: "tracking-normal",
  };
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
  isNear,
  onEmblaApi,
  priority = false,
}: {
  group: SwiperGroup;
  /** This is the card currently snapped into view. */
  isActive: boolean;
  /** Adjacent card - keep images eager/decoded so the peek never looks blank. */
  isNear: boolean;
  onEmblaApi?: (api: ReturnType<typeof useEmblaCarousel>[1]) => void;
  /**
   * Whether this card's cover image should get `priority` (eager, above
   * network queue). Kept separate from `isActive` because embedded/stacked
   * usage marks every card "active" (so its horizontal swipe always works),
   * which would otherwise mark every card's cover as priority at once.
   */
  priority?: boolean;
}) {
  const allSlides: SwiperSlideItem[] = useMemo(
    () => [{ media: group.media, href: group.coverHref }, ...group.items],
    [group.media, group.coverHref, group.items]
  );
  const [current, setCurrent] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    align: "center",
    skipSnaps: false,
    containScroll: "trimSnaps",
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
    if (emblaApi && isActive && onEmblaApi) {
      onEmblaApi(emblaApi);
    }
  }, [emblaApi, isActive, onEmblaApi]);

  const shouldRenderMedia = isActive || isNear;

  return (
    <div className="h-full w-full">
      <div
        ref={emblaRef}
        className="h-full overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="flex h-full">
          {allSlides.map((slide, index) => {
            const isCover = index === 0;
            const isFocused = current === index;
            const slideOuterClass =
              "relative flex-[0_0_88%] sm:flex-[0_0_80%] md:flex-[0_0_66%] lg:flex-[0_0_60%] xl:flex-[0_0_54%] min-w-0 h-full px-1 md:px-1.5";

            const content = (
              <div
                className={cn(
                  "relative h-full w-full overflow-hidden transition-all duration-300 ease-out will-change-transform",
                  isFocused
                    ? "opacity-100 scale-100 blur-none"
                    : "opacity-45 scale-[0.94] blur-[3px]"
                )}
              >
                {shouldRenderMedia &&
                  (() => {
                    const isPriority = priority && index === 0;
                    return (
                      <Image
                        src={slide.media.src}
                        alt={slide.media.alt}
                        fill
                        {...(isPriority
                          ? { priority: true }
                          : { loading: "lazy" as const })}
                        className="object-cover"
                        sizes="(max-width: 768px) 88vw, (max-width: 1024px) 66vw, 54vw"
                      />
                    );
                  })()}
                <div className="absolute inset-0 bg-black/25" />

                <AnimatePresence>
                  {isActive &&
                    isFocused &&
                    (isCover || group.persistentOverlay) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/50 mb-1.5">
                          {group.eyebrow}
                        </p>
                        <h2
                          className={cn(
                            "font-brand text-white mb-1.5 leading-tight",
                            getTitleScale(group.title).size,
                            getTitleScale(group.title).tracking
                          )}
                        >
                          {group.title}
                        </h2>
                        {group.description && (
                          <p className="text-xs md:text-sm text-white/60 max-w-md leading-relaxed">
                            {group.description}
                          </p>
                        )}
                        {group.linkHref && !group.coverHref && (
                          <Link
                            href={group.linkHref}
                            className="inline-block mt-4 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors duration-300"
                          >
                            {group.linkLabel ?? "View"}
                          </Link>
                        )}
                        {group.coverHref && group.linkLabel && (
                          <span className="inline-block mt-4 text-[10px] uppercase tracking-[0.25em] text-white/40">
                            {group.linkLabel} &rarr;
                          </span>
                        )}
                      </motion.div>
                    )}
                </AnimatePresence>

                {!group.persistentOverlay && !isCover && slide.label && (
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                      {slide.label}
                    </p>
                  </div>
                )}
              </div>
            );

            if (slide.href) {
              return (
                <Link key={index} href={slide.href} className={slideOuterClass}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={index} className={slideOuterClass}>
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edge vignette - darkens the peeking neighbor slides near the card
          boundary so the eye is pulled to the sharp, centered slide even
          before the blur/opacity treatment on the slide itself kicks in. */}
      {allSlides.length > 1 && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[16%] md:w-[20%] z-[6] bg-gradient-to-r from-black/80 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-[16%] md:w-[20%] z-[6] bg-gradient-to-l from-black/80 to-transparent"
          />
        </>
      )}

      {/* Horizontal progress dots */}
      {allSlides.length > 1 && (
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
      )}
    </div>
  );
}

function buildThresholdList(steps = 20): number[] {
  const thresholds: number[] = [];
  for (let i = 0; i <= steps; i++) thresholds.push(i / steps);
  return thresholds;
}

const INTERSECTION_THRESHOLDS = buildThresholdList();

function findAnchorIndex(groups: SwiperGroup[], hash: string): number {
  if (!hash) return -1;
  return groups.findIndex(
    (group) => group.anchorIds?.includes(hash) || group.key === hash
  );
}

function scrollSectionToContainerStart(
  container: HTMLElement,
  section: HTMLElement,
  behavior: ScrollBehavior = "auto"
) {
  const nextTop =
    container.scrollTop +
    (section.getBoundingClientRect().top - container.getBoundingClientRect().top);
  container.scrollTo({ top: nextTop, behavior });
}

export interface FullScreenSwiperProps {
  groups: SwiperGroup[];
  /** Fixed header overlay (logo, close link, etc.). */
  header?: ReactNode;
  /** Rendered instead of the swiper when `groups` is empty. */
  emptyState?: ReactNode;
  /**
   * When true, cards run the full viewport width with square corners,
   * matching the rest of the site's full-bleed editorial pages (e.g.
   * /collections, browsing between collections). When false (default),
   * cards are capped to a max-width and float as rounded tiles in the
   * surrounding black - the "Instagram feed" treatment used for shopping a
   * single collection's looks.
   */
  edgeToEdge?: boolean;
  /**
   * When true, renders in normal document flow (`relative`, full viewport
   * height) instead of `fixed inset-0` - for embedding the feed inline
   * inside a page that scrolls around it (e.g. the collection hub page),
   * rather than as its own standalone full-screen route. Arrow-key
   * navigation is scoped to only fire while the embedded section is
   * actually in view, so it doesn't hijack scrolling elsewhere on the page.
   */
  embedded?: boolean;
}

export function FullScreenSwiper({
  groups,
  header,
  emptyState,
  edgeToEdge = false,
  embedded = false,
}: FullScreenSwiperProps) {
  const [activeGroup, setActiveGroup] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ratiosRef = useRef<number[]>([]);
  const horizontalApiRef = useRef<ReturnType<typeof useEmblaCarousel>[1]>(null);
  const restoreTargetRef = useRef<number | null>(null);
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  useGroupPreloader(groups, activeGroup);

  const restoreAnchor = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      if (embedded) return -1;
      const hash = window.location.hash.replace(/^#/, "");
      const index = findAnchorIndex(groupsRef.current, hash);
      if (index < 0) return -1;
      const container = containerRef.current;
      const section = sectionRefs.current[index];
      if (!container || !section) return -1;
      scrollSectionToContainerStart(container, section, behavior);
      restoreTargetRef.current = index;
      setActiveGroup((prev) => (prev !== index ? index : prev));
      return index;
    },
    [embedded]
  );

  // Hash is client-only and the snap scroller is not the document, so we
  // restore the matching card before paint. That way "back" from a product
  // page lands on the piece you left, not look 01.
  useLayoutEffect(() => {
    if (embedded) return;
    restoreAnchor("auto");
  }, [embedded, restoreAnchor]);

  // Refs / snap layout can settle one frame later on mobile. Re-apply once
  // after paint if a hash is present, so we don't stick on look 01.
  useEffect(() => {
    if (embedded || !window.location.hash) return;
    restoreAnchor("auto");
  }, [embedded, restoreAnchor]);

  useEffect(() => {
    if (embedded) return;
    const onHashChange = () => {
      restoreAnchor("smooth");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [embedded, restoreAnchor]);

  // Keep the URL hash on the active look (replaceState, no extra history
  // entry) so the browser back button also returns to this card.
  // Wait until restore has applied `activeGroup` — otherwise the first
  // effect run (still on look 0) would overwrite the incoming piece hash.
  useEffect(() => {
    if (embedded) return;
    if (
      restoreTargetRef.current !== null &&
      activeGroup !== restoreTargetRef.current
    ) {
      return;
    }
    restoreTargetRef.current = null;
    const ids = groupsRef.current[activeGroup]?.anchorIds;
    if (!ids?.length) return;
    const current = window.location.hash.replace(/^#/, "");
    if (ids.includes(current)) return;
    const next = `${window.location.pathname}${window.location.search}#${ids[0]}`;
    window.history.replaceState(null, "", next);
  }, [activeGroup, embedded]);

  const handleEmblaApi = useCallback(
    (api: ReturnType<typeof useEmblaCarousel>[1]) => {
      horizontalApiRef.current = api;
    },
    []
  );

  const scrollTo = useCallback((index: number) => {
    if (index < 0 || index >= sectionRefs.current.length) return;
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Determine which card is "active" (dominantly in view) as the feed is
  // scrolled - the active card gets the interactive embla instance, the
  // text overlay, and priority image loading. Neighbors intentionally stay
  // partially visible (the "peek") but never become active until they take
  // over the majority of the viewport.
  useEffect(() => {
    const container = containerRef.current;
    // Embedded/stacked mode has no snap-scroll container to observe against
    // (cards are simply in normal page flow) and every card is always
    // "active", so the focus-dimming + winner-take-all active tracking
    // below only applies to the fixed, fullscreen feed.
    if (!container || groups.length === 0 || embedded) return;

    ratiosRef.current = groups.map(() => 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const indexAttr = target.dataset.index;
          if (indexAttr === undefined) return;
          ratiosRef.current[Number(indexAttr)] = entry.intersectionRatio;
          // Drive the card's focus blur/dim directly off the observed
          // ratio (continuous, no re-render) so it reads as a smooth
          // "coming into focus" as the card scrolls toward center, rather
          // than a hard snap the instant it becomes the active card.
          target.style.setProperty("--focus", String(entry.intersectionRatio));
        });

        let maxIndex = 0;
        let maxRatio = -1;
        ratiosRef.current.forEach((ratio, index) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxIndex = index;
          }
        });

        setActiveGroup((prev) => (prev !== maxIndex ? maxIndex : prev));
      },
      { root: container, threshold: INTERSECTION_THRESHOLDS }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
    // Only the count matters for (re)wiring the observer; group identity
    // changes don't need to reset which card is currently active.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.length, embedded]);

  useEffect(() => {
    // Embedded/stacked cards rely entirely on normal page + native scroll;
    // the custom arrow-key paging below is specific to the fixed fullscreen
    // feed and would otherwise swallow ArrowUp/ArrowDown while an embedded
    // section is on screen, breaking ordinary page scrolling with the
    // keyboard.
    if (embedded) return;
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGroup, scrollTo, embedded]);

  if (groups.length === 0) {
    return <>{emptyState}</>;
  }

  // Embedded mode: a plain vertical stack in normal document flow. No
  // scroll-snap, no independent scroll container — the page's native
  // scroll carries the user through every look. `edgeToEdge` matches the
  // /collections and /shop feeds (full bleed, square corners) so a
  // collection hub does not suddenly look inset next to those pages.
  if (embedded) {
    return (
      <div className={cn("w-full", !edgeToEdge && "px-6 md:px-16")}>
        <div
          className={cn(
            "flex flex-col",
            edgeToEdge ? "gap-0.5 md:gap-1" : "gap-4 md:gap-6"
          )}
        >
          {groups.map((group, index) => (
            <div
              key={group.key}
              id={group.anchorIds?.[0]}
              className={cn(
                "relative w-full overflow-hidden bg-neutral-950",
                edgeToEdge
                  ? "h-[88vh] md:h-[92vh] rounded-none"
                  : "h-[75vh] sm:h-[80vh] md:h-[85vh] rounded-[10px] md:rounded-[14px]"
              )}
            >
              {group.anchorIds?.slice(1).map((anchorId) => (
                <span key={anchorId} id={anchorId} hidden />
              ))}
              <GroupSlides group={group} isActive isNear priority={index === 0} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black overflow-hidden fixed inset-0">
      {header}

      {/* Vertical card feed - native scroll-snap so trackpad, touch and
          keyboard scrolling all get correct browser-native momentum. Each
          card is shorter than 100dvh on purpose, so the next card always
          peeks in at the bottom as a hint that there's more below. */}
      <div
        ref={containerRef}
        className="no-scrollbar h-dvh w-full overflow-y-auto snap-y snap-mandatory flex flex-col items-center gap-2 md:gap-3 px-0 pt-[env(safe-area-inset-top)]"
      >
        {groups.map((group, index) => {
          const isActive = index === activeGroup;
          const isNear = Math.abs(index - activeGroup) <= 1;
          return (
            <div
              key={group.key}
              id={group.anchorIds?.[0]}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              data-index={index}
              className={cn(
                "feed-card relative w-full shrink-0 h-[95dvh] md:h-[94dvh] snap-start snap-always overflow-hidden bg-neutral-950",
                edgeToEdge
                  ? "max-w-none rounded-none"
                  : "max-w-none md:max-w-5xl lg:max-w-6xl xl:max-w-7xl rounded-[10px] md:rounded-[14px]"
              )}
            >
              {group.anchorIds?.slice(1).map((anchorId) => (
                <span key={anchorId} id={anchorId} hidden />
              ))}
              <GroupSlides
                group={group}
                isActive={isActive}
                isNear={isNear}
                onEmblaApi={isActive ? handleEmblaApi : undefined}
                priority={isActive}
              />
            </div>
          );
        })}
        {/* Bottom spacer so the last card can fully snap into place above
            the peek zone instead of clipping against the viewport edge. */}
        <div aria-hidden className="shrink-0 h-[5dvh] w-full" />
      </div>

      {/* Group indicator (right side) */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none">
        {groups.map((group, index) => (
          <button
            key={group.key}
            onClick={() => scrollTo(index)}
            className="group p-1 pointer-events-auto"
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
      <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-30 pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-rl] rotate-180">
          {String(activeGroup + 1).padStart(2, "0")} /{" "}
          {String(groups.length).padStart(2, "0")}
        </p>
      </div>

      {/* Scroll hint */}
      {activeGroup === 0 && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
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
