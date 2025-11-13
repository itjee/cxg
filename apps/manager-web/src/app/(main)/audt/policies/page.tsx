"use client";

import { toast } from "sonner";
import {
  PoliciesHeader,
  PoliciesStats,
  PoliciesFilters,
  PoliciesTable,
  PoliciesEdit,
  PoliciesDetail,
} from "@/features/audt/policies";
import { usePolicies, useApprovePolicy } from "@/features/audt/policies/hooks/use-policies";
import { usePoliciesStore } from "@/features/audt/policies/stores/policies.store";

export default function PoliciesPage() {
  const {
    globalFilter,
    selectedPolicyType,
    selectedPolicyCategory,
    selectedStatus,
    selectedEnforcementLevel,
    currentPage,
    itemsPerPage,
    openDetail,
  } = usePoliciesStore();

  const {
    data: policiesResponse,
    isLoading,
    error,
    refetch,
  } = usePolicies({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    policy_type: selectedPolicyType || undefined,
    policy_category: selectedPolicyCategory || undefined,
    status: selectedStatus || undefined,
    enforcement_level: selectedEnforcementLevel || undefined,
  });

  const approveMutation = useApprovePolicy({
    onSuccess: () => {
      toast.success("정책이 승인되었습니다");
    },
    onError: (error) => {
      toast.error(error.message || "승인 실패");
    },
  });

  const policies = policiesResponse?.items || [];

  const handleRefresh = () => {
    refetch();
    toast.success("데이터를 새로고침했습니다");
  };

  const handleExport = () => {
    toast.info("내보내기 기능은 준비 중입니다");
  };

  const handleApprove = (policy: any) => {
    const approver = prompt("승인자 이름을 입력하세요:");
    if (approver) {
      approveMutation.mutate({ id: policy.id, approver });
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className="space-y-6">
      <PoliciesHeader onRefresh={handleRefresh} onExport={handleExport} />
      <PoliciesStats data={policies} />
      <PoliciesFilters data={policies} />
      <PoliciesTable
        data={policies}
        onViewDetails={(policy) => openDetail(policy.id)}
        onApprove={handleApprove}
      />
      <PoliciesEdit />
      <PoliciesDetail />
    </div>
  );
}
