/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@designr/ui", "@designr/use-editor", '@designr/auth', '@designr/db', '@designr/api-errors'],
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        pathname: '/**',
        port: '',
        protocol: 'https',
      },
      {
        hostname: 'res.cloudinary.com',
        pathname: '/**',
        port: '',
        protocol: 'https',
      }
    ]
  },
  }
  


export default nextConfig;
