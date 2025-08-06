
'use client';
/**
 * @file This file initializes and configures the Firebase SDK for the application.
 * It ensures that Firebase is initialized only once and provides getter functions
 * to safely access Firebase service instances.
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

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Database;
let storage: FirebaseStorage;


if (!isFirebaseConfigValid) {
    console.error("Firebase configuration is incomplete. Please check your environment variables.");
}

if (getApps().length === 0 && isFirebaseConfigValid) {
    try {
        firebaseApp = initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
    }
} else if (isFirebaseConfigValid) {
    firebaseApp = getApp();
}

if (firebaseApp) {
    auth = getAuth(firebaseApp);
    db = getDatabase(firebaseApp);
    storage = getStorage(firebaseApp);
}


export { db, auth, storage };
