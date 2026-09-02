"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Collection } from "@/lib/collections";
import {
  isWebGpuAvailable,
  startMalumOcean,
  type MalumOceanHandle,
} from "@/lib/vgpu/malum-ocean";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobilePerf(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  );
}

export function MalumOceanHero({ collection }: { collection: Collection }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion() || !isWebGpuAvailable()) return;

    let handle: MalumOceanHandle | undefined;
    let cancelled = false;

    handle = startMalumOcean(canvas, {
      reduced: isMobilePerf(),
      onReady: () => {
        if (!cancelled) {
          document.documentElement.classList.add("malum-hero-live");
          setLive(true);
        }
      },
      onError: (error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("[malum-ocean]", error);
        }
      },
      onPulse: (pulse) => {
        const glow = Math.max(0, (pulse - 0.92) / 0.28);
        document.documentElement.style.setProperty(
          "--malum-glow",
          glow.toFixed(3),
        );
      },
    });

    const syncPause = () => {
      const hidden = document.visibilityState === "hidden";
      handle?.setPaused(hidden);
    };
    document.addEventListener("visibilitychange", syncPause);

    const observer = new IntersectionObserver(
      ([entry]) => {
        handle?.setPaused(!entry?.isIntersecting);
      },
      { threshold: 0, rootMargin: "48px" },
    );
    observer.observe(canvas);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", syncPause);
      observer.disconnect();
      handle?.stop();
      document.documentElement.classList.remove("malum-hero-live");
      document.documentElement.style.removeProperty("--malum-glow");
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <Image
        src={collection.heroImage.src}
        alt={collection.heroImage.alt}
        fill
        priority
        className="object-cover"
        style={
          collection.heroImagePosition
            ? { objectPosition: collection.heroImagePosition }
            : undefined
        }
        sizes="100vw"
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          live ? "opacity-100" : "opacity-0"
        }`}
        style={{ display: "block", pointerEvents: "none" }}
      />
    </div>
  );
}
