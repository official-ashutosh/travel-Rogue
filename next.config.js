/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  // Configure the source directory
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Configure paths for the new structure
  webpack: (config, { isServer }) => {
    // Ensure proper module resolution for the new structure
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      '@/frontend': path.resolve(__dirname, './src/frontend'),
      '@/backend': path.resolve(__dirname, './src/backend'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quixotic-impala-265.convex.cloud",
        port: "",
      },
      {
        protocol: "https",
        hostname: "kindred-rhinoceros-563.convex.cloud",
        port: "",
      },
      {
        protocol: "https",
        hostname: "openweathermap.org",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
