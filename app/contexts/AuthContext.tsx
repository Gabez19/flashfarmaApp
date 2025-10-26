import React, { createContext, useContext, useState } from 'react';
import { UserBase } from '../../types';

interface AuthContextData {
  user?: UserBase | null;
  login: (role: string, credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserBase | null>(null);

  const login = async (role: string, credentials: any) => {
    // como está com dados fixos, faça lookup no data.json
    // Exemplo simples:
    if (role === 'cliente') {
      setUser({ id: 'cli1', name: 'Ana Silva', role: 'cliente' });
    } else if (role === 'entregador') {
      setUser({ id: 'ent1', name: 'Carlos', role: 'entregador' });
    } else {
      setUser({ id: 'adm1', name: 'Admin Farma', role: 'adm' });
    }
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
