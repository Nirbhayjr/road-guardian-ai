import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role?: UserRole) => boolean;
  logout: () => void;
  loginAsAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'citizen@smartroad.ai',
    password: 'demo123',
    user: { id: 'user-1', name: 'Rajesh Kumar', email: 'citizen@smartroad.ai', role: 'citizen' },
  },
  {
    email: 'admin@smartroad.ai',
    password: 'admin123',
    user: { id: 'admin-1', name: 'Admin Officer', email: 'admin@smartroad.ai', role: 'admin' },
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string): boolean => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found.user);
      return true;
    }
    // Allow any login for demo
    setUser({ id: `user-${Date.now()}`, name: email.split('@')[0], email, role: 'citizen' });
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, _password: string, role: UserRole = 'citizen'): boolean => {
    setUser({ id: `user-${Date.now()}`, name, email, role });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const loginAsAdmin = useCallback(() => {
    setUser(DEMO_USERS[1].user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, loginAsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
