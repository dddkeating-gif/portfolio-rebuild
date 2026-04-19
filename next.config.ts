import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myportfolio.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/IKEA',
        destination: 'https://ikea-quiz-app.vercel.app',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
