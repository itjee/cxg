import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * OKLCH 색상의 명도를 추출하여 밝은 색인지 판단
 * @param oklchColor - OKLCH 형식의 색상 문자열 (예: "oklch(50% 0.1 180)")
 * @returns true면 밝은 색, false면 어두운 색
 */
export function isLightColor(oklchColor: string): boolean {
  const match = oklchColor.match(/oklch\((\d+(?:\.\d+)?)%/);
  if (match) {
    const lightness = parseFloat(match[1]);
    return lightness >= 50;
  }
  return false;
}

/**
 * CSS 변수의 계산된 값을 가져옴
 * @param variableName - CSS 변수명 (-- 포함 또는 제외 가능)
 * @returns CSS 변수의 계산된 값
 */
export function getCSSVariable(variableName: string): string {
  if (typeof window === 'undefined') return '';

  const varName = variableName.startsWith('--') ? variableName : `--${variableName}`;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * 날짜를 상대 시간으로 변환 (예: "2분 전", "1시간 전")
 * @param date - 변환할 날짜
 * @returns 상대 시간 문자열
 */
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 30) return `${diffDays}일 전`;

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월 전`;

  const diffYears = Math.round(diffMonths / 12);
  return `${diffYears}년 전`;
}
