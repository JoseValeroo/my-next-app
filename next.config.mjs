/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // variables expuestas al cliente (browser)
    NEXT_PUBLIC_IP_BACKEND: process.env.NEXT_PUBLIC_IP_BACKEND,
    NEXT_PUBLIC_PORT_BACKEND: process.env.NEXT_PUBLIC_PORT_BACKEND,
  },
   async rewrites() {
    const ip = process.env.NEXT_PUBLIC_IP_BACKEND;
    const port = process.env.NEXT_PUBLIC_PORT_BACKEND;
    return [
      {
        source: '/api/auth/:path*',
        destination: `http://${ip}:${port}/api/auth/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `http://${ip}:${port}/uploads/:path*`,
      },
      // // Después “cualquier otro /api” (si lo necesitas):
      // {
      //   source: '/api/:path*',
      //   destination: 'http://192.168.1.136:3001/api/:path*'
      // }
    ]
  },
  images: {
    domains: [
      'imagenes.elpais.com',
      'ejemplo.com', // Agrega el dominio de la imagen por defecto
      // puedes agregar otros dominios si es necesario
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IP_BACKEND,
        port: process.env.NEXT_PUBLIC_PORT_BACKEND,
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: 'http',
        hostname: '192.168.1.136',
        port: '3001',
        pathname: '/uploads/**'
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
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com', // Nuevo dominio agregado
      },
      {
        protocol: "https",
        hostname: "blog.postman.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com", // 🔥 Agregado para Imgur
      },
      {
        protocol: "https",
        hostname: "seranking.com", // 🔥 Agregado para Seranking
      },
      {
        protocol: "https",
        hostname: "seranking.com",
        pathname: "/es/blog/wp-content/uploads/**", // 🔥 Asegura permitir cualquier imagen dentro de esa ruta
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com", // 🔥 Añadido para permitir imágenes de vecteezy
      },
      {
        protocol: "https",
        hostname: "e7.pngegg.com",
      },
    ],
  },
};

export default nextConfig;
