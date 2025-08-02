
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, deleteUser as deleteFirebaseUser } from 'firebase/auth';
import { ref, get, set, remove, update } from 'firebase/database';
import type { User } from '@/lib/users';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; 

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  addUser: (user: User) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUsers: () => Promise<User[]>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // We add this state to the provider to allow mutations from components
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef).catch(() => null);

        const userDoc: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: snapshot?.val()?.name || (firebaseUser.email === 'zoran@temporis.hr' ? 'Zoran Admin' : 'Korisnik'),
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
  }, []);
  
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

  const updateUser = async (updatedUser: User) => {
    try {
        const userRef = ref(db, `users/${updatedUser.id}`);
        await update(userRef, {
            name: updatedUser.name,
            username: updatedUser.username,
            role: updatedUser.role,
            email: updatedUser.email
        });
        
        // Note: Updating email and password in Firebase Auth is a sensitive operation
        // and requires re-authentication. For this CRM, we'll focus on DB properties.
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
  };

  const deleteUser = async (userId: string) => {
      try {
        // This is a placeholder. Deleting a user from Auth requires admin privileges
        // and is typically done from a backend server, not the client.
        // We will only remove the user from the Realtime Database.
        const userRef = ref(db, `users/${userId}`);
        await remove(userRef);
        console.log(`User ${userId} deleted from Realtime Database.`);
        // In a real app, you would also call a cloud function to delete the user from Firebase Auth.
        // For example: await deleteFirebaseUser(user);
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
  };

  const getUsers = useCallback(async (): Promise<User[]> => {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        const userList = Object.keys(data).map(key => ({ id: key, ...data[key] } as User));
        setUsers(userList);
        return userList;
    }
    setUsers([]);
    return [];
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, addUser, getUsers, users, setUsers, updateUser, deleteUser }}>
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
