/**
 * Code Help Service
 *
 * 코드 헬프 관련 비즈니스 로직 및 유틸리티
 */

import type { CodeHelpType, CodeHelpResult } from "@/shared/types/code-help.types";

class CodeHelpService {
  /**
   * 검색 유형별 기본 제목 반환
   */
  getDefaultTitle(searchType: CodeHelpType): string {
    const titles: Record<CodeHelpType, string> = {
      customer: "거래처 검색",
      product: "제품 검색",
      user: "사용자 검색",
      employee: "사원 검색",
      common_code: "공통코드 검색",
      parent_code: "상위코드 검색",
    };
    return titles[searchType] || "검색";
  }

  /**
   * 검색 유형별 기본 너비 반환
   */
  getDefaultWidth(searchType: CodeHelpType): string {
    const widths: Record<CodeHelpType, string> = {
      customer: "700px",
      product: "700px",
      user: "700px",
      employee: "700px",
      common_code: "600px",
      parent_code: "600px",
    };
    return widths[searchType] || "600px";
  }

  /**
   * 검색 유형별 기본 높이 반환
   */
  getDefaultHeight(searchType: CodeHelpType): string {
    return "600px";
  }

  /**
   * 검색 유형별 표시할 컬럼 정의
   */
  getColumnsForType(searchType: CodeHelpType): string[] {
    const columns: Record<CodeHelpType, string[]> = {
      customer: ["code", "name", "phone", "address", "status"],
      product: ["code", "name", "category", "price", "status"],
      employee: ["code", "name", "department", "position", "status"],
      user: ["code", "name", "email", "userType", "status"],
      common_code: ["code", "name", "description", "status"],
      parent_code: ["code", "name", "description", "status"],
    };
    return columns[searchType] || ["code", "name", "status"];
  }

  /**
   * 항목 포맷팅 (선택 시 표시)
   */
  formatSelectedItem(item: CodeHelpResult): string {
    return `${item.code} - ${item.name}`;
  }

  /**
   * 메타데이터에서 특정 필드 가져오기
   */
  getMetadataField(item: CodeHelpResult, fieldName: string): any {
    return item.metadata?.[fieldName] ?? null;
  }

  /**
   * 검증: 선택된 항목이 유효한지 확인
   */
  validate(item: CodeHelpResult): boolean {
    return !!(item.id && item.code && item.name && item.status === "ACTIVE");
  }

  /**
   * 검색 유형별 기본 필터 반환
   */
  getDefaultFilters(searchType: CodeHelpType): Record<string, any> {
    const filters: Record<CodeHelpType, Record<string, any>> = {
      customer: { status: "ACTIVE" },
      product: { status: "ACTIVE" },
      user: { status: "ACTIVE" },
      employee: { status: "ACTIVE" },
      common_code: { status: "ACTIVE" },
      parent_code: { status: "ACTIVE" },
    };
    return filters[searchType] || { status: "ACTIVE" };
  }

  /**
   * 여러 항목 선택 시 포맷팅
   */
  formatMultipleSelection(items: CodeHelpResult[]): string {
    if (items.length === 0) {
      return "";
    }
    if (items.length === 1) {
      return this.formatSelectedItem(items[0]);
    }
    return `${items.length}개 선택됨`;
  }

  /**
   * 검색 유형별 placeholder 텍스트 반환
   */
  getSearchPlaceholder(searchType: CodeHelpType): string {
    const placeholders: Record<CodeHelpType, string> = {
      customer: "거래처 코드 또는 명칭으로 검색...",
      product: "제품 코드 또는 명칭으로 검색...",
      user: "사용자명, 이메일, 아이디로 검색...",
      employee: "사원 코드 또는 명칭으로 검색...",
      common_code: "공통코드 또는 명칭으로 검색...",
      parent_code: "상위코드 또는 명칭으로 검색...",
    };
    return placeholders[searchType] || "검색...";
  }

  /**
   * 상태 배지 색상 반환
   */
  getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "DELETED":
        return "destructive";
      default:
        return "outline";
    }
  }

  /**
   * 상태 라벨 반환 (한글)
   */
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      ACTIVE: "활성",
      INACTIVE: "비활성",
      DELETED: "삭제됨",
      LOCKED: "잠금",
      SUSPENDED: "정지됨",
    };
    return labels[status] || status;
  }
}

export const codeHelpService = new CodeHelpService();
