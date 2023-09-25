import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */

export default withContentlayer({
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/coolpace/V2EX_Polish',
        permanent: true,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
})
