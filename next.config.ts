import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Enable static generation for dynamic routes
  output: 'standalone',
};

export default nextConfig;
