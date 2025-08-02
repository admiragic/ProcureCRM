
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "procurecrm",
  "appId": "1:289531756755:web:6eed801e73589d4fd11426",
  "storageBucket": "procurecrm.firebasestorage.app",
  "apiKey": "AIzaSyAnAHY6pg-cHWCIkOipc_qKeZUYuYsuzQk",
  "authDomain": "procurecrm.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "289531756755"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
