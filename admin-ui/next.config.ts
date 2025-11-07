import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      }
    ],
  },
};

export default nextConfig;
