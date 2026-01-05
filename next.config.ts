import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  typescript: {
    ignoreBuildErrors: true,
  } /* config options here */,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t4.ftcdn.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      }
    ],
  },
};

export default nextConfig;
