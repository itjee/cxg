/**
 * @file formatters.ts
 * @description 사용자 데이터 포맷팅 유틸리티 함수
 */

/**
 * 상대 시간 포맷 (예: "3분 전", "2시간 전", "어제")
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return "어제";
  if (diffDay < 7) return `${diffDay}일 전`;

  // 날짜 포맷
  return dateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * 절대 시간 포맷 (예: "2025-11-18 14:30:45")
 */
export const formatAbsoluteTime = (
  date: string | Date | null | undefined,
  includeTime: boolean = true
): string => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!includeTime) {
    return dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return dateObj.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * 상태별 색상 클래스
 */
export const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  LOCKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  SUSPENDED: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
} as const;

/**
 * 상태별 라벨
 */
export const statusLabels = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  LOCKED: "잠금",
  SUSPENDED: "정지됨",
} as const;

/**
 * 상태 포맷
 */
export const formatStatus = (status: string): string => {
  return statusLabels[status as keyof typeof statusLabels] || status;
};

/**
 * 상태 색상 조회
 */
export const getStatusColor = (status: string): string => {
  return statusColors[status as keyof typeof statusColors] || statusColors.INACTIVE;
};

/**
 * SSO 제공자별 라벨 및 아이콘
 */
export const ssoProviderConfig = {
  google: { label: "Google", icon: "🔵" },
  azure: { label: "Azure AD", icon: "🟦" },
  github: { label: "GitHub", icon: "⬛" },
  okta: { label: "Okta", icon: "🟩" },
} as const;

/**
 * SSO 제공자 정보 조회
 */
export const getSsoProviderInfo = (
  provider: string | null | undefined
): { label: string; icon: string } | null => {
  if (!provider) return null;
  const key = provider.toLowerCase();
  return ssoProviderConfig[key as keyof typeof ssoProviderConfig] || { label: provider, icon: "🔐" };
};

/**
 * 사용자 타입별 라벨
 */
export const userTypeLabels = {
  MASTER: "최고관리자",
  TENANT: "테넌트관리자",
  SYSTEM: "시스템사용자",
  ADMIN: "관리자",
  USER: "사용자",
} as const;

/**
 * 사용자 타입 포맷
 */
export const formatUserType = (userType: string): string => {
  return userTypeLabels[userType as keyof typeof userTypeLabels] || userType;
};

/**
 * 사용자 타입별 색상
 */
export const userTypeColors = {
  MASTER: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  TENANT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  SYSTEM: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  USER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
} as const;

/**
 * 사용자 타입 색상 조회
 */
export const getUserTypeColor = (userType: string): string => {
  return userTypeColors[userType as keyof typeof userTypeColors] || userTypeColors.USER;
};

/**
 * MFA 상태 포맷
 */
export const formatMfaStatus = (enabled: boolean): string => {
  return enabled ? "활성화" : "비활성화";
};

/**
 * MFA 상태별 색상
 */
export const mfaStatusColors = {
  true: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  false: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
} as const;

/**
 * MFA 상태 색상 조회
 */
export const getMfaStatusColor = (enabled: boolean): string => {
  return mfaStatusColors[String(enabled) as keyof typeof mfaStatusColors];
};
