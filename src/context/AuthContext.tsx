'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

import { createClient } from '@/lib/supabase/client';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'moderator'
  | 'support'
  | 'premium_user'
  | 'regular_user';

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
  | {
      type: 'SET_LOADING';
      loading: boolean;
    }
  | {
      type: 'SIGN_IN';
      user: User;
    }
  | {
      type: 'SIGN_OUT';
    }
  | {
      type: 'UPDATE_USER';
      user: Partial<User>;
    }
  | {
      type: 'HYDRATE';
      user: User | null;
    };

function authReducer(
  state: AuthState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.loading,
      };

    case 'SIGN_IN':
      return {
        user: action.user,
        isLoading: false,
        isAuthenticated: true,
      };

    case 'SIGN_OUT':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              ...action.user,
            }
          : null,
      };

    case 'HYDRATE':
      return {
        user: action.user,
        isLoading: false,
        isAuthenticated: action.user !== null,
      };

    default:
      return state;
  }
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  signIn: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<{
    ok: boolean;
    error?: string;
  }>;

  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    ok: boolean;
    error?: string;
  }>;

  signInWithGoogle: (
    profile?: unknown
  ) => Promise<{
    ok: boolean;
    error?: string;
  }>;

  signOut: () => void;

  updateUser: (
    data: Partial<User>
  ) => void;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

const supabase = createClient();

/**
 * Convert Supabase Auth User into our application's User format.
 */
