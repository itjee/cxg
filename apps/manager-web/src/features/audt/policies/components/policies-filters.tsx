import { Filters, type FilterConfig } from "@/components/filters";
import { usePoliciesStore } from "../stores/policies.store";
import type { Policy } from "../types/policies.types";

interface PoliciesFiltersProps {
  data: Policy[];
}

export function PoliciesFilters({ data }: PoliciesFiltersProps) {
  const {
    searchText,
    setSearchText,
    selectedPolicyType,
    setSelectedPolicyType,
    selectedPolicyCategory,
    setSelectedPolicyCategory,
    selectedStatus,
    setSelectedStatus,
    selectedEnforcementLevel,
    setSelectedEnforcementLevel,
    resetFilters,
  } = usePoliciesStore();

  const filterConfigs: FilterConfig[] = [
    {
      key: "searchText",
      label: "검색",
      description: "정책명으로 검색...",
      type: "search",
    },
    {
      key: "selectedPolicyType",
      label: "정책 유형",
      description: "전체 유형",
      type: "select",
      options: [
        { label: "비밀번호", value: "PASSWORD" },
        { label: "접근제어", value: "ACCESS_CONTROL" },
        { label: "데이터보관", value: "DATA_RETENTION" },
        { label: "암호화", value: "ENCRYPTION" },
        { label: "인증", value: "AUTHENTICATION" },
        { label: "네트워크보안", value: "NETWORK_SECURITY" },
      ],
    },
    {
      key: "selectedPolicyCategory",
      label: "정책 분류",
      description: "전체 분류",
      type: "select",
      options: [
        { label: "인증", value: "AUTHENTICATION" },
        { label: "권한부여", value: "AUTHORIZATION" },
        { label: "데이터보호", value: "DATA_PROTECTION" },
        { label: "모니터링", value: "MONITORING" },
        { label: "사고대응", value: "INCIDENT_RESPONSE" },
        { label: "컴플라이언스", value: "COMPLIANCE" },
      ],
    },
    {
      key: "selectedStatus",
      label: "정책 상태",
      description: "전체 상태",
      type: "select",
      options: [
        { label: "초안", value: "DRAFT" },
        { label: "승인대기", value: "PENDING_APPROVAL" },
        { label: "활성", value: "ACTIVE" },
        { label: "보관", value: "ARCHIVED" },
      ],
    },
    {
      key: "selectedEnforcementLevel",
      label: "시행수준",
      description: "전체 수준",
      type: "select",
      options: [
        { label: "필수", value: "MANDATORY" },
        { label: "권장", value: "RECOMMENDED" },
        { label: "선택", value: "OPTIONAL" },
      ],
    },
  ];

  const filterValues = {
    searchText,
    selectedPolicyType,
    selectedPolicyCategory,
    selectedStatus,
    selectedEnforcementLevel,
  };

  const handleFilterChange = (key: string, value: string) => {
    const handlers: Record<string, (val: string) => void> = {
      searchText: setSearchText,
      selectedPolicyType: setSelectedPolicyType,
      selectedPolicyCategory: setSelectedPolicyCategory,
      selectedStatus: setSelectedStatus,
      selectedEnforcementLevel: setSelectedEnforcementLevel,
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
