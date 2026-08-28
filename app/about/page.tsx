import type { Metadata } from "next";
import { AboutPageClient } from "./about-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "LEMARQUE. Redefining the boundaries of contemporary fashion through avant-garde design and uncompromising vision.",
  openGraph: {
    title: "About | LEMARQUE",
    description:
      "LEMARQUE. Redefining the boundaries of contemporary fashion through avant-garde design and uncompromising vision.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | LEMARQUE",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
