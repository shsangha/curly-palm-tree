import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.139:3000",
    "192.168.0.139",
  ],
};

export default nextConfig;
