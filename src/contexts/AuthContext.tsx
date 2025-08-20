'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Pega do sessionStorage quando o componente monta
    const stored = sessionStorage.getItem('name');

    const sessionCookies = async () => {
      // Apaga o sessionStorage caso o cookie acabe
      const cookies = document.cookie;
      if(!cookies.includes('session=')) {
        logout()
      }
    };
    sessionCookies();

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('name');
      }
    }
  }, []);

  const login = (user: User) => {
    sessionStorage.setItem('name', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    sessionStorage.removeItem('name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
