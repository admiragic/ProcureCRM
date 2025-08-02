
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
 * These keys are public and safe to expose on the client-side.
 * Security is enforced by Firebase Security Rules.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAnAHY6pg-cHWCIkOipc_qKeZUYuYsuzQk",
  authDomain: "procurecrm.firebaseapp.com",
  projectId: "procurecrm",
  storageBucket: "procurecrm.appspot.com",
  messagingSenderId: "289531756755",
  appId: "1:289531756755:web:6eed801e73589d4fd11426",
  databaseURL: "https://procurecrm-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase, creating a new app instance if one doesn't already exist.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get instances of the Firebase services.
const db: Database = getDatabase(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);


// Export the initialized services for use throughout the application.
export { app, db, auth, storage };
