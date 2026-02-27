/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Proxy API requests to Firecrawl backend
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.FIRECRAWL_API_URL || 'http://localhost:3002'}/:path*`,
      },
    ];
  },
  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;