/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mysql2', 'drizzle-orm', '@auth/drizzle-adapter', 'bcryptjs'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
