import React, { createContext, useContext, useState } from 'react';
import { User } from '../types/api';
import { authService } from '../services/auth.service';

// Restore the persisted session synchronously so that route guards (e.g.
// AdminLayout) see the correct auth state on the very first render. Doing this
// in a useEffect caused a hard refresh of any /admin page to briefly report
// "not authenticated" and bounce logged-in users to the login screen.
const getInitialUser = (): User | null => {
  const token = localStorage.getItem('accessToken');
  const savedUser = localStorage.getItem('user');
  if (token && savedUser) {
    try {
      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }
  return null;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);

  const login = (token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
