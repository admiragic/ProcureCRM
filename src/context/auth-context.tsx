
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import type { User } from '@/lib/users';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; 

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  addUser: (user: User) => Promise<void>;
  getUsers: () => Promise<User[]>;
  fetchUserDocument: (firebaseUser: FirebaseUser) => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserDocument = useCallback(async (firebaseUser: FirebaseUser): Promise<User | null> => {
      if (!firebaseUser) return null;
      try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
              return { id: userDoc.id, ...userDoc.data() } as User;
          }
          console.warn("No user document found for uid:", firebaseUser.uid);
          // Create a default user object if document doesn't exist
          return {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Unnamed User',
              role: 'user',
              username: firebaseUser.email || ''
          };
      } catch (error) {
          console.error("Error fetching user document:", error);
          return null;
      }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserDocument(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserDocument]);
  
  const login = async (email: string, pass: string) => {
    // The login logic is back in the context
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will then handle setting the user and redirecting
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const addUser = async (newUser: User) => {
    if (!newUser.password) throw new Error("Password is required for new user");
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const uid = userCredential.user.uid;
        
        await setDoc(doc(db, 'users', uid), {
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

  const getUsers = async (): Promise<User[]> => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as User));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, addUser, getUsers, fetchUserDocument }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
