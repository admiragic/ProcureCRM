
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
    FIREBASE_PROJECT_ID: "procurecrm",
    FIREBASE_APP_ID: "1:289531756755:web:6eed801e73589d4fd11426",
    FIREBASE_STORAGE_BUCKET: "procurecrm.firebasestorage.app",
    FIREBASE_API_KEY: "AIzaSyAnAHY6pg-cHWCIkOipc_qKeZUYuYsuzQk",
    FIREBASE_AUTH_DOMAIN: "procurecrm.firebaseapp.com",
    FIREBASE_MESSAGING_SENDER_ID: "289531756755",
  }
};

export default nextConfig;
