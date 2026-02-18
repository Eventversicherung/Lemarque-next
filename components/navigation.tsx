"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/collection/xxv", label: "XXV Collection" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <nav className="flex items-center justify-between px-6 md:px-10 py-5">
          <BrandLogo size="sm" className="text-white" />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-[0.2em] text-white transition-opacity duration-300",
                  pathname === link.href ? "opacity-100" : "opacity-60 hover:opacity-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-white p-2 -mr-2"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-100 bg-black flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <BrandLogo size="sm" className="text-white" />
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-2 -mr-2"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {[{ href: "/", label: "Home" }, ...navLinks].map(
                (link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.08,
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-2xl uppercase tracking-[0.3em] text-white transition-opacity duration-300",
                        pathname === link.href
                          ? "opacity-100"
                          : "opacity-50 hover:opacity-100"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
            </div>

            <div className="px-6 py-8 text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                LEMARQUE &copy; {new Date().getFullYear()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
