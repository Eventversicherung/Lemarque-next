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
    root: "gap-2",
    crest: "size-5 md:size-6",
    wordmark: "h-3 md:h-[13px] aspect-[949/96]",
    crestSizes: "24px",
    wordmarkSizes: "128px",
  },
  md: {
    root: "gap-2.5",
    crest: "size-8",
    wordmark: "h-4 aspect-[949/96]",
    crestSizes: "32px",
    wordmarkSizes: "160px",
  },
  lg: {
    root: "gap-3 md:gap-3.5",
    crest: "size-12 md:size-14",
    wordmark: "h-7 md:h-8 aspect-[949/96]",
    crestSizes: "56px",
    wordmarkSizes: "280px",
  },
  xl: {
    root: "gap-2.5 sm:gap-5 md:gap-6",
    crest: "size-9 sm:size-14 md:size-[4.5rem] lg:size-20",
    wordmark: "h-5 sm:h-8 md:h-11 lg:h-[3.25rem] aspect-[949/96]",
    crestSizes: "(max-width: 640px) 36px, (max-width: 768px) 56px, 80px",
    wordmarkSizes: "(max-width: 640px) 200px, (max-width: 768px) 360px, 640px",
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
      className={cn("inline-flex items-center select-none", s.root, className)}
    >
      <span className={cn("relative shrink-0", s.crest)}>
        <Image
          src="/brand/crest.webp"
          alt=""
          fill
          sizes={s.crestSizes}
          className="object-contain pointer-events-none"
          priority={priority}
        />
      </span>
      <span className={cn("relative shrink-0", s.wordmark)}>
        <Image
          src="/brand/wordmark.webp"
          alt=""
          fill
          sizes={s.wordmarkSizes}
          className="object-contain object-left pointer-events-none"
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
