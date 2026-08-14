import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/consultation",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/consultations",
        destination: "/packages",
        permanent: true,
      },
      {
        source: "/consultations/free-strategy-call",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/consultations/paid-strategy-call",
        destination: "/packages/strategy-call",
        permanent: true,
      },
      {
        source: "/consultations/success",
        destination: "/packages/success",
        permanent: true,
      },
      {
        source: "/consultations/cancel",
        destination: "/packages/cancel",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
