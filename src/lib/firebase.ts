'use client';
/**
 * @file This file initializes and configures the Firebase SDK for the application.
 * It uses a singleton pattern to ensure Firebase is initialized only once.
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

// Singleton function to get the Firebase app instance
function getFirebaseApp(): FirebaseApp {
    if (getApps().length === 0) {
        if (!firebaseConfig.projectId) {
            throw new Error("Firebase config is incomplete. Check your .env.local file.");
        }
        return initializeApp(firebaseConfig);
    } else {
        return getApp();
    }
}

function getFirebaseAuth(): Auth {
    return getAuth(getFirebaseApp());
}

function getFirebaseDb(): Database {
    return getDatabase(getFirebaseApp());
}

function getFirebaseStorage(): FirebaseStorage {
    return getStorage(getFirebaseApp());
}


export { getFirebaseAuth, getFirebaseDb, getFirebaseStorage };
