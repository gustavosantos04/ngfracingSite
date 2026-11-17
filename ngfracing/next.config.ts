import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: currentDir,
  images: {
    remotePatterns: process.env.BLOB_PUBLIC_HOSTNAME ? [{
      protocol: "https", hostname: process.env.BLOB_PUBLIC_HOSTNAME, pathname: "/products/**", search: ""
    }] : [],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [48, 64, 96, 120, 180, 240, 384]
  }
};

export default nextConfig;
