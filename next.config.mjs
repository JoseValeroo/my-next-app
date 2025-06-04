/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },

  images: {
    domains: [
      'imagenes.elpais.com',
      'ejemplo.com',
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'sjc.microlink.io',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: "https",
        hostname: "blog.postman.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "seranking.com",
      },
      {
        protocol: "https",
        hostname: "seranking.com",
        pathname: "/es/blog/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "e7.pngegg.com",
      },
    ],
  },
};

export default nextConfig;
