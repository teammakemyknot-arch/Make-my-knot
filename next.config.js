/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  eslint: {
    // 🚨 Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚨 Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
