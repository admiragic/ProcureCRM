
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnAHY6pg-cHWCIkOipc_qKeZUYuYsuzQk",
  authDomain: "procurecrm.firebaseapp.com",
  projectId: "procurecrm",
  storageBucket: "procurecrm.appspot.com",
  messagingSenderId: "289531756755",
  appId: "1:289531756755:web:6eed801e73589d4fd11426",
  databaseURL: "https://procurecrm-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db: Database = getDatabase(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);


export { app, db, auth, storage };
