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

export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount, with sessionStorage fallback for mobile
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Basic validation - check if user data is valid
        if (userData && userData.id && userData.email) {
          setToken(storedToken);
          setUser(userData);
          
          console.log('Auth context initialized:', { 
            hasToken: !!storedToken, 
            hasUser: !!userData,
            userId: userData.id 
          });
          
          // Mobile-friendly cookie setting
          const setCookieForMobile = () => {
            const isSecure = window.location.protocol === 'https:';
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // For mobile, use more permissive cookie settings
            if (isMobile) {
              // Try multiple cookie variations for mobile compatibility
              document.cookie = `token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
              document.cookie = `token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=None; Secure`;
              document.cookie = `token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
            } else {
              // Desktop cookie settings
              document.cookie = `token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
              if (!isSecure) {
                document.cookie = `token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
              }
            }
          };
          
          // Set cookie immediately
          setCookieForMobile();
          
          // Retry for mobile devices
          setTimeout(setCookieForMobile, 100);
          setTimeout(setCookieForMobile, 500);
        } else {
          console.warn('Invalid user data in storage, clearing...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Also store in sessionStorage for mobile fallback
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    
    // Mobile-friendly cookie setting for login
    const setCookieForMobile = () => {
      const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Multiple cookie variations for mobile compatibility
        document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=None; Secure`;
        document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
        console.log('Mobile cookie set:', { isMobile, isSecure });
      } else {
        // Desktop cookie settings
        document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
        if (!isSecure) {
          document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      }
    };
    
    // Set cookie immediately
    setCookieForMobile();
    
    // Retry for mobile devices with longer delays
    setTimeout(setCookieForMobile, 100);
    setTimeout(setCookieForMobile, 500);
    setTimeout(setCookieForMobile, 1000);
    
    // Verify cookie was set
    setTimeout(() => {
      const cookieCheck = document.cookie.includes('token=');
      if (!cookieCheck) {
        console.warn('Cookie not set properly on mobile, retrying...');
        setCookieForMobile();
      } else {
        console.log('Cookie successfully set:', document.cookie.includes('token='));
      }
    }, 1500);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
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

