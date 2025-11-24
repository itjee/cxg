/**
 * @file formatters.ts
 * @description 테넌트 데이터 포맷팅 유틸리티 함수
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
 * 테넌트 상태별 색상 클래스
 */
export const tenantStatusColors = {
  TRIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  SUSPENDED: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  TERMINATED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

/**
 * 테넌트 상태별 라벨
 */
export const tenantStatusLabels = {
  TRIAL: "평가판",
  ACTIVE: "활성",
  SUSPENDED: "일시중단",
  TERMINATED: "종료",
} as const;

/**
 * 테넌트 상태 포맷
 */
export const formatTenantStatus = (status: string): string => {
  return tenantStatusLabels[status as keyof typeof tenantStatusLabels] || status;
};

/**
 * 테넌트 상태 색상 조회
 */
export const getTenantStatusColor = (status: string): string => {
  return tenantStatusColors[status as keyof typeof tenantStatusColors] || tenantStatusColors.ACTIVE;
};

/**
 * 테넌트 유형별 라벨
 */
export const tenantTypeLabels = {
  TRIAL: "평가판",
  STANDARD: "표준",
  PREMIUM: "프리미엄",
  ENTERPRISE: "엔터프라이즈",
} as const;

/**
 * 테넌트 유형 포맷
 */
export const formatTenantType = (type: string): string => {
  return tenantTypeLabels[type as keyof typeof tenantTypeLabels] || type;
};

/**
 * 테넌트 유형별 색상
 */
export const tenantTypeColors = {
  TRIAL: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  STANDARD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  PREMIUM: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  ENTERPRISE: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
} as const;

/**
 * 테넌트 유형 색상 조회
 */
export const getTenantTypeColor = (type: string): string => {
  return tenantTypeColors[type as keyof typeof tenantTypeColors] || tenantTypeColors.STANDARD;
};

/**
 * 사업자 구분별 라벨
 */
export const bizTypeLabels = {
  C: "법인",
  S: "개인",
} as const;

/**
 * 사업자 구분 포맷
 */
export const formatBizType = (bizType: string | null | undefined): string => {
  if (!bizType) return "-";
  return bizTypeLabels[bizType as keyof typeof bizTypeLabels] || bizType;
};

/**
 * 일시중단 상태별 색상
 */
export const suspendedStatusColors = {
  true: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  false: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
} as const;

/**
 * 일시중단 상태 포맷
 */
export const formatSuspendedStatus = (isSuspended: boolean): string => {
  return isSuspended ? "중단됨" : "정상";
};

/**
 * 일시중단 상태 색상 조회
 */
export const getSuspendedStatusColor = (isSuspended: boolean): string => {
  return suspendedStatusColors[String(isSuspended) as keyof typeof suspendedStatusColors];
};

/**
 * 기간 날짜 포맷 (절대 날짜만 표시)
 * 계약 시작일, 종료일 등에 사용
 * 예: "2025년 11월 24일"
 */
export const formatPeriodDate = (date: string | Date | null | undefined): string => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
