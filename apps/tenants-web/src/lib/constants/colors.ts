/**
 * OKLCH Color Palettes
 *
 * 21개의 색상 팔레트, 각각 11개 shade (50-950)
 * colorchip.html에서 추출한 OKLCH 색상값
 */

export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export type ColorPalette =
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose';

export interface PaletteInfo {
  name: ColorPalette;
  label: string;
  category: 'neutral' | 'warm' | 'cool' | 'vibrant';
  description: string;
}

export const COLOR_PALETTES: Record<ColorPalette, ColorShades> = {
  slate: {
    50: "oklch(98.42% 0.0034 247.86)",
    100: "oklch(96.83% 0.0069 247.9)",
    200: "oklch(92.88% 0.0126 255.51)",
    300: "oklch(86.9% 0.0198 252.89)",
    400: "oklch(71.07% 0.0351 256.79)",
    500: "oklch(55.44% 0.0407 257.42)",
    600: "oklch(44.55% 0.0374 257.28)",
    700: "oklch(37.17% 0.0392 257.29)",
    800: "oklch(27.95% 0.0368 260.03)",
    900: "oklch(20.77% 0.0398 265.75)",
    950: "oklch(12.88% 0.0406 264.7)",
  },
  gray: {
    50: "oklch(98.46% 0.0017 247.84)",
    100: "oklch(96.7% 0.0029 264.54)",
    200: "oklch(92.76% 0.0058 264.53)",
    300: "oklch(87.17% 0.0093 258.34)",
    400: "oklch(71.37% 0.0192 261.32)",
    500: "oklch(55.1% 0.0234 264.36)",
    600: "oklch(55.1% 0.0234 264.36)",
    700: "oklch(37.29% 0.0306 259.73)",
    800: "oklch(27.81% 0.0296 256.85)",
    900: "oklch(21.01% 0.0318 264.66)",
    950: "oklch(12.96% 0.0274 261.69)",
  },
  zinc: {
    50: "oklch(98.51% 0 0)",
    100: "oklch(96.74% 0.0013 286.38)",
    200: "oklch(91.97% 0.004 286.32)",
    300: "oklch(87.11% 0.0055 286.29)",
    400: "oklch(71.18% 0.0129 286.07)",
    500: "oklch(55.17% 0.0138 285.94)",
    600: "oklch(44.19% 0.0146 285.79)",
    700: "oklch(37.03% 0.0119 285.81)",
    800: "oklch(27.39% 0.0055 286.03)",
    900: "oklch(21.03% 0.0059 285.89)",
    950: "oklch(14.08% 0.0044 285.82)",
  },
  neutral: {
    50: "oklch(98.51% 0 0)",
    100: "oklch(97.02% 0 0)",
    200: "oklch(92.19% 0 0)",
    300: "oklch(86.99% 0 0)",
    400: "oklch(71.55% 0 0)",
    500: "oklch(55.55% 0 0)",
    600: "oklch(43.86% 0 0)",
    700: "oklch(37.15% 0 0)",
    800: "oklch(26.86% 0 0)",
    900: "oklch(20.46% 0 0)",
    950: "oklch(14.48% 0 0)",
  },
  stone: {
    50: "oklch(98.48% 0.0013 106.42)",
    100: "oklch(96.99% 0.0013 106.42)",
    200: "oklch(92.32% 0.0026 48.72)",
    300: "oklch(86.87% 0.0043 56.37)",
    400: "oklch(71.61% 0.0091 56.26)",
    500: "oklch(55.34% 0.0116 58.07)",
    600: "oklch(44.44% 0.0096 73.64)",
    700: "oklch(37.41% 0.0087 67.56)",
    800: "oklch(26.85% 0.0063 34.3)",
    900: "oklch(21.61% 0.0061 56.04)",
    950: "oklch(14.69% 0.0041 49.25)",
  },
  red: {
    50: "oklch(97.05% 0.0129 17.38)",
    100: "oklch(93.56% 0.0309 17.72)",
    200: "oklch(88.45% 0.0593 18.33)",
    300: "oklch(80.77% 0.1035 19.57)",
    400: "oklch(71.06% 0.1661 22.22)",
    500: "oklch(63.68% 0.2078 25.33)",
    600: "oklch(57.71% 0.2152 27.33)",
    700: "oklch(50.54% 0.1905 27.52)",
    800: "oklch(44.37% 0.1613 26.9)",
    900: "oklch(39.58% 0.1331 25.72)",
    950: "oklch(25.75% 0.0886 26.04)",
  },
  orange: {
    50: "oklch(97.96% 0.0158 73.68)",
    100: "oklch(95.42% 0.0372 75.16)",
    200: "oklch(90.15% 0.0729 70.7)",
    300: "oklch(83.66% 0.1165 66.29)",
    400: "oklch(75.76% 0.159 55.93)",
    500: "oklch(70.49% 0.1867 47.6)",
    600: "oklch(64.61% 0.1943 41.12)",
    700: "oklch(55.34% 0.1739 38.4)",
    800: "oklch(46.98% 0.143 37.3)",
    900: "oklch(40.84% 0.1165 38.17)",
    950: "oklch(26.59% 0.0762 36.26)",
  },
  amber: {
    50: "oklch(98.69% 0.0214 95.28)",
    100: "oklch(96.19% 0.058 95.62)",
    200: "oklch(92.43% 0.1151 95.75)",
    300: "oklch(87.9% 0.1534 91.61)",
    400: "oklch(83.69% 0.1644 84.43)",
    500: "oklch(76.86% 0.1647 70.08)",
    600: "oklch(66.58% 0.1574 58.32)",
    700: "oklch(55.53% 0.1455 49)",
    800: "oklch(47.32% 0.1247 46.2)",
    900: "oklch(41.37% 0.1054 45.9)",
    950: "oklch(27.91% 0.0742 45.64)",
  },
  yellow: {
    50: "oklch(98.73% 0.0262 102.21)",
    100: "oklch(97.29% 0.0693 103.19)",
    200: "oklch(94.51% 0.1243 101.54)",
    300: "oklch(90.52% 0.1657 98.11)",
    400: "oklch(86.06% 0.1731 91.94)",
    500: "oklch(79.52% 0.1617 86.05)",
    600: "oklch(68.06% 0.1423 75.83)",
    700: "oklch(55.38% 0.1207 66.44)",
    800: "oklch(47.62% 0.1034 61.91)",
    900: "oklch(42.1% 0.0897 57.71)",
    950: "oklch(28.57% 0.0639 53.81)",
  },
  lime: {
    50: "oklch(98.57% 0.031 120.76)",
    100: "oklch(96.69% 0.0659 122.33)",
    200: "oklch(93.82% 0.1217 124.32)",
    300: "oklch(89.72% 0.1786 126.67)",
    400: "oklch(84.93% 0.2073 128.85)",
    500: "oklch(76.81% 0.2044 130.85)",
    600: "oklch(64.82% 0.1754 131.68)",
    700: "oklch(53.22% 0.1405 131.59)",
    800: "oklch(45.28% 0.1129 130.93)",
    900: "oklch(40.5% 0.0956 131.06)",
    950: "oklch(27.41% 0.0688 132.11)",
  },
  green: {
    50: "oklch(98.19% 0.0181 155.83)",
    100: "oklch(96.24% 0.0434 156.74)",
    200: "oklch(92.5% 0.0806 155.99)",
    300: "oklch(87.12% 0.1363 154.45)",
    400: "oklch(80.03% 0.1821 151.71)",
    500: "oklch(72.27% 0.192 149.58)",
    600: "oklch(62.71% 0.1699 149.21)",
    700: "oklch(52.73% 0.1371 150.07)",
    800: "oklch(44.79% 0.1083 151.33)",
    900: "oklch(39.25% 0.0896 152.54)",
    950: "oklch(26.64% 0.0628 152.93)",
  },
  emerald: {
    50: "oklch(97.93% 0.0207 166.11)",
    100: "oklch(95.05% 0.0507 163.05)",
    200: "oklch(90.49% 0.0895 164.15)",
    300: "oklch(84.52% 0.1299 164.98)",
    400: "oklch(77.29% 0.1535 163.22)",
    500: "oklch(69.59% 0.1491 162.48)",
    600: "oklch(59.6% 0.1274 163.23)",
    700: "oklch(50.81% 0.1049 165.61)",
    800: "oklch(43.18% 0.0865 166.91)",
    900: "oklch(37.8% 0.073 168.94)",
    950: "oklch(26.21% 0.0487 172.55)",
  },
  teal: {
    50: "oklch(98.36% 0.0142 180.72)",
    100: "oklch(95.27% 0.0498 180.8)",
    200: "oklch(91% 0.0927 180.43)",
    300: "oklch(85.49% 0.1251 181.07)",
    400: "oklch(78.45% 0.1325 181.91)",
    500: "oklch(70.38% 0.123 182.5)",
    600: "oklch(60.02% 0.1038 184.7)",
    700: "oklch(51.09% 0.0861 186.39)",
    800: "oklch(43.7% 0.0705 188.22)",
    900: "oklch(38.61% 0.059 188.42)",
    950: "oklch(27.73% 0.0447 192.52)",
  },
  cyan: {
    50: "oklch(98.41% 0.0189 200.87)",
    100: "oklch(95.63% 0.0443 203.39)",
    200: "oklch(91.67% 0.0772 205.04)",
    300: "oklch(86.51% 0.1153 207.08)",
    400: "oklch(79.71% 0.1339 211.53)",
    500: "oklch(71.48% 0.1257 215.22)",
    600: "oklch(60.89% 0.1109 221.72)",
    700: "oklch(51.98% 0.0936 223.13)",
    800: "oklch(45% 0.0771 224.28)",
    900: "oklch(39.82% 0.0664 227.39)",
    950: "oklch(30.18% 0.0541 229.7)",
  },
  sky: {
    50: "oklch(97.71% 0.0125 236.62)",
    100: "oklch(95.14% 0.025 236.82)",
    200: "oklch(90.14% 0.0555 230.9)",
    300: "oklch(82.76% 0.1013 230.32)",
    400: "oklch(75.35% 0.139 232.66)",
    500: "oklch(68.47% 0.1479 237.32)",
    600: "oklch(58.76% 0.1389 241.97)",
    700: "oklch(50% 0.1193 242.75)",
    800: "oklch(44.34% 0.1 240.79)",
    900: "oklch(39.12% 0.0845 240.88)",
    950: "oklch(29.35% 0.0632 243.16)",
  },
  blue: {
    50: "oklch(97.05% 0.0142 254.6)",
    100: "oklch(93.19% 0.0316 255.59)",
    200: "oklch(88.23% 0.0571 254.13)",
    300: "oklch(80.91% 0.0956 251.81)",
    400: "oklch(71.37% 0.1434 254.62)",
    500: "oklch(62.31% 0.188 259.81)",
    600: "oklch(54.61% 0.2152 262.88)",
    700: "oklch(48.82% 0.2172 264.38)",
    800: "oklch(42.44% 0.1809 265.64)",
    900: "oklch(37.91% 0.1378 265.52)",
    950: "oklch(28.23% 0.0874 267.94)",
  },
  indigo: {
    50: "oklch(96.19% 0.0179 272.31)",
    100: "oklch(92.99% 0.0334 272.79)",
    200: "oklch(86.99% 0.0622 274.04)",
    300: "oklch(78.53% 0.1041 274.71)",
    400: "oklch(68.01% 0.1583 276.93)",
    500: "oklch(58.54% 0.2041 277.12)",
    600: "oklch(51.06% 0.2301 276.97)",
    700: "oklch(45.68% 0.2146 277.02)",
    800: "oklch(39.84% 0.1773 277.37)",
    900: "oklch(35.88% 0.1354 278.7)",
    950: "oklch(25.73% 0.0861 281.29)",
  },
  violet: {
    50: "oklch(97% 0.02 294)",
    100: "oklch(94% 0.03 295)",
    200: "oklch(89% 0.05 293)",
    300: "oklch(81% 0.10 294)",
    400: "oklch(71% 0.16 294)",
    500: "oklch(61% 0.22 293)",
    600: "oklch(54% 0.25 293)",
    700: "oklch(49% 0.24 293)",
    800: "oklch(43% 0.21 293)",
    900: "oklch(38% 0.18 294)",
    950: "oklch(28% 0.14 291)",
  },
  purple: {
    50: "oklch(97.68% 0.0142 308.3)",
    100: "oklch(94.64% 0.0327 307.17)",
    200: "oklch(90.24% 0.0604 306.7)",
    300: "oklch(82.68% 0.1082 306.38)",
    400: "oklch(72.17% 0.1767 305.5)",
    500: "oklch(62.68% 0.2325 303.9)",
    600: "oklch(55.75% 0.2525 302.32)",
    700: "oklch(49.55% 0.2369 301.92)",
    800: "oklch(43.83% 0.1983 303.72)",
    900: "oklch(38.07% 0.1661 304.99)",
    950: "oklch(29.05% 0.1432 302.72)",
  },
  fuchsia: {
    50: "oklch(97.73% 0.0173 320.06)",
    100: "oklch(95.2% 0.036 318.85)",
    200: "oklch(90.3% 0.0732 319.62)",
    300: "oklch(83.3% 0.1322 321.43)",
    400: "oklch(74.77% 0.207 322.16)",
    500: "oklch(66.68% 0.2591 322.15)",
    600: "oklch(59.15% 0.2569 322.9)",
    700: "oklch(51.8% 0.2258 323.95)",
    800: "oklch(45.19% 0.1922 324.59)",
    900: "oklch(40.07% 0.1601 325.61)",
    950: "oklch(29.32% 0.1309 325.66)",
  },
  pink: {
    50: "oklch(97.14% 0.0141 343.2)",
    100: "oklch(94.82% 0.0276 342.26)",
    200: "oklch(89.94% 0.0589 343.23)",
    300: "oklch(82.28% 0.1095 346.02)",
    400: "oklch(72.53% 0.1752 349.76)",
    500: "oklch(65.59% 0.2118 354.31)",
    600: "oklch(59.16% 0.218 0.58)",
    700: "oklch(52.46% 0.199 3.96)",
    800: "oklch(45.87% 0.1697 3.82)",
    900: "oklch(40.78% 0.1442 2.43)",
    950: "oklch(28.45% 0.1048 3.91)",
  },
  rose: {
    50: "oklch(96.94% 0.0151 12.42)",
    100: "oklch(94.14% 0.0297 12.58)",
    200: "oklch(89.24% 0.0559 10)",
    300: "oklch(80.97% 0.1061 11.64)",
    400: "oklch(71.92% 0.169 13.43)",
    500: "oklch(64.5% 0.2154 16.44)",
    600: "oklch(58.58% 0.222 17.58)",
    700: "oklch(51.43% 0.1978 16.93)",
    800: "oklch(45.46% 0.1713 13.7)",
    900: "oklch(41.03% 0.1502 10.27)",
    950: "oklch(27.08% 0.1009 12.09)",
  },
};