function mapSupabaseUser(supabaseUser: any): User {
const metadata = supabaseUser.user_metadata ?? {};
const appMetadata = supabaseUser.app_metadata ?? {};

const roleFromMetadata = appMetadata.role as UserRole | undefined;
  appMetadata.role as UserRole | undefined; 

  const allowedRoles: UserRole[] = [
    'super_admin',
    'admin',
    'moderator',
    'support',
    'premium_user',
    'regular_user',
  ];

  const role: UserRole =
    roleFromMetadata &&
    allowedRoles.includes(roleFromMetadata)
      ? roleFromMetadata
      : 'regular_user';

  return {
    id: supabaseUser.id,

    email: supabaseUser.email ?? '',

    name:
      metadata.name ||
      metadata.full_name ||
      metadata.fullName ||
      supabaseUser.email?.split('@')[0] ||
      'User',

    avatarUrl:
      metadata.avatar_url ||
      metadata.picture ||
      undefined,

    role,

    emailVerified:
      !!supabaseUser.email_confirmed_at,

    createdAt:
      supabaseUser.created_at ||
      new Date().toISOString(),

    lastLoginAt:
      supabaseUser.last_sign_in_at ||
      new Date().toISOString(),
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    authReducer,
    {
      user: null,
      isLoading: true,
      isAuthenticated: false,
    }
  );

  /**
   * Load current Supabase session when the app starts.
   */
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (error || !user) {
          dispatch({
            type: 'HYDRATE',
            user: null,
          });

          return;
        }

        const appUser = mapSupabaseUser(user);

        dispatch({
          type: 'HYDRATE',
          user: appUser,
        });
      } catch (error) {
        console.error(
          'Failed to load Supabase user:',
          error
        );

        if (mounted) {
          dispatch({
            type: 'HYDRATE',
            user: null,
          });
        }
      }
    }

    loadUser();

    /**
     * Listen for authentication changes.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          const appUser = mapSupabaseUser(
            session.user
          );

          dispatch({
            type: 'SIGN_IN',
            user: appUser,
          });
        } else {
          dispatch({
            type: 'SIGN_OUT',
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with email + password.
   */
  const signIn = useCallback(
    async (
      email: string,
      password: string,
      _remember = false
    ): Promise<{
      ok: boolean;
      error?: string;
    }> => {
      dispatch({
        type: 'SET_LOADING',
        loading: true,
      });

      try {
        const {
          data,
          error,
        } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: false,
            error: getAuthErrorMessage(error.message),
          };
        }

        if (!data.user) {
          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: false,
            error: 'Не вдалося отримати дані користувача.',
          };
        }

        const user = mapSupabaseUser(data.user);

        dispatch({
          type: 'SIGN_IN',
          user,
        });

        return {
          ok: true,
        };
      } catch (error) {
        console.error('Sign in error:', error);

        dispatch({
          type: 'SET_LOADING',
          loading: false,
        });

        return {
          ok: false,
          error: 'Сталася помилка під час входу.',
        };
      }
    },
    []
  );

  /**
   * Register a new account.
   */
  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{
      ok: boolean;
      error?: string;
    }> => {
      dispatch({
        type: 'SET_LOADING',
        loading: true,
      });

      try {
        const cleanName = name.trim();
        const cleanEmail =
          email.trim().toLowerCase();

        if (!cleanName) {
          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: false,
            error: 'Введіть повне імʼя.',
          };
        }

        if (!cleanEmail) {
          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: false,
            error: 'Введіть email.',
          };
        }

        if (password.length < 6) {
          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: false,
            error:
              'Пароль повинен містити щонайменше 6 символів.',
          };
        }

        /**
         * IMPORTANT:
         * This URL is where Supabase sends the user
         * after clicking the verification email.
         */
        const redirectUrl =
          `${window.location.origin}/auth/callback`;

        const {
          data,
          error,
        } = await supabase.auth.signUp({
          email: cleanEmail,
          password,

          options: {
            emailRedirectTo: redirectUrl,

            data: {
              name: cleanName,
              full_name: cleanName,
              role: 'regular_user',
            },
          },
        });

        if (error) {
          console.error(
            'Supabase sign up error:',
            error
          );

          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: false,
            error: getAuthErrorMessage(error.message),
          };
        }

        /**
         * If email confirmation is enabled,
         * Supabase normally returns a user but no session.
         */
        if (data.user && !data.session) {
          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: true,
          };
        }

        /**
         * If email confirmation is disabled,
         * Supabase can immediately create a session.
         */
        if (data.user && data.session) {
          const user = mapSupabaseUser(data.user);

          dispatch({
            type: 'SIGN_IN',
            user,
          });

          return {
            ok: true,
          };
        }

        dispatch({
          type: 'SET_LOADING',
          loading: false,
        });

        return {
          ok: true,
        };
      } catch (error) {
        console.error(
          'Registration error:',
          error
        );

        dispatch({
          type: 'SET_LOADING',
          loading: false,
        });

        return {
          ok: false,
          error:
            'Не вдалося створити акаунт. Спробуйте ще раз.',
        };
      }
    },
    []
  );

  /**
   * Google OAuth.
   *
   * The optional profile parameter is kept so existing
   * components that call signInWithGoogle(profile)
   * do not immediately break.
   *
   * The actual authentication is performed by Supabase,
   * not by trusting a client-side Google profile.
   */
  const signInWithGoogle = useCallback(
    async (
      _profile?: unknown
    ): Promise<{
      ok: boolean;
      error?: string;
    }> => {
      try {
        dispatch({
          type: 'SET_LOADING',
          loading: true,
        });

        const redirectTo =
          `${window.location.origin}/auth/callback`;

        const {
          error,
        } = await supabase.auth.signInWithOAuth({
          provider: 'google',

          options: {
            redirectTo,
          },
        });

        if (error) {
          console.error(
            'Google OAuth error:',
            error
          );

          dispatch({
            type: 'SET_LOADING',
            loading: false,
          });

          return {
            ok: false,
            error: getAuthErrorMessage(error.message),
          };
        }

        /**
         * Browser will be redirected to Google.
         */
        return {
          ok: true,
        };
      } catch (error) {
        console.error(
          'Google sign in error:',
          error
        );

        dispatch({
          type: 'SET_LOADING',
          loading: false,
        });

        return {
          ok: false,
          error:
            'Не вдалося увійти через Google.',
        };
      }
    },
    []
  );

  /**
   * Sign out.
   */
  const signOut = useCallback(() => {
    void (async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error(
          'Sign out error:',
          error
        );
      }

      dispatch({
        type: 'SIGN_OUT',
      });
    })();
  }, []);

  /**
   * Update local user state + Supabase metadata.
   */
  const updateUser = useCallback(
    (data: Partial<User>) => {
      dispatch({
        type: 'UPDATE_USER',
        user: data,
      });

      void (async () => {
        try {
          const metadata: Record<string, unknown> = {};

          if (data.name !== undefined) {
            metadata.name = data.name;
            metadata.full_name = data.name;
          }

          if (data.avatarUrl !== undefined) {
            metadata.avatar_url = data.avatarUrl;
          }

          if (Object.keys(metadata).length === 0) {
            return;
          }

          await supabase.auth.updateUser({
            data: metadata,
          });
        } catch (error) {
          console.error(
            'Update user error:',
            error
          );
        }
      })();
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}

/**
 * Convert Supabase errors into user-friendly messages.
 */
function getAuthErrorMessage(
  message: string
): string {
  const normalized = message.toLowerCase();

  if (
    normalized.includes('invalid login credentials')
  ) {
    return 'Неправильний email або пароль.';
  }

  if (
    normalized.includes('email not confirmed')
  ) {
    return 'Спочатку підтвердіть свою електронну пошту.';
  }

  if (
    normalized.includes('user already registered')
  ) {
    return 'Користувач з таким email вже зареєстрований.';
  }

  if (
    normalized.includes('password should be at least')
  ) {
    return 'Пароль занадто короткий.';
  }

  if (
    normalized.includes('rate limit')
  ) {
    return 'Забагато спроб. Спробуйте трохи пізніше.';
  }

  if (
    normalized.includes('email rate limit')
  ) {
    return 'Забагато листів. Спробуйте пізніше.';
  }

  if (
    normalized.includes('invalid email')
  ) {
    return 'Введіть правильний email.';
  }

  if (
    normalized.includes('weak password')
  ) {
    return 'Пароль занадто слабкий.';
  }

  return message || 'Сталася помилка авторизації.';
}