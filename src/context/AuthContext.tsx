'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import type { GoogleProfile } from '@/hooks/useGoogleAuth';

export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'support' | 'premium_user' | 'regular_user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SIGN_IN'; user: User }
  | { type: 'SIGN_OUT' }
  | { type: 'UPDATE_USER'; user: Partial<User> }
  | { type: 'HYDRATE'; user: User | null };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'SIGN_IN':
      return { user: action.user, isLoading: false, isAuthenticated: true };
    case 'SIGN_OUT':
      return { user: null, isLoading: false, isAuthenticated: false };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.user } : null,
      };
    case 'HYDRATE':
      return { user: action.user, isLoading: false, isAuthenticated: action.user !== null };
    default:
      return state;
  }
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ ok: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signInWithGoogle: (profile: GoogleProfile) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'gymfriends_auth';

const DEMO_USERS: Record<string, User & { password: string }> = {
  'admin@gymfriends.ua': {
    id: 'u-admin-1',
    email: 'admin@gymfriends.ua',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'super_admin',
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  'user@gymfriends.ua': {
    id: 'u-user-1',
    email: 'user@gymfriends.ua',
    password: 'User123!',
    name: 'Regular User',
    role: 'regular_user',
    emailVerified: true,
    createdAt: '2024-06-15T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  'pozhogaandriy@gmail.com': {
    id: 'u-admin-2',
    email: 'pozhogaandriy@gmail.com',
    password: 'Admin123!',
    name: 'Andriy Pozhoga',
    role: 'admin',
    emailVerified: true,
    createdAt: '2024-03-15T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const user = JSON.parse(raw) as User;
        dispatch({ type: 'HYDRATE', user });
      } else {
        dispatch({ type: 'HYDRATE', user: null });
      }
    } catch {
      dispatch({ type: 'HYDRATE', user: null });
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string, remember = false): Promise<{ ok: boolean; error?: string }> => {
    dispatch({ type: 'SET_LOADING', loading: true });
    await new Promise((r) => setTimeout(r, 800));

    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser && demoUser.password === password) {
      const { password: _pw, ...user } = demoUser;
      const updated = { ...user, lastLoginAt: new Date().toISOString() };
      dispatch({ type: 'SIGN_IN', user: updated });
      if (remember) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      } else {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      }
      return { ok: true };
    }

    // Allow any email/password for demo purposes (new accounts)
    if (email && password.length >= 6) {
      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'regular_user',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      dispatch({ type: 'SIGN_IN', user: newUser });
      if (remember) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser)); } catch { /* ignore */ }
      }
      return { ok: true };
    }

    dispatch({ type: 'SET_LOADING', loading: false });
    return { ok: false, error: 'Невірний email або пароль.' };
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    dispatch({ type: 'SET_LOADING', loading: true });
    await new Promise((r) => setTimeout(r, 1000));

    if (!name || !email || password.length < 6) {
      dispatch({ type: 'SET_LOADING', loading: false });
      return { ok: false, error: 'Будь ласка, заповніть всі поля.' };
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      email,
      name,
      role: 'regular_user',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    dispatch({ type: 'SIGN_IN', user: newUser });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser)); } catch { /* ignore */ }
    return { ok: true };
  }, []);

  /**
   * signInWithGoogle — creates a local session from a real Google profile.
   * The profile comes from Google's GIS popup (ID token decoded client-side).
   * No server-side token verification is performed; this is frontend-only auth.
   */
  const signInWithGoogle = useCallback(async (profile: GoogleProfile): Promise<{ ok: boolean; error?: string }> => {
    dispatch({ type: 'SET_LOADING', loading: true });
    // Brief artificial delay so the loading spinner is visible
    await new Promise((r) => setTimeout(r, 600));

    // Check if this Google account matches a known demo user
    const demoUser = DEMO_USERS[profile.email.toLowerCase()];
    const user: User = demoUser
      ? { ...demoUser, lastLoginAt: new Date().toISOString(), avatarUrl: profile.picture ?? demoUser.avatarUrl }
      : {
          id: `google-${profile.sub}`,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.picture,
          role: 'regular_user',
          emailVerified: profile.email_verified ?? true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

    // Strip password if it came from demoUser spread
    const { password: _pw, ...safeUser } = user as User & { password?: string };
    void _pw;

    dispatch({ type: 'SIGN_IN', user: safeUser });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser)); } catch { /* ignore */ }
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' });
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', user: data });
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const user = JSON.parse(raw) as User;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...user, ...data }));
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signInWithGoogle, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