export const PALETTE_INFO: Record<ColorPalette, PaletteInfo> = {
  // Neutral
  slate: { name: 'slate', label: 'Slate', category: 'neutral', description: '세련된 회색 톤' },
  gray: { name: 'gray', label: 'Gray', category: 'neutral', description: '클래식 회색' },
  zinc: { name: 'zinc', label: 'Zinc', category: 'neutral', description: '모던 회색' },
  neutral: { name: 'neutral', label: 'Neutral', category: 'neutral', description: '순수 무채색' },
  stone: { name: 'stone', label: 'Stone', category: 'neutral', description: '따뜻한 회색' },

  // Warm
  red: { name: 'red', label: 'Red', category: 'warm', description: '강렬한 빨강' },
  orange: { name: 'orange', label: 'Orange', category: 'warm', description: '활기찬 주황' },
  amber: { name: 'amber', label: 'Amber', category: 'warm', description: '호박빛 황금' },
  yellow: { name: 'yellow', label: 'Yellow', category: 'warm', description: '밝은 노랑' },
  lime: { name: 'lime', label: 'Lime', category: 'warm', description: '상큼한 라임' },

  // Cool
  green: { name: 'green', label: 'Green', category: 'cool', description: '자연스러운 초록' },
  emerald: { name: 'emerald', label: 'Emerald', category: 'cool', description: '에메랄드 그린' },
  teal: { name: 'teal', label: 'Teal', category: 'cool', description: '틸 블루그린' },
  cyan: { name: 'cyan', label: 'Cyan', category: 'cool', description: '시원한 청록' },
  sky: { name: 'sky', label: 'Sky', category: 'cool', description: '하늘색' },

  // Vibrant
  blue: { name: 'blue', label: 'Blue', category: 'vibrant', description: '신뢰감있는 파랑' },
  indigo: { name: 'indigo', label: 'Indigo', category: 'vibrant', description: '인디고 블루' },
  violet: { name: 'violet', label: 'Violet', category: 'vibrant', description: '우아한 보라' },
  purple: { name: 'purple', label: 'Purple', category: 'vibrant', description: '고귀한 자주' },
  fuchsia: { name: 'fuchsia', label: 'Fuchsia', category: 'vibrant', description: '선명한 마젠타' },
  pink: { name: 'pink', label: 'Pink', category: 'vibrant', description: '사랑스러운 분홍' },
  rose: { name: 'rose', label: 'Rose', category: 'vibrant', description: '장미빛 핑크' },
};

// Default palettes for each app
export const DEFAULT_PALETTE: Record<'manager' | 'tenant', ColorPalette> = {
  manager: 'violet',
  tenant: 'indigo',
};

// Helper to get palette by category
export function getPalettesByCategory(category: PaletteInfo['category']): PaletteInfo[] {
  return Object.values(PALETTE_INFO).filter(p => p.category === category);
}

// Helper to get all palettes grouped by category
export function getGroupedPalettes() {
  return {
    neutral: getPalettesByCategory('neutral'),
    warm: getPalettesByCategory('warm'),
    cool: getPalettesByCategory('cool'),
    vibrant: getPalettesByCategory('vibrant'),
  };
}
