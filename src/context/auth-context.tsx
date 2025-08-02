
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, deleteUser as deleteFirebaseUser } from 'firebase/auth';
import { ref, get, set, remove, update } from 'firebase/database';
import type { User } from '@/lib/users';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; 

/**
 * Defines the shape of the authentication context.
 * @property {User | null} user - The current authenticated user object, or null if not logged in.
 * @property {boolean} loading - A boolean indicating if the authentication state is currently being determined.
 * @property {(email: string, pass: string) => Promise<void>} login - Function to log in a user.
 * @property {() => void} logout - Function to log out the current user.
 * @property {(user: User) => Promise<void>} addUser - Function to create a new user account.
 * @property {(user: User) => Promise<void>} updateUser - Function to update a user's data in the database.
 * @property {(userId: string) => Promise<void>} deleteUser - Function to delete a user's account and data.
 */
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  addUser: (user: User) => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If a user is authenticated, fetch their details from the database.
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef).catch(() => null);

        // Create a user object with data from both Auth and the Database.
        const userDoc: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: snapshot?.val()?.name || 'Korisnik',
            username: snapshot?.val()?.username || firebaseUser.email || '',
            // Simple logic to assign role based on email.
            role: snapshot?.val()?.role || 'user',
        };
        setUser(userDoc);
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
   * @param {string} email - The user's email.
   * @param {string} pass - The user's password.
   */
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  /**
   * Signs out the current user and redirects to the login page.
   */
  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  /**
   * Creates a new user in Firebase Authentication and adds their details to the Realtime Database.
   * @param {User} newUser - The user object containing all necessary details including password.
   */
  const addUser = async (newUser: User) => {
    if (!newUser.password) throw new Error("Password is required for new user");
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const uid = userCredential.user.uid;
        
        // Add user details to the Realtime Database under the `users` node.
        const newUserRef = ref(db, `users/${uid}`);
        await set(newUserRef, {
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        });

    } catch(error) {
        console.error("Error creating new user:", error);
        throw error;
    }
  };

  /**
   * Updates a user's data in the Realtime Database.
   * @param {User} updatedUser - The user object with updated information.
   */
  const updateUser = async (updatedUser: User) => {
    try {
        const userRef = ref(db, `users/${updatedUser.id}`);
        await update(userRef, {
            name: updatedUser.name,
            username: updatedUser.username,
            role: updatedUser.role,
            email: updatedUser.email
        });
        
        // Note: Updating email in Firebase Auth is a sensitive operation
        // requiring re-authentication and is not implemented here for simplicity.
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
  };

  /**
   * Deletes a user from the Realtime Database.
   * @param {string} userId - The ID of the user to delete.
   */
  const deleteUser = async (userId: string) => {
      try {
        // This only removes the user's data from the Realtime Database.
        // Deleting a user from Firebase Auth itself is a privileged operation
        // and typically should be handled by a secure backend (e.g., a Cloud Function).
        const userRef = ref(db, `users/${userId}`);
        await remove(userRef);
        console.log(`User ${userId} deleted from Realtime Database.`);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
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
