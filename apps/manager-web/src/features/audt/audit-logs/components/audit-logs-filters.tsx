import { useMemo } from "react";
import { Filters, type FilterConfig } from "@/components/filters";
import { useAuditLogsStore } from "../stores/audit-logs.store";
import type { AuditLog } from "../types/audit-logs.types";

interface AuditLogsFiltersProps {
  data: AuditLog[];
}

export function AuditLogsFilters({ data }: AuditLogsFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedEventType,
    setSelectedEventType,
    selectedEventCategory,
    setSelectedEventCategory,
    selectedResult,
    setSelectedResult,
    selectedRiskLevel,
    setSelectedRiskLevel,
    resetFilters,
  } = useAuditLogsStore();

  const filterConfigs: FilterConfig[] = [
    {
      key: "searchText",
      label: "검색",
      description: "설명, IP 주소로 검색...",
      type: "search",
    },
    {
      key: "selectedEventType",
      label: "이벤트 유형",
      description: "전체 유형",
      type: "select",
      options: [
        { label: "로그인", value: "LOGIN" },
        { label: "로그아웃", value: "LOGOUT" },
        { label: "API 호출", value: "API_CALL" },
        { label: "데이터 접근", value: "DATA_ACCESS" },
        { label: "관리자 작업", value: "ADMIN_ACTION" },
        { label: "비밀번호 변경", value: "PASSWORD_CHANGE" },
        { label: "권한 변경", value: "PERMISSION_CHANGE" },
      ],
    },
    {
      key: "selectedEventCategory",
      label: "이벤트 분류",
      description: "전체 분류",
      type: "select",
      options: [
        { label: "인증", value: "AUTHENTICATION" },
        { label: "권한부여", value: "AUTHORIZATION" },
        { label: "데이터수정", value: "DATA_MODIFICATION" },
        { label: "시스템변경", value: "SYSTEM_CHANGE" },
        { label: "보안위반", value: "SECURITY_VIOLATION" },
      ],
    },
    {
      key: "selectedResult",
      label: "결과",
      description: "전체 결과",
      type: "select",
      options: [
        { label: "성공", value: "SUCCESS" },
        { label: "실패", value: "FAILURE" },
        { label: "차단", value: "BLOCKED" },
      ],
    },
    {
      key: "selectedRiskLevel",
      label: "위험도",
      description: "전체 위험도",
      type: "select",
      options: [
        { label: "높음", value: "HIGH" },
        { label: "보통", value: "MEDIUM" },
        { label: "낮음", value: "LOW" },
      ],
    },
  ];

  const filterValues = {
    searchText,
    selectedEventType,
    selectedEventCategory,
    selectedResult,
    selectedRiskLevel,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      searchText: setSearchText,
      selectedEventType: setSelectedEventType,
      selectedEventCategory: setSelectedEventCategory,
      selectedResult: setSelectedResult,
      selectedRiskLevel: setSelectedRiskLevel,
    };
    handlers[key]?.(value);
  };

  return (
    <Filters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
