import type { NextConfig } from 'next'

const isDev = process.argv.includes('dev')
const isBuild = process.argv.includes('build')

if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  void import('velite').then((m) => m.build({ watch: isDev, clean: !isDev }))
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  redirects() {
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
}

export default nextConfig
