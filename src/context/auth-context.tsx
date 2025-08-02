
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import type { User } from '@/lib/users';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; 

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  addUser: (user: User) => Promise<void>;
  getUsers: () => Promise<User[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const seedAdminUser = useCallback(async () => {
    const adminEmail = 'zoran@temporis.hr';
    const adminPassword = 'shaban$$';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        const uid = userCredential.user.uid;

        console.log("Admin user did not exist, creating one...");
        const adminUserRef = ref(db, `users/${uid}`);
        await set(adminUserRef, {
            username: 'zoran',
            name: 'Zoran Admin',
            email: adminEmail,
            role: 'admin',
        });
        console.log("Admin user created successfully.");
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("Admin user already exists in Auth, no action needed.");
        } else {
             console.error("Error during admin user seeding:", error);
        }
    }
  }, []);

  useEffect(() => {
    seedAdminUser();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const isKnownAdmin = firebaseUser.email === 'zoran@temporis.hr';
        const userDoc: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || (isKnownAdmin ? 'Zoran Admin' : 'Korisnik'),
            username: firebaseUser.email || '',
            role: isKnownAdmin ? 'admin' : 'user'
        };
        setUser(userDoc);
      } else {
        setUser(null);
      }
      setLoading(false);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [seedAdminUser]);
  
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
    <AuthContext.Provider value={{ user, loading, isInitialized, login, logout, addUser, getUsers }}>
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
