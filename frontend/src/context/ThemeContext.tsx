import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "shms-theme";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const applyTheme = () => {
      let resolved: "light" | "dark";
      if (theme === "system") {
        resolved = mediaQuery?.matches ? "dark" : "light";
      } else {
        resolved = theme;
      }
      setResolvedTheme(resolved);
      root.setAttribute("data-theme", resolved);
      root.style.colorScheme = resolved;
    };

    applyTheme();

    if (!mediaQuery) return;

    const handleChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      window.localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Bo qua loi tren moi truong test khong co localStorage
    }
  };

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme phai duoc dung ben trong ThemeProvider");
  }
  return context;
}
