/**
 * @file This file initializes and configures the Firebase SDK for the application.
 * It exports instances of the Firebase app, Realtime Database, Authentication, and Storage.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * The Firebase configuration object for your project.
 * These keys are read from environment variables to avoid exposing them in the source code.
 * It is crucial to create a .env.local file in the root of your project and populate it
 * with the corresponding values from your Firebase project settings.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase, creating a new app instance if one doesn't already exist.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get instances of the Firebase services.
const db: Database = getDatabase(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);


// Export the initialized services for use throughout the application.
export { app, db, auth, storage };
