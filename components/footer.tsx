import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full px-6 md:px-10 py-12 md:py-16">
      <Separator className="mb-12 bg-white/10" />
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="space-y-4">
          <p className="font-brand text-lg tracking-[0.25em] uppercase">
            LEMARQUE
          </p>
          <p className="text-xs text-muted-foreground tracking-wider max-w-xs">
            Manufactured 1/1 Attire. Every piece handmade,
            unique, and irreplaceable.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <Link
            href="/collection/xxv"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            XXV Collection
          </Link>
          <Link
            href="/gallery"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Archive
          </Link>
          <Link
            href="/about"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            About
          </Link>
          <a
            href="https://le-marque.com/contacts/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          &copy; {new Date().getFullYear()} LEMARQUE. All rights reserved.
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
          Handmade &mdash; Price Upon Request
        </p>
      </div>
    </footer>
  );
}
