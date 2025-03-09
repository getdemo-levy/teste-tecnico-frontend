import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://teste-tecnico-backend.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
