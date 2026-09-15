import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "../locales/translations";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey | string, params?: Record<string, string | number>) => string;
}

const STORAGE_KEY = "shms-language";

const defaultLanguageContext: LanguageContextType = {
  language: "vi",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: TranslationKey | string, params?: Record<string, string | number>) => {
    const fallbackDict = translations.vi as Record<string, string>;
    let text = fallbackDict[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, val]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(val));
      });
    }
    return text;
  },
};

export const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "vi" || saved === "en") {
        return saved;
      }
    }
    return "vi";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Bo qua loi tren moi truong test khong co localStorage
    }
  };

  const toggleLanguage = () => {
    const next = language === "vi" ? "en" : "vi";
    setLanguage(next);
  };

  const t = (key: TranslationKey | string, params?: Record<string, string | number>): string => {
    const currentDict = translations[language] as Record<string, string>;
    const fallbackDict = translations.vi as Record<string, string>;

    let text = currentDict[key] || fallbackDict[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, val]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(val));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context || defaultLanguageContext;
}
