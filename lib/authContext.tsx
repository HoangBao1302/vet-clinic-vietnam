"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isPaid?: boolean;
  membershipTier?: 'free' | 'paid';
  affiliateStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  affiliateCode?: string;
  totalCommissionEarned?: number;
  totalCommissionPaid?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

function persistUser(user: User | null) {
  if (!user) {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    return;
  }
  localStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('user', JSON.stringify(user));
}

function persistToken(token: string | null) {
  if (!token) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    return;
  }
  localStorage.setItem('token', token);
  sessionStorage.setItem('token', token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.id && userData.email) {
          setUser(userData);
        } else {
          persistUser(null);
        }
      } catch {
        persistUser(null);
      }
    }

    void restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: HeadersInit = {};
      if (storedToken) headers.Authorization = `Bearer ${storedToken}`;

      const response = await fetch('/api/auth/validate', { headers });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          persistUser(data.user);
          setIsLoading(false);
          return;
        }
      }

      setToken(null);
      setUser(null);
      persistToken(null);
      persistUser(null);
    } catch (error) {
      console.error('Error validating session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    persistToken(newToken);
    persistUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    persistToken(null);
    persistUser(null);
    void fetch('/api/auth/logout', { method: 'POST' });
  };

  const refreshUser = async () => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch('/api/user/refresh', {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          persistUser(data.user);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
