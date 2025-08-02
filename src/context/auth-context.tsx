
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
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  addUser: (user: User) => Promise<void>;
  getUsers: () => Promise<User[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef).catch(() => null); // Catch potential permission errors

        const userDoc: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: snapshot?.val()?.name || firebaseUser.displayName || (firebaseUser.email === 'zoran@temporis.hr' ? 'Zoran Admin' : 'Korisnik'),
            username: snapshot?.val()?.username || firebaseUser.email || '',
            role: firebaseUser.email === 'zoran@temporis.hr' ? 'admin' : 'user',
        };
        setUser(userDoc);
      } else {
        setUser(null);
      }
      setLoading(false);
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
    <AuthContext.Provider value={{ user, loading, login, logout, addUser, getUsers }}>
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
