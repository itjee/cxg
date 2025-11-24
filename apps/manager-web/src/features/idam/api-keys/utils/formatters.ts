/**
 * @file formatters.ts
 * @description API 키 데이터 포맷팅 유틸리티 함수
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
 * API 키 상태별 색상 클래스
 */
export const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  REVOKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

/**
 * API 키 상태별 라벨
 */
export const statusLabels = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
  REVOKED: "취소됨",
} as const;

/**
 * API 키 상태 포맷
 */
export const formatStatus = (status: string): string => {
  return statusLabels[status as keyof typeof statusLabels] || status;
};

/**
 * API 키 상태 색상 조회
 */
export const getStatusColor = (status: string): string => {
  return statusColors[status as keyof typeof statusColors] || statusColors.INACTIVE;
};

/**
 * API 키 마스킹 (보안)
 * 실제 키는 서버에서만 반환하므로 표시용 포맷팅만 수행
 */
export const maskApiKey = (key: string): string => {
  if (!key || key.length < 8) return key;
  const visibleLength = 4;
  const maskLength = key.length - visibleLength;
  return key.substring(0, visibleLength) + Array(maskLength + 1).join("*");
};

/**
 * 사용 제한값 포맷 (예: "1,000 req/min")
 */
export const formatRateLimit = (limit: number, unit: "min" | "hour" | "day"): string => {
  return `${limit.toLocaleString("ko-KR")} req/${unit === "min" ? "분" : unit === "hour" ? "시간" : "일"}`;
};

/**
 * IP 주소 목록 포맷 (배열 또는 콤마 구분 문자열 -> 배열로 변환)
 */
export const formatIpAddressList = (ips: string[] | string | null | undefined): string[] => {
  if (!ips) return [];
  if (Array.isArray(ips)) return ips;
  return ips
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0);
};

/**
 * 스코프 목록 포맷 (배열 또는 콤마 구분 문자열 -> 배열로 변환)
 */
export const formatScopesList = (scopes: string[] | string | null | undefined): string[] => {
  if (!scopes) return [];
  if (Array.isArray(scopes)) return scopes;
  return scopes
    .split(",")
    .map((scope) => scope.trim())
    .filter((scope) => scope.length > 0);
};

/**
 * API 키 만료 여부 확인
 */
export const isApiKeyExpired = (expiresAt: string | Date | null | undefined): boolean => {
  if (!expiresAt) return false;
  const expiryDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return expiryDate <= new Date();
};

/**
 * API 키 만료 상태 포맷
 */
export const formatExpirationStatus = (expiresAt: string | Date | null | undefined): string => {
  if (!expiresAt) return "만료 안 함";

  const expiryDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const now = new Date();
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return "만료됨";
  if (daysUntilExpiry === 0) return "오늘 만료";
  if (daysUntilExpiry === 1) return "내일 만료";
  if (daysUntilExpiry <= 7) return `${daysUntilExpiry}일 후 만료`;

  return `${Math.floor(daysUntilExpiry / 7)}주 후 만료`;
};

/**
 * API 키 만료 상태별 색상
 */
export const expirationStatusColors = {
  active: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  critical: "text-red-600 dark:text-red-400",
  expired: "text-gray-500 dark:text-gray-400",
} as const;

/**
 * API 키의 만료 상태 색상 조회
 */
export const getExpirationStatusColor = (expiresAt: string | Date | null | undefined): string => {
  if (!expiresAt) return expirationStatusColors.active;

  const expiryDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  const now = new Date();
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return expirationStatusColors.expired;
  if (daysUntilExpiry <= 7) return expirationStatusColors.critical;
  if (daysUntilExpiry <= 30) return expirationStatusColors.warning;

  return expirationStatusColors.active;
};
