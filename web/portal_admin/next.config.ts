import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  allowedDevOrigins: ["*"],
  output:"export",
  images:{
    unoptimized:true,
  }

};

export default nextConfig;
