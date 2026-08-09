'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LangCode, translations } from '@/data/translations';

const DEFAULT_LANG: LangCode = 'uk';

interface LangContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gf-lang') as LangCode | null;
      if (stored && stored in translations) {
        setLangState(stored);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setLang = (code: LangCode) => {
    setLangState(code);
    try {
      localStorage.setItem('gf-lang', code);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    const dict = translations[lang];
    return dict[key] ?? translations[DEFAULT_LANG][key] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}

/** Convenience alias — useT() returns the translator function directly */
export function useT(): (key: string) => string {
  return useLang().t;
}
