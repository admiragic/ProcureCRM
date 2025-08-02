
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnAHY6pg-cHWCIkOipc_qKeZUYuYsuzQk",
  authDomain: "procurecrm.firebaseapp.com",
  projectId: "procurecrm",
  storageBucket: "procurecrm.appspot.com",
  messagingSenderId: "289531756755",
  appId: "1:289531756755:web:6eed801e73589d4fd11426",
};

// Singleton pattern to ensure single instance of Firebase app and services
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

function initializeFirebase() {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
}

// Initialize on first load
initializeFirebase();

export { app, db, auth, storage };
