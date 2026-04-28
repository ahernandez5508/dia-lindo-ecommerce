/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mysql2', 'drizzle-orm', '@auth/drizzle-adapter', 'bcryptjs', 'mercadopago'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
