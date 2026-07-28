import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, type Lang } from '../i18n/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Translate a dot-path key, e.g. t('hero.tagline'). Falls back to English, then the key itself. */
  t: (key: string) => string;
  /**
   * Localize a dynamic DB record field. In Amharic mode returns `obj[field+'Am']`
   * when present, otherwise falls back to the English `obj[field]`.
   * e.g. tf(menuItem, 'name') / tf(menuItem, 'description').
   */
  tf: (obj: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLang = (): Lang => {
  const saved = localStorage.getItem('lang');
  return saved === 'am' ? 'am' : 'en';
};

function lookup(obj: any, path: string): unknown {
  return path.split('.').reduce<any>((acc, k) => (acc && typeof acc === 'object' ? acc[k] : undefined), obj);
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('lang', l);
    setLangState(l);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'en' ? 'am' : 'en');
  }, [lang, setLang]);

  const t = useCallback(
    (key: string): string => {
      const val = lookup(translations[lang], key) ?? lookup(translations.en, key) ?? key;
      return typeof val === 'string' ? val : key;
    },
    [lang]
  );

  const tf = useCallback(
    (obj: any, field: string): string => {
      if (!obj) return '';
      if (lang === 'am') {
        const am = obj[`${field}Am`];
        if (am != null && String(am).trim() !== '') return am;
      }
      return obj[field] ?? '';
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, tf }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider');
  return ctx;
};
