import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithCustomToken,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile, UserRole } from '@hiredesk/shared';
import axios from 'axios';
import toast from 'react-hot-toast';
import { mockUser } from '@/lib/mockData';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential | null>;
  register: (email: string, password: string) => Promise<UserCredential | null>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Running in demo mode without Firebase
      // Set demo user
      setCurrentUser({
        uid: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.displayName,
      } as FirebaseUser);
      
      setUserProfile({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.displayName,
        role: mockUser.role,
        company: mockUser.company,
        phone: mockUser.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // TODO: Fetch user profile from backend
        setUserProfile({
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          role: UserRole.CUSTOMER,
          company: '',
          phone: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<UserCredential | null> => {
    if (!auth) {
      throw new Error('Authentication is not available. Please configure Firebase.');
    }
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string): Promise<UserCredential | null> => {
    if (!auth) {
      throw new Error('Authentication is not available. Please configure Firebase.');
    }
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async (): Promise<void> => {
    if (!auth) {
      setCurrentUser(null);
      setUserProfile(null);
      return;
    }
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  };

  const updateProfile = async (profile: Partial<UserProfile>): Promise<void> => {
    // TODO: Update profile in backend
    if (userProfile) {
      setUserProfile({ ...userProfile, ...profile });
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 