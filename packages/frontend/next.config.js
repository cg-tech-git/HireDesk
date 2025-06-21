/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Enable standalone output for Docker
  transpilePackages: ['@hiredesk/shared'],
  images: {
    domains: ['localhost', 'hiredesk-backend-544256061771.us-central1.run.app'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://hiredesk-backend-544256061771.us-central1.run.app/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://hiredesk-backend-544256061771.us-central1.run.app/api'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 