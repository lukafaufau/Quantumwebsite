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
  // Suppression de output: 'export' pour permettre les routes API dynamiques
  experimental: {
    serverComponentsExternalPackages: ['fs'],
  },
}

export default nextConfig