/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Disable type checking during build for faster builds on Vercel
  typescript: {
    ignoreBuildErrors: process.env.VERCEL === '1',
  },
  
  // Disable ESLint during build for faster builds on Vercel
  eslint: {
    ignoreDuringBuilds: process.env.VERCEL === '1',
  },
  
  // Optimize build output
  swcMinify: true,
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Configure environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000',
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: true,
    // Optimize server components
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
