import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"t4.ftcdn.net",
        port:""
      }
    ]
  }
};

export default nextConfig;
