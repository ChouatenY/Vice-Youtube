/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // Allow iframe embedding from any domain
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;"
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
