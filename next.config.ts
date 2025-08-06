/** @type {import('next').NextConfig} */
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // We're setting this to false to allow the project to build even if there are TypeScript errors.
    // This is useful during development, but should be set to `false` in production.
    ignoreBuildErrors: false,
  },
  eslint: {
    // We're ignoring ESLint during builds to speed up the development process.
    // It's recommended to run `npm run lint` separately before deploying.
    ignoreDuringBuilds: true,
  },
  images: {
    // This configures Next.js to optimize images from the specified remote patterns.
    // Here, we're allowing images from `placehold.co`.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;