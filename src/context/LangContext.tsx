'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { LangCode, translations } from '@/data/translations';

const DEFAULT_LANG: LangCode = 'uk';

interface LangContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
  countryName: (countryCode: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);

  // Завантажуємо збережену мову
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gf-lang') as LangCode | null;

      if (stored && stored in translations) {
        setLangState(stored);
      }
    } catch {
      // localStorage недоступний
    }
  }, []);

  // Зміна мови
  const setLang = (code: LangCode) => {
    setLangState(code);

    try {
      localStorage.setItem('gf-lang', code);
    } catch {
      // ignore
    }
  };

  // Основний перекладач
  const t = (key: string): string => {
    const dict = translations[lang];

    return (
      dict[key] ??
      translations[DEFAULT_LANG][key] ??
      key
    );
  };

  // Переклад назв країн
  const countryName = (countryCode: string): string => {
    try {
      const displayNames = new Intl.DisplayNames([lang], {
        type: 'region',
      });

      return displayNames.of(countryCode) || countryCode;
    } catch {
      try {
        const displayNames = new Intl.DisplayNames(['en'], {
          type: 'region',
        });

        return displayNames.of(countryCode) || countryCode;
      } catch {
        return countryCode;
      }
    }
  };

  return (
    <LangContext.Provider
      value={{
        lang,
        setLang,
        t,
        countryName,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);

  if (!ctx) {
    throw new Error(
      'useLang must be used inside LangProvider'
    );
  }

  return ctx;
}

/**
 * Зручний перекладач
 */
export function useT(): (key: string) => string {
  return useLang().t;
}

/**
 * Зручний переклад країни
 *
 * Приклад:
 * countryName('BE')
 *
 * uk → Бельгія
 * en → Belgium
 * fr → Belgique
 * nl → België
 * de → Belgien
 * tr → Belçika
 */
export function useCountryName(): (
  countryCode: string
) => string {
  return useLang().countryName;
}