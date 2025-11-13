/**
 * Theme Store (Zustand)
 *
 * 테마 상태를 관리하고 localStorage에 저장합니다.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ColorPalette } from '@/lib/constants/colors';
import type { CustomColorSettings } from '@/lib/constants/theme-colors';
import { updatePrimaryColors, toggleDarkMode, isDarkMode, updateCustomColors } from '@/lib/theme/css-vars';

interface ThemeState {
  // State
  palette: ColorPalette;
  mode: 'light' | 'dark';
  customColors: CustomColorSettings;

  // Actions
  setPalette: (palette: ColorPalette) => void;
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
  setCustomColor: (variable: string, useDefault: boolean, customColor?: string) => void;
  resetTheme: () => void;
}

const DEFAULT_PALETTE: ColorPalette = 'violet';
const DEFAULT_CUSTOM_COLORS: CustomColorSettings = {};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state
      palette: DEFAULT_PALETTE,
      mode: 'light',
      customColors: DEFAULT_CUSTOM_COLORS,

      // Set palette
      setPalette: (palette) => {
        const { mode, customColors } = get();
        updatePrimaryColors(palette, mode);
        updateCustomColors(palette, mode, customColors);
        set({ palette });
      },

      // Set mode
      setMode: (mode) => {
        const { palette, customColors } = get();
        toggleDarkMode(mode === 'dark');
        updatePrimaryColors(palette, mode);
        updateCustomColors(palette, mode, customColors);
        set({ mode });
      },

      // Toggle mode
      toggleMode: () => {
        const { mode, palette, customColors } = get();
        const newMode = mode === 'light' ? 'dark' : 'light';
        toggleDarkMode(newMode === 'dark');
        updatePrimaryColors(palette, newMode);
        updateCustomColors(palette, newMode, customColors);
        set({ mode: newMode });
      },

      // Set custom color (현재 모드에만 적용)
      setCustomColor: (variable, useDefault, customColor) => {
        const { customColors, palette, mode } = get();
        const currentSetting = customColors[variable] || {
          light: { useDefault: true },
          dark: { useDefault: true },
        };

        const newCustomColors = {
          ...customColors,
          [variable]: {
            ...currentSetting,
            [mode]: { useDefault, customColor },
          },
        };
        set({ customColors: newCustomColors });
        updateCustomColors(palette, mode, newCustomColors);
      },

      // Reset to default
      resetTheme: () => {
        const mode = isDarkMode() ? 'dark' : 'light';
        updatePrimaryColors(DEFAULT_PALETTE, mode);
        updateCustomColors(DEFAULT_PALETTE, mode, DEFAULT_CUSTOM_COLORS);
        set({ palette: DEFAULT_PALETTE, mode, customColors: DEFAULT_CUSTOM_COLORS });
      },
    }),
    {
      name: 'theme-storage', // localStorage key
      partialize: (state) => ({
        palette: state.palette,
        mode: state.mode,
        customColors: state.customColors,
      }),
    }
  )
);
