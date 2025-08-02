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

// Initialize Firebase
const getAppInstance = (): FirebaseApp => {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

const getDb = (): Firestore => getFirestore(getAppInstance());
const getFirebaseAuth = (): Auth => getAuth(getAppInstance());
const getStorageInstance = (): FirebaseStorage => getStorage(getAppInstance());


export { getAppInstance, getDb, getFirebaseAuth, getStorageInstance };
