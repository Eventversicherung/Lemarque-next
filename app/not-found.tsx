import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="font-brand text-5xl md:text-7xl tracking-[0.35em] mb-4">
        404
      </h1>
      <p className="text-sm text-muted-foreground tracking-wider mb-8">
        This page does not exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        <ArrowLeft className="w-3 h-3" />
        Return Home
      </Link>
    </main>
  );
}
