import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript:{
    ignoreBuildErrors:true
  },
 images:{
   domains: ['lh3.googleusercontent.com'],
  remotePatterns:[
    {hostname:'OptiRec.b-cdn.net', protocol:'https', port:'', pathname:'/**'},
  ]
 }
};

export default nextConfig;
