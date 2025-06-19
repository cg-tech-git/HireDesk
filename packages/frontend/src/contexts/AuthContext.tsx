import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@hiredesk/shared';

interface AuthContextType {
  userProfile: {
    role: UserRole;
    name: string;
    email: string;
  } | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile] = useState({
    role: UserRole.CUSTOMER,
    name: 'Demo User',
    email: 'demo@example.com',
  });

  const logout = async () => {
    // In demo mode, logout doesn't do anything
    console.log('Logout called in demo mode');
  };

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 