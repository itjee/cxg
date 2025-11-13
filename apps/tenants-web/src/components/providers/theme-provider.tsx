"use client";

import * as React from "react";
import { ColorPalette, DEFAULT_PALETTE } from "@/lib/constants/colors";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  palette: DEFAULT_PALETTE.tenant,
  setPalette: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "conexgrow-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [palette, setPalette] = React.useState<ColorPalette>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("conexgrow-palette") as ColorPalette) || DEFAULT_PALETTE.tenant;
    }
    return DEFAULT_PALETTE.tenant;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      const targetTheme = theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

      // Only update if the current theme is different
      const hasLight = root.classList.contains("light");
      const hasDark = root.classList.contains("dark");
      const currentTheme = hasDark ? "dark" : hasLight ? "light" : null;

      if (currentTheme !== targetTheme) {
        root.classList.remove("light", "dark");
        root.classList.add(targetTheme);
      }
    };

    applyTheme();

    // Listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  React.useEffect(() => {
    const root = window.document.documentElement;

    // Remove all palette classes
    Array.from(root.classList).forEach((cls) => {
      if (cls.startsWith("palette-")) {
        root.classList.remove(cls);
      }
    });

    // Add new palette class
    root.classList.add(`palette-${palette}`);
  }, [palette]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    palette,
    setPalette: (palette: ColorPalette) => {
      localStorage.setItem("conexgrow-palette", palette);
      setPalette(palette);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
