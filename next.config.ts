import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['http2.mlstatic.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'http2.mlstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'd26lpennugtm8s.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
