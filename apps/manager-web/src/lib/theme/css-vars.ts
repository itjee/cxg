/**
 * CSS Variables Management
 *
 * CSS 변수를 동적으로 업데이트하여 테마를 변경합니다.
 */

import { COLOR_PALETTES, type ColorPalette } from '@/lib/constants/colors';
import type { CustomColorSettings } from '@/lib/constants/theme-colors';

/**
 * CSS 변수 업데이트 (Primary 색상)
 */
export function updatePrimaryColors(palette: ColorPalette, mode: 'light' | 'dark' = 'light') {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const colors = COLOR_PALETTES[palette];

  // Batch 업데이트를 위해 requestAnimationFrame 사용
  requestAnimationFrame(() => {
    // 모든 shade 업데이트
    Object.entries(colors).forEach(([shade, value]) => {
      root.style.setProperty(`--${palette}-${shade}`, value);
    });

    // Primary 색상 설정 (라이트: 600, 다크: 500)
    const primaryShade = mode === 'light' ? '600' : '500';
    root.style.setProperty('--primary', colors[primaryShade as '600' | '500']);

    // Ring 색상도 primary와 동일하게
    root.style.setProperty('--ring', colors[primaryShade as '600' | '500']);

    // Chart 색상 업데이트
    root.style.setProperty('--chart-1', colors['600']);
    root.style.setProperty('--chart-2', colors['500']);
    root.style.setProperty('--chart-3', colors['700']);
    root.style.setProperty('--chart-4', colors['400']);
    root.style.setProperty('--chart-5', colors['300']);

    // Sidebar 색상 - 테마 색상을 배경과 액센트에 미묘하게 적용
    if (mode === 'dark') {
      // 다크 모드: 어두운 배경에 테마 색상 액센트
      root.style.setProperty('--sidebar', `color-mix(in oklch, ${colors['950']} 90%, oklch(0% 0 0))`);
      root.style.setProperty('--sidebar-foreground', 'oklch(95% 0 0)');
      root.style.setProperty('--sidebar-primary', colors['500']);
      root.style.setProperty('--sidebar-primary-foreground', colors['950']);
      root.style.setProperty('--sidebar-accent', `color-mix(in oklch, ${colors['900']} 40%, oklch(15% 0 0))`);
      root.style.setProperty('--sidebar-accent-foreground', colors['300']);
      root.style.setProperty('--sidebar-border', `color-mix(in oklch, ${colors['800']} 30%, oklch(20% 0 0))`);
      root.style.setProperty('--sidebar-ring', colors['500']);
    } else {
      // 라이트 모드: 밝은 배경에 테마 색상 액센트
      root.style.setProperty('--sidebar', `color-mix(in oklch, ${colors['50']} 50%, oklch(99% 0 0))`);
      root.style.setProperty('--sidebar-foreground', 'oklch(20% 0 0)');
      root.style.setProperty('--sidebar-primary', colors['600']);
      root.style.setProperty('--sidebar-primary-foreground', 'oklch(100% 0 0)');
      root.style.setProperty('--sidebar-accent', `color-mix(in oklch, ${colors['100']} 70%, oklch(98% 0 0))`);
      root.style.setProperty('--sidebar-accent-foreground', colors['700']);
      root.style.setProperty('--sidebar-border', `color-mix(in oklch, ${colors['200']} 40%, oklch(93% 0 0))`);
      root.style.setProperty('--sidebar-ring', colors['600']);
    }

    // Accent 색상 - 호버 및 선택 상태에 사용
    if (mode === 'dark') {
      root.style.setProperty('--accent', `color-mix(in oklch, ${colors['900']} 40%, oklch(15% 0 0))`);
      root.style.setProperty('--accent-foreground', colors['200']);
    } else {
      root.style.setProperty('--accent', `color-mix(in oklch, ${colors['100']} 70%, oklch(98% 0 0))`);
      root.style.setProperty('--accent-foreground', colors['800']);
    }

    // Border 색상에도 테마 색상 미묘하게 적용
    if (mode === 'dark') {
      root.style.setProperty('--border', `color-mix(in oklch, ${colors['800']} 20%, oklch(25% 0 0))`);
    } else {
      root.style.setProperty('--border', `color-mix(in oklch, ${colors['300']} 30%, oklch(90% 0 0))`);
    }

    // Background 색상 - 메인 콘텐츠 영역 배경
    if (mode === 'dark') {
      // 다크 모드: 약간의 테마 색조를 가진 어두운 배경
      root.style.setProperty('--background', `color-mix(in oklch, ${colors['950']} 30%, oklch(8% 0 0))`);
      root.style.setProperty('--foreground', 'oklch(98% 0 0)');
    } else {
      // 라이트 모드: 약간의 테마 색조를 가진 밝은 배경
      root.style.setProperty('--background', `color-mix(in oklch, ${colors['50']} 20%, oklch(100% 0 0))`);
      root.style.setProperty('--foreground', 'oklch(10% 0 0)');
    }

    // Header 색상 - 상단 헤더 영역
    if (mode === 'dark') {
      // 다크 모드: 사이드바와 유사한 스타일
      root.style.setProperty('--header', `color-mix(in oklch, ${colors['950']} 90%, oklch(0% 0 0))`);
      root.style.setProperty('--header-foreground', 'oklch(95% 0 0)');
    } else {
      // 라이트 모드: 밝은 배경에 테마 색상 액센트
      root.style.setProperty('--header', `color-mix(in oklch, ${colors['50']} 50%, oklch(99% 0 0))`);
      root.style.setProperty('--header-foreground', 'oklch(20% 0 0)');
    }

    // Muted 색상 - 보조 배경 및 비활성 텍스트
    if (mode === 'dark') {
      root.style.setProperty('--muted', `color-mix(in oklch, ${colors['900']} 30%, oklch(15% 0 0))`);
      root.style.setProperty('--muted-foreground', 'oklch(70% 0 0)');
    } else {
      root.style.setProperty('--muted', `color-mix(in oklch, ${colors['100']} 40%, oklch(96% 0 0))`);
      root.style.setProperty('--muted-foreground', 'oklch(45% 0 0)');
    }

    // Card 색상 - 카드 컴포넌트 배경
    if (mode === 'dark') {
      root.style.setProperty('--card', `color-mix(in oklch, ${colors['950']} 40%, oklch(12% 0 0))`);
      root.style.setProperty('--card-foreground', 'oklch(98% 0 0)');
    } else {
      root.style.setProperty('--card', `color-mix(in oklch, ${colors['50']} 30%, oklch(100% 0 0))`);
      root.style.setProperty('--card-foreground', 'oklch(10% 0 0)');
    }

    // Popover 색상
    if (mode === 'dark') {
      root.style.setProperty('--popover', `color-mix(in oklch, ${colors['950']} 50%, oklch(10% 0 0))`);
      root.style.setProperty('--popover-foreground', 'oklch(98% 0 0)');
    } else {
      root.style.setProperty('--popover', `color-mix(in oklch, ${colors['50']} 30%, oklch(100% 0 0))`);
      root.style.setProperty('--popover-foreground', 'oklch(10% 0 0)');
    }
  });
}

