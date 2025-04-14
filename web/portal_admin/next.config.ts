import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  allowedDevOrigins: ["*"],
  output:"export",
  images:{
    unoptimized:true,
  }

};

export default nextConfig;
