/**
 * useTheme Hook
 *
 * 테마 관리를 위한 커스텀 훅
 */

import { useEffect } from 'react';
import { useThemeStore } from '@/shared/stores';
import { updatePrimaryColors } from '@/lib/theme/css-vars';

export function useTheme() {
  const { palette, mode, setPalette, setMode, toggleMode, resetTheme } = useThemeStore();

  // 초기 로드 시 CSS 변수 적용
  useEffect(() => {
    updatePrimaryColors(palette, mode);
  }, [palette, mode]);

  return {
    palette,
    mode,
    setPalette,
    setMode,
    toggleMode,
    resetTheme,
    isDark: mode === 'dark',
  };
}