/**
 * 다크 모드 토글
 */
export function toggleDarkMode(enabled: boolean) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  if (enabled) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * 현재 다크 모드 상태 확인
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/**
 * 시스템 다크 모드 선호도 확인
 */
export function getSystemDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 테마 초기화 (기본 팔레트로 복원)
 */
export function resetTheme(defaultPalette: ColorPalette = 'violet') {
  const mode = isDarkMode() ? 'dark' : 'light';
  updatePrimaryColors(defaultPalette, mode);
}

/**
 * 커스텀 색상 적용 (모드별 관리)
 */
export function updateCustomColors(
  palette: ColorPalette,
  mode: 'light' | 'dark',
  customSettings: CustomColorSettings
) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const colors = COLOR_PALETTES[palette];

  requestAnimationFrame(() => {
    // 각 색상 변수에 대해 현재 모드의 커스텀 설정 적용
    Object.entries(customSettings).forEach(([variable, modeSetting]) => {
      const currentModeSetting = modeSetting[mode]; // 현재 모드의 설정 가져오기

      if (!currentModeSetting.useDefault && currentModeSetting.customColor) {
        // 커스텀 색상 사용
        root.style.setProperty(`--${variable}`, currentModeSetting.customColor);
      }
      // useDefault가 true이면 아무것도 하지 않음 (이미 updatePrimaryColors에서 설정됨)
    });
  });
}
