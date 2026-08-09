'use client';

/**
 * AuthPanelContext — tracks which side the decorative promo panel sits on.
 *
 * 'right' (default) → panel covers the right half (sign-up area hidden)
 * 'left'            → panel covers the left half  (sign-in area hidden)
 */

import { createContext, useContext, useState, ReactNode } from 'react';

type PanelSide = 'right' | 'left';

interface AuthPanelContextValue {
  panelSide: PanelSide;
  setPanelSide: (side: PanelSide) => void;
}

const AuthPanelContext = createContext<AuthPanelContextValue>({
  panelSide: 'right',
  setPanelSide: () => {},
});

export function AuthPanelProvider({ children }: { children: ReactNode }) {
  const [panelSide, setPanelSide] = useState<PanelSide>('right');
  return (
    <AuthPanelContext.Provider value={{ panelSide, setPanelSide }}>
      {children}
    </AuthPanelContext.Provider>
  );
}

export function useAuthPanel() {
  return useContext(AuthPanelContext);
}
