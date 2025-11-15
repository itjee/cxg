import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16에서 required 되는 qualities 설정
    qualities: [75, 100],
    // 외부 이미지 호스트 허용
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8200',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/favicon.ico',
          destination: '/api/favicon',
        },
      ],
    };
  },
};

export default nextConfig;
