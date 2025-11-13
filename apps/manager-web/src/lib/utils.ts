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
