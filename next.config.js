/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Adicione para SQLite na Vercel
  output: 'standalone',
}

module.exports = nextConfig