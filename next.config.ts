import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_KEY: process.env.INTERNAL_API_TOKEN,
  },
};

export default nextConfig;
