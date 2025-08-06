
'use client';
/**
 * @file This file initializes and configures the Firebase SDK for the application.
 * It exports instances of the Firebase app, Realtime Database, Authentication, and Storage.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Check if all required environment variables are present.
const isFirebaseConfigValid =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId &&
  firebaseConfig.databaseURL;

let app: FirebaseApp;

if (isFirebaseConfigValid) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} else {
    console.warn("Firebase configuration is incomplete. Firebase services will not be available. This is expected during the build process if environment variables are not set.");
}

function getFirebaseAuth(): Auth {
    if (!isFirebaseConfigValid) {
        throw new Error("Firebase configuration is incomplete.");
    }
    return getAuth(app);
}

function getFirebaseDb(): Database {
    if (!isFirebaseConfigValid) {
        throw new Error("Firebase configuration is incomplete.");
    }
    return getDatabase(app);
}

function getFirebaseStorage(): FirebaseStorage {
    if (!isFirebaseConfigValid) {
        throw new Error("Firebase configuration is incomplete.");
    }
    return getStorage(app);
}

export const auth = isFirebaseConfigValid ? getFirebaseAuth() : undefined;
export const db = isFirebaseConfigValid ? getFirebaseDb() : undefined;
export const storage = isFirebaseConfigValid ? getFirebaseStorage() : undefined;
