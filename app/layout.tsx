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
    "LEMARQUE. Manufactured 1/1 Attire. Handcrafted leather goods, avant-garde outerwear, and unique accessories.",
  keywords: [
    "LEMARQUE",
    "fashion",
    "manufactured 1/1",
    "handmade",
    "leather goods",
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
    url: "https://le-marque.com",
    siteName: "LEMARQUE",
    title: "LEMARQUE | Manufactured 1/1 Attire",
    description:
      "Handcrafted leather goods, avant-garde outerwear, and unique accessories. Every piece manufactured as a unique 1/1 creation.",
    images: [
      {
        url: "https://le-marque.com/wp-content/uploads/2025/01/LeMarque_Kuhlhaus_82-scaled.webp",
        width: 2560,
        height: 1707,
        alt: "LEMARQUE XXV Collection at Kuhlhaus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEMARQUE | Manufactured 1/1 Attire",
    description:
      "Handcrafted leather goods, avant-garde outerwear, and unique accessories. Every piece manufactured as a unique 1/1 creation.",
    images: [
      "https://le-marque.com/wp-content/uploads/2025/01/LeMarque_Kuhlhaus_82-scaled.webp",
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
