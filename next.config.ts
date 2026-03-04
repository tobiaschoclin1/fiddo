import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
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
