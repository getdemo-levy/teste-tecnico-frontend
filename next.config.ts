import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://52.200.133.252:3005/:path*",
      },
    ];
  },
};

export default nextConfig;
