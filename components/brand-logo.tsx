import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
  priority?: boolean;
}

const sizeMap = {
  sm: {
    width: "w-[4.5rem] md:w-20",
    gap: "gap-2",
    crestSizes: "(max-width: 768px) 72px, 80px",
    wordmarkSizes: "(max-width: 768px) 72px, 80px",
  },
  md: {
    width: "w-28",
    gap: "gap-2.5",
    crestSizes: "112px",
    wordmarkSizes: "112px",
  },
  lg: {
    width: "w-32 md:w-36",
    gap: "gap-3",
    crestSizes: "(max-width: 768px) 128px, 144px",
    wordmarkSizes: "(max-width: 768px) 128px, 144px",
  },
  xl: {
    width: "w-48 sm:w-56 md:w-64 lg:w-72",
    gap: "gap-3 sm:gap-4 md:gap-5",
    crestSizes:
      "(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px",
    wordmarkSizes:
      "(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px",
  },
};

export function BrandLogo({
  className,
  size = "md",
  asLink = true,
  priority = false,
}: BrandLogoProps) {
  const s = sizeMap[size];

  const mark = (
    <span
      className={cn(
        "inline-flex flex-col items-stretch overflow-hidden select-none",
        s.width,
        s.gap,
        className
      )}
    >
      <span className="relative w-full min-w-0 aspect-[640/635]">
        <Image
          src="/brand/crest.webp"
          alt=""
          fill
          sizes={s.crestSizes}
          className="object-contain pointer-events-none"
          priority={priority}
        />
      </span>
      <span className="relative w-full min-w-0 aspect-[946/92]">
        <Image
          src="/brand/wordmark.webp"
          alt=""
          fill
          sizes={s.wordmarkSizes}
          className="object-contain object-center pointer-events-none"
          priority={priority}
        />
      </span>
    </span>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        aria-label="LEMARQUE Home"
        className="inline-flex max-w-full transition-opacity duration-300 hover:opacity-70"
      >
        {mark}
      </Link>
    );
  }

  return mark;
}
