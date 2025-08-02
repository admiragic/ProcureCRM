
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';
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
          const userRef = ref(db, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
              return { id: snapshot.key, ...snapshot.val() } as User;
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

  const seedAdminUser = useCallback(async () => {
    const adminEmail = 'zoran@temporis.hr';
    const usersRef = ref(db, 'users');
    const q = query(usersRef, orderByChild('email'), equalTo(adminEmail));
    
    const querySnapshot = await get(q);

    if (!querySnapshot.exists()) {
        console.log("Admin user not found, creating one...");
        try {
            const adminPassword = 'shaban$$'; // Use a secure, generated password in a real app
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
            const uid = userCredential.user.uid;
            
            const adminUserRef = ref(db, `users/${uid}`);
            await set(adminUserRef, {
                username: 'zoran',
                name: 'Zoran Admin',
                email: adminEmail,
                role: 'admin',
            });
            console.log("Admin user created successfully.");
        } catch (error: any) {
            // It's possible the user exists in Auth but not in Firestore, or password is not strong enough
            if (error.code !== 'auth/email-already-in-use') {
                 console.error("Error creating admin user:", error);
            } else {
                console.log("Admin user already exists in Auth.");
            }
        }
    } else {
        console.log("Admin user already exists.");
    }
  }, []);

  useEffect(() => {
    seedAdminUser();

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
  }, [fetchUserDocument, seedAdminUser]);
  
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
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

  const getUsers = async (): Promise<User[]> => {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] } as User));
    }
    return [];
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
