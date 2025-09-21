/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Retirer output: 'export' pour permettre les routes API dynamiques
  trailingSlash: true,
  distDir: '.next',
  experimental: {
    serverComponentsExternalPackages: ['fs'],
  },
}

export default nextConfig