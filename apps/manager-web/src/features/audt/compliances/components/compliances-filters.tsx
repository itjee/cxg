import { SearchFilters, type FilterConfig } from "@/components/filters";
import { useCompliancesStore } from "../stores/compliances.store";
import type { Compliance } from "../types/compliances.types";

interface CompliancesFiltersProps {
  data: Compliance[];
}

export function CompliancesFilters({ data }: CompliancesFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedReportType,
    setSelectedReportType,
    selectedComplianceStatus,
    setSelectedComplianceStatus,
    selectedStatus,
    setSelectedStatus,
    selectedScope,
    setSelectedScope,
    resetFilters,
  } = useCompliancesStore();

  const filterConfigs: FilterConfig[] = [
    {
      key: "searchText",
      label: "검색",
      description: "보고서명으로 검색...",
      type: "search",
    },
    {
      key: "selectedReportType",
      label: "보고서 유형",
      description: "전체 유형",
      type: "select",
      options: [
        { label: "GDPR", value: "GDPR" },
        { label: "SOX", value: "SOX" },
        { label: "HIPAA", value: "HIPAA" },
        { label: "ISO27001", value: "ISO27001" },
        { label: "PCI-DSS", value: "PCI_DSS" },
        { label: "CCPA", value: "CCPA" },
        { label: "맞춤형", value: "CUSTOM" },
      ],
    },
    {
      key: "selectedComplianceStatus",
      label: "준수상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "준수", value: "COMPLIANT" },
        { label: "미준수", value: "NON_COMPLIANT" },
        { label: "부분준수", value: "PARTIAL" },
        { label: "검토중", value: "PENDING" },
      ],
    },
    {
      key: "selectedStatus",
      label: "보고서 상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "초안", value: "DRAFT" },
        { label: "검토대기", value: "PENDING_REVIEW" },
        { label: "승인완료", value: "APPROVED" },
        { label: "공개됨", value: "PUBLISHED" },
      ],
    },
    {
      key: "selectedScope",
      label: "적용 범위",
      description: "전체 범위",
      type: "select",
      options: [
        { label: "전체 테넌트", value: "ALL_TENANTS" },
        { label: "특정 테넌트", value: "SPECIFIC_TENANT" },
        { label: "시스템 전체", value: "SYSTEM_WIDE" },
      ],
    },
  ];

  const filterValues = {
    searchText,
    selectedReportType,
    selectedComplianceStatus,
    selectedStatus,
    selectedScope,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      searchText: setSearchText,
      selectedReportType: setSelectedReportType,
      selectedComplianceStatus: setSelectedComplianceStatus,
      selectedStatus: setSelectedStatus,
      selectedScope: setSelectedScope,
    };
    handlers[key]?.(value);
  };

  return (
    <SearchFilters
      filters={filterConfigs}
      values={filterValues}
      onChange={handleFilterChange}
      title="검색 및 필터"
      defaultExpanded={true}
      onReset={resetFilters}
    />
  );
}
