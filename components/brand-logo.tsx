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
    width: "w-16 md:w-[4.75rem]",
    gap: "gap-1",
    crestSizes: "(max-width: 768px) 64px, 76px",
    wordmarkSizes: "(max-width: 768px) 64px, 76px",
  },
  md: {
    width: "w-24",
    gap: "gap-1.5",
    crestSizes: "96px",
    wordmarkSizes: "96px",
  },
  lg: {
    width: "w-28 md:w-32",
    gap: "gap-1.5",
    crestSizes: "(max-width: 768px) 112px, 128px",
    wordmarkSizes: "(max-width: 768px) 112px, 128px",
  },
  xl: {
    width: "w-36 sm:w-44 md:w-52 lg:w-60",
    gap: "gap-1.5 sm:gap-2",
    crestSizes:
      "(max-width: 640px) 144px, (max-width: 768px) 176px, (max-width: 1024px) 208px, 240px",
    wordmarkSizes:
      "(max-width: 640px) 144px, (max-width: 768px) 176px, (max-width: 1024px) 208px, 240px",
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
        "inline-flex flex-col items-stretch select-none",
        s.width,
        s.gap,
        className
      )}
    >
      <span className="relative w-full aspect-[512/519]">
        <Image
          src="/brand/crest.webp"
          alt=""
          fill
          sizes={s.crestSizes}
          className="object-contain pointer-events-none"
          priority={priority}
        />
      </span>
      <span className="relative w-full aspect-[949/96]">
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
        className="inline-flex transition-opacity duration-300 hover:opacity-70"
      >
        {mark}
      </Link>
    );
  }

  return mark;
}
