import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages:['pino','pino-pretty'], // server external packages means these packages will not be bundled by nextjs compiler
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
