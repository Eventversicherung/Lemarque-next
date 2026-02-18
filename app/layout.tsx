import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LEMARQUE",
    template: "%s | LEMARQUE",
  },
  description:
    "LEMARQUE — High-end fashion label. Explore our collections through an immersive visual experience.",
  keywords: [
    "LEMARQUE",
    "fashion",
    "high-end",
    "luxury",
    "collections",
    "designer",
    "avant-garde",
  ],
  authors: [{ name: "LEMARQUE" }],
  creator: "LEMARQUE",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lemarque.com",
    siteName: "LEMARQUE",
    title: "LEMARQUE",
    description:
      "High-end fashion label. Explore our collections through an immersive visual experience.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "LEMARQUE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEMARQUE",
    description:
      "High-end fashion label. Explore our collections through an immersive visual experience.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=630&fit=crop&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
