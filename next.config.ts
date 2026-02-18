import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "le-marque.com",
      },
    ],
  },
};

export default nextConfig;
