'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LangProvider } from '@/context/LangContext';

/**
 * PageShell wraps every page with ThemeProvider, LangProvider, CartProvider, and AuthProvider
 * so Header, ProductGrid, ProductDetail, CartPage, and auth areas all share the
 * same state tree. Renders no extra DOM element — just the providers.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
