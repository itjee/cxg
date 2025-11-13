"use client";

import { toast } from "sonner";
import {
  CompliancesHeader,
  CompliancesStats,
  CompliancesFilters,
  CompliancesTable,
  CompliancesEdit,
  CompliancesDetail,
} from "@/features/audt/compliances";
import { useCompliances } from "@/features/audt/compliances/hooks/use-compliances";
import { useCompliancesStore } from "@/features/audt/compliances/stores/compliances.store";
import { complianceService } from "@/features/audt/compliances/services/compliances.service";

export default function CompliancesPage() {
  const {
    globalFilter,
    selectedReportType,
    selectedComplianceStatus,
    selectedStatus,
    selectedScope,
    currentPage,
    itemsPerPage,
    openDetail,
  } = useCompliancesStore();

  const {
    data: compliancesResponse,
    isLoading,
    error,
    refetch,
  } = useCompliances({
    page: currentPage + 1,
    pageSize: itemsPerPage,
    search: globalFilter,
    report_type: selectedReportType || undefined,
    compliance_status: selectedComplianceStatus || undefined,
    status: selectedStatus || undefined,
    scope: selectedScope || undefined,
  });

  const compliances = compliancesResponse?.items || [];

  const handleRefresh = () => {
    refetch();
    toast.success("데이터를 새로고침했습니다");
  };

  const handleExport = () => {
    toast.info("내보내기 기능은 준비 중입니다");
  };

  const handleDownload = async (compliance: any) => {
    try {
      const blob = await complianceService.downloadReport(compliance.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${compliance.report_name}.${compliance.file_type.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("보고서를 다운로드했습니다");
    } catch (error) {
      toast.error("다운로드 실패");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className="space-y-6">
      <CompliancesHeader onRefresh={handleRefresh} onExport={handleExport} />
      <CompliancesStats data={compliances} />
      <CompliancesFilters data={compliances} />
      <CompliancesTable
        data={compliances}
        onViewDetails={(compliance) => openDetail(compliance.id)}
        onDownload={handleDownload}
      />
      <CompliancesEdit />
      <CompliancesDetail />
    </div>
  );
}
