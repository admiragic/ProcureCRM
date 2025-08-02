
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import type { User } from '@/lib/users';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  addUser: (user: User) => Promise<void>;
  getUsers: () => Promise<User[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserDocument = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    if(userCredential.user) {
        const userData = await fetchUserDocument(userCredential.user);
        setUser(userData);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.href = '/login';
  };

  const addUser = async (newUser: User) => {
    if (!newUser.password) throw new Error("Password is required for new user");
    const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, 'users', uid), {
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  };

  const getUsers = async (): Promise<User[]> => {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, addUser, getUsers }}>
      {!loading && children}
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
