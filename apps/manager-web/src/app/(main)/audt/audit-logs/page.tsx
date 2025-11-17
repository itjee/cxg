"use client";

import { toast } from "sonner";
import {
  AuditLogsHeader,
  AuditLogsStats,
  AuditLogsFilters,
  AuditLogsTable,
  AuditLogsDetail,
} from "@/features/audt/audit-logs";
import { useAuditLogs } from "@/features/audt/audit-logs/hooks/use-audit-logs";
import { useAuditLogsStore } from "@/features/audt/audit-logs/stores/audit-logs.store";

export default function AuditLogsPage() {
  const {
    searchText,
    selectedEventType,
    selectedEventCategory,
    selectedResult,
    selectedRiskLevel,
    currentPage,
    itemsPerPage,
    openDetail,
  } = useAuditLogsStore();

  const {
    data: auditLogsResponse,
    isLoading,
    error,
    refetch,
  } = useAuditLogs({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: searchText,
    event_type: selectedEventType || undefined,
    event_category: selectedEventCategory || undefined,
    result: selectedResult || undefined,
    risk_level: selectedRiskLevel || undefined,
  });

  const auditLogs = auditLogsResponse?.items || [];

  const handleRefresh = () => {
    refetch();
    toast.success("데이터를 새로고침했습니다");
  };

  const handleExport = () => {
    toast.info("내보내기 기능은 준비 중입니다");
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className="space-y-6">
      <AuditLogsHeader onRefresh={handleRefresh} onExport={handleExport} />
      <AuditLogsStats data={auditLogs} />
      <AuditLogsFilters data={auditLogs} />
      <AuditLogsTable
        data={auditLogs}
        onViewDetails={(log) => openDetail(log.id)}
      />
      <AuditLogsDetail />
    </div>
  );
}
