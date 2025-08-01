
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { users, User } from '@/lib/users';

type AuthContextType = {
  user: User | null;
  login: (username: string, pass: string) => void;
  logout: () => void;
  addUser: (user: User) => void;
  getUsers: () => User[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>(users);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = (username: string, pass: string) => {
    const foundUser = userList.find(u => u.username === username && u.password === pass);
    if (foundUser) {
      const userToStore = { id: foundUser.id, username: foundUser.username, role: foundUser.role, name: foundUser.name, email: foundUser.email };
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const addUser = (newUser: User) => {
    setUserList(prevUsers => [...prevUsers, { ...newUser, id: `USR-00${prevUsers.length + 1}` }]);
  };

  const getUsers = () => {
    return userList;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, addUser, getUsers }}>
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
