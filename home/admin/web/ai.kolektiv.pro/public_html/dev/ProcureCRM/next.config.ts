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
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAnAHY6pg-cHWCIkOipc_qKeZUYuYsuzQk",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "procurecrm.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "procurecrm",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "procurecrm.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "289531756755",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:289531756755:web:6eed801e73589d4fd11426",
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: "https://procurecrm-default-rtdb.firebaseio.com"
  }
};

export default nextConfig;
