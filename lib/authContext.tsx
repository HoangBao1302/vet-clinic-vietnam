"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isPaid?: boolean;
  affiliateStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  affiliateCode?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Ensure token is also in cookies with proper settings - IMMEDIATELY
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
      
      // Also try to set cookie without secure flag for HTTP
      if (!isSecure) {
        document.cookie = `token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Also save to cookies for middleware with proper settings - IMMEDIATELY
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
    
    // Also try to set cookie without secure flag for HTTP compatibility
    if (!isSecure) {
      document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
    
    // Force a small delay to ensure cookie is set before any redirects
    setTimeout(() => {
      // This ensures cookie is definitely set
      const cookieCheck = document.cookie.includes('token=');
      if (!cookieCheck) {
        console.warn('Cookie not set properly, retrying...');
        document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
    }, 100);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookies completely
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
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

