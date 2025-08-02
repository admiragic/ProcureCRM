
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnAHY6pg-cHWCIkOipc_qKeZUYuYsuzQk",
  authDomain: "procurecrm.firebaseapp.com",
  projectId: "procurecrm",
  storageBucket: "procurecrm.appspot.com",
  messagingSenderId: "289531756755",
  appId: "1:289531756755:web:6eed801e73589d4fd11426",
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);


export { app, db, auth, storage };
