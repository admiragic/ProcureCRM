
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


// A promise that resolves when Firebase is initialized.
let initializationPromise: Promise<void> | null = null;

/**
 * Initializes the Firebase app if it hasn't been already.
 * This function is idempotent and safe to call multiple times.
 */
const initializeFirebase = () => {
    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = new Promise((resolve, reject) => {
        if (!isFirebaseConfigValid) {
            console.error("Firebase configuration is incomplete. Please check your environment variables.");
            return reject(new Error("Firebase configuration is incomplete."));
        }

        if (getApps().length === 0) {
            try {
                firebaseApp = initializeApp(firebaseConfig);
                auth = getAuth(firebaseApp);
                db = getDatabase(firebaseApp);
                storage = getStorage(firebaseApp);
                console.log("Firebase initialized successfully.");
                resolve();
            } catch (error) {
                console.error("Firebase initialization failed:", error);
                reject(error);
            }
        } else {
            firebaseApp = getApp();
            auth = getAuth(firebaseApp);
            db = getDatabase(firebaseApp);
            storage = getStorage(firebaseApp);
            resolve();
        }
    });

    return initializationPromise;
};


/**
 * Safely gets the Firebase Auth instance, initializing the app if necessary.
 * @returns {Promise<Auth>} A promise that resolves with the Auth instance.
 */
export const getAuthInstance = async (): Promise<Auth> => {
    await initializeFirebase();
    return auth;
};

/**
 * Safely gets the Firebase Realtime Database instance, initializing the app if necessary.
 * @returns {Promise<Database>} A promise that resolves with the Database instance.
 */
export const getDbInstance = async (): Promise<Database> => {
    await initializeFirebase();
    return db;
};

/**
 * Safely gets the Firebase Storage instance, initializing the app if necessary.
 * @returns {Promise<FirebaseStorage>} A promise that resolves with the Storage instance.
 */
export const getStorageInstance = async (): Promise<FirebaseStorage> => {
    await initializeFirebase();
    return storage;
};

// Direct exports for simpler server-side usage where async/await is straightforward.
// This is mainly for server actions that can handle the async initialization implicitly.
if (isFirebaseConfigValid) {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
    storage = getStorage(app);
}

export { db, auth, storage };
