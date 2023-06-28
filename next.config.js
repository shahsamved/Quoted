/** @type {import('next').NextConfig} */
const nextConfig = {}

// next.config.js
module.exports = {
    reactStrictMode: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      return config;
    }
  };
  
