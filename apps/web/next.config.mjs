/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@designr/ui", "@designr/use-editor"],
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        pathname: '/**',
        port: '',
        protocol: 'https',
      }
    ]
  }
};

export default nextConfig;
