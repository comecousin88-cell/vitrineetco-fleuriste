import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Les photos sont déjà étalonnées et compressées par les scripts : next/image ne fait que les redimensionner.
    qualities: [82],
    formats: ["image/webp"],
  },
};

export default nextConfig;
