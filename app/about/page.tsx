import type { Metadata } from "next";
import { AboutPageClient } from "./about-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "LEMARQUE. Redefining the boundaries of contemporary fashion through avant-garde design and uncompromising vision.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
