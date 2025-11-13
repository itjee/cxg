/**
 * Theme Color Variables
 *
 * CSS 변수로 사용되는 테마 색상 항목들
 */

export type ThemeColorVariable =
  | 'background'
  | 'foreground'
  | 'header'
  | 'header-foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'border'
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border';

export interface ThemeColorInfo {
  variable: ThemeColorVariable;
  label: string;
  description: string;
  category: 'background' | 'content' | 'interaction' | 'sidebar';
}

/**
 * 테마 색상 변수 정보
 */
export const THEME_COLOR_VARIABLES: ThemeColorInfo[] = [
  // Background Category
  {
    variable: 'background',
    label: '메인 배경',
    description: '전체 페이지의 기본 배경색',
    category: 'background',
  },
  {
    variable: 'foreground',
    label: '메인 텍스트',
    description: '기본 텍스트 색상',
    category: 'background',
  },
  {
    variable: 'header',
    label: '헤더 배경',
    description: '상단 헤더 배경색',
    category: 'background',
  },
  {
    variable: 'header-foreground',
    label: '헤더 텍스트',
    description: '헤더 내 텍스트 색상',
    category: 'background',
  },

  // Content Category
  {
    variable: 'card',
    label: '카드 배경',
    description: '카드 컴포넌트 배경색',
    category: 'content',
  },
  {
    variable: 'card-foreground',
    label: '카드 텍스트',
    description: '카드 내 텍스트 색상',
    category: 'content',
  },
  {
    variable: 'popover',
    label: '팝오버 배경',
    description: '드롭다운, 팝오버 배경색',
    category: 'content',
  },
  {
    variable: 'popover-foreground',
    label: '팝오버 텍스트',
    description: '팝오버 내 텍스트 색상',
    category: 'content',
  },
  {
    variable: 'muted',
    label: '보조 배경',
    description: '비활성 영역, 보조 배경색',
    category: 'content',
  },
  {
    variable: 'muted-foreground',
    label: '보조 텍스트',
    description: '비활성 텍스트 색상',
    category: 'content',
  },

  // Interaction Category
  {
    variable: 'accent',
    label: '액센트 배경',
    description: '호버, 포커스 상태 배경색',
    category: 'interaction',
  },
  {
    variable: 'accent-foreground',
    label: '액센트 텍스트',
    description: '액센트 영역 텍스트 색상',
    category: 'interaction',
  },
  {
    variable: 'border',
    label: '테두리',
    description: '전체 UI 테두리 색상',
    category: 'interaction',
  },

  // Sidebar Category
  {
    variable: 'sidebar',
    label: '사이드바 배경',
    description: '사이드바 기본 배경색',
    category: 'sidebar',
  },
  {
    variable: 'sidebar-foreground',
    label: '사이드바 텍스트',
    description: '사이드바 텍스트 색상',
    category: 'sidebar',
  },
  {
    variable: 'sidebar-accent',
    label: '사이드바 액센트',
    description: '사이드바 호버/활성 배경색',
    category: 'sidebar',
  },
  {
    variable: 'sidebar-accent-foreground',
    label: '사이드바 액센트 텍스트',
    description: '사이드바 활성 텍스트 색상',
    category: 'sidebar',
  },
  {
    variable: 'sidebar-border',
    label: '사이드바 테두리',
    description: '사이드바 테두리 색상',
    category: 'sidebar',
  },
];

/**
 * 카테고리별로 그룹핑된 색상 변수 가져오기
 */
export function getGroupedThemeColors() {
  return {
    background: THEME_COLOR_VARIABLES.filter(c => c.category === 'background'),
    content: THEME_COLOR_VARIABLES.filter(c => c.category === 'content'),
    interaction: THEME_COLOR_VARIABLES.filter(c => c.category === 'interaction'),
    sidebar: THEME_COLOR_VARIABLES.filter(c => c.category === 'sidebar'),
  };
}

/**
 * 모드별 커스텀 색상 설정
 */
export interface ModeColorSetting {
  useDefault: boolean;
  customColor?: string; // OKLCH 색상 값
}

/**
 * 커스텀 색상 설정 (모드별 관리)
 */
export interface CustomColorSettings {
  [key: string]: {
    light: ModeColorSetting;
    dark: ModeColorSetting;
  };
}
