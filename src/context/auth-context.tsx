'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set, remove, update } from 'firebase/database';
import type { User } from '@/lib/users';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase'; 

/**
 * Defines the shape of the authentication context.
 * @property {User | null} user - The current authenticated user object, or null if not logged in.
 * @property {boolean} loading - A boolean indicating if the authentication state is currently being determined.
 * @property {(email: string, pass: string) => Promise<void>} login - Function to log in a user.
 * @property {() => void} logout - Function to log out the current user.
 * @property {(email: string, pass: string, user: Omit<User, 'id'>) => Promise<void>} addUser - Function to create a new user account.
 * @property {(user: User) => Promise<void>} updateUser - Function to update a user's data in the database.
 * @property {(userId: string) => Promise<void>} deleteUser - Function to delete a user's data from the database.
 */
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  addUser: (email: string, password: string, newUser: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
};

// Create the authentication context.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * The provider component for the authentication context.
 * It manages the user's authentication state and provides auth-related functions to its children.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the context.
 * @returns {React.ReactElement} The rendered provider.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Effect to listen for changes in the Firebase authentication state.
   * It sets the user object when a user logs in and clears it on logout.
   */
  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If a user is authenticated, fetch their details from the database.
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef).catch(() => null);

        if (snapshot?.exists()) {
              // Create a user object with data from both Auth and the Database.
            const userDoc: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: snapshot?.val()?.name || 'Korisnik',
                username: snapshot?.val()?.username || firebaseUser.email || '',
                // The role is fetched from the database, providing a single source of truth.
                role: snapshot?.val()?.role || 'user',
            };
            setUser(userDoc);
        } else {
            // Handle case where user exists in Auth but not in the database
            // This might happen if database entry was manually deleted.
            // For now, we sign them out to prevent an inconsistent state.
            await signOut(auth);
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    // Cleanup function to unsubscribe from the listener on component unmount.
    return () => unsubscribe();
  }, []);
  
  /**
   * Signs in a user with email and password.
   */
  const login = async (email: string, pass: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, pass);
  };

  /**
   * Signs out the current user and redirects to the login page.
   */
  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    router.push('/login');
  };

  /**
   * Creates a new user in Firebase Authentication and adds their details to the Realtime Database.
   * @param {string} email - The user's email for authentication.
   * @param {string} password - The user's password for authentication.
   * @param {Omit<User, 'id'>} newUser - The user object containing additional details.
   */
  const addUser = async (email: string, password: string, newUser: Omit<User, 'id'>) => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Add user details to the Realtime Database under the `users` node.
    const newUserRef = ref(db, `users/${uid}`);
    await set(newUserRef, {
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  };

  /**
   * Updates a user's data in the Realtime Database.
   * @param {User} updatedUser - The user object with updated information.
   */
  const updateUser = async (updatedUser: User) => {
    const db = getFirebaseDb();
    const userRef = ref(db, `users/${updatedUser.id}`);
    await update(userRef, {
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role,
        email: updatedUser.email
    });
    
    // Note: Updating email in Firebase Auth is a sensitive operation
    // requiring re-authentication and is not implemented here for simplicity.
  };

  /**
   * Deletes a user's record from the Realtime Database.
   * IMPORTANT: This only removes the user from the database, not from Firebase Authentication.
   * The user will still exist and be able to log in, but their data will be gone.
   * For full and secure deletion, a backend function (e.g., Firebase Cloud Function)
   * that uses the Admin SDK is required to delete the Auth user record.
   * @param {string} userId - The ID of the user to delete from the database.
   */
  const deleteUser = async (userId: string) => {
    const db = getFirebaseDb();
    const userRef = ref(db, `users/${userId}`);
    await remove(userRef);
    console.warn(`User ${userId} deleted from Realtime Database. Please delete the corresponding user from the Firebase Auth console to complete the process.`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * A custom hook to easily access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
