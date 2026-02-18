"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { GalleryView } from "@/components/gallery-view";

export function GalleryPageClient() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative h-full w-full"
      >
        {/* Gallery header overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-5">
          <BrandLogo size="sm" className="text-white" />
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors duration-300"
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>

        <GalleryView />
      </motion.div>
    </main>
  );
}
