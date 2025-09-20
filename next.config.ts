import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{
   domains: ['lh3.googleusercontent.com'],
  remotePatterns:[
    {hostname:'optirec.b-cdn.net', protocol:'https', port:'', pathname:'/**'},
  ]
 }
};

export default nextConfig;
