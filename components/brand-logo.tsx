import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
}

const sizeMap = {
  sm: "text-sm tracking-[0.2em]",
  md: "text-lg tracking-[0.25em]",
  lg: "text-2xl tracking-[0.3em]",
  xl: "text-4xl md:text-5xl tracking-[0.35em]",
};

export function BrandLogo({
  className,
  size = "md",
  asLink = true,
}: BrandLogoProps) {
  const logoContent = (
    <span
      className={cn(
        "font-brand font-black uppercase select-none",
        sizeMap[size],
        className
      )}
    >
      LEMARQUE
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-block transition-opacity hover:opacity-70">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
