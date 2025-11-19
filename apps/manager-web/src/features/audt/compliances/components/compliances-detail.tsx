import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useCompliancesStore } from "../stores/compliances.store";
import { useCompliance } from "../hooks/use-compliances";
import type { 
  ReportType, 
  ComplianceStatus, 
  ReportStatus,
  ReportScope,
  FileType 
} from "../types/compliances.types";

const reportTypeLabels: Record<ReportType, string> = {
  GDPR: "GDPR",
  SOX: "SOX",
  HIPAA: "HIPAA",
  ISO27001: "ISO27001",
  PCI_DSS: "PCI-DSS",
  CCPA: "CCPA",
  CUSTOM: "맞춤형",
};

const complianceStatusColors: Record<ComplianceStatus, string> = {
  COMPLIANT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  NON_COMPLIANT: "bg-red-500/10 text-red-600",
  PARTIAL: "bg-orange-500/10 text-orange-600",
  PENDING: "bg-blue-500/10 text-blue-600",
};

const complianceStatusLabels: Record<ComplianceStatus, string> = {
  COMPLIANT: "준수",
  NON_COMPLIANT: "미준수",
  PARTIAL: "부분준수",
  PENDING: "검토중",
};

const statusColors: Record<ReportStatus, string> = {
  DRAFT: "bg-gray-500/10 text-gray-600",
  PENDING_REVIEW: "bg-blue-500/10 text-blue-600",
  APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  PUBLISHED: "bg-purple-500/10 text-purple-600",
};

const statusLabels: Record<ReportStatus, string> = {
  DRAFT: "초안",
  PENDING_REVIEW: "검토대기",
  APPROVED: "승인완료",
  PUBLISHED: "공개됨",
};

const scopeLabels: Record<ReportScope, string> = {
  ALL_TENANTS: "전체 테넌트",
  SPECIFIC_TENANT: "특정 테넌트",
  SYSTEM_WIDE: "시스템 전체",
};

const fileTypeLabels: Record<FileType, string> = {
  PDF: "PDF",
  EXCEL: "Excel",
  JSON: "JSON",
  HTML: "HTML",
  CSV: "CSV",
};

export function CompliancesDetail() {
  const { detailId, closeDetail } = useCompliancesStore();
  const { data: compliance, isLoading } = useCompliance(detailId);

  if (!detailId) return null;
  if (isLoading) return <div>로딩 중...</div>;
  if (!compliance) return null;

  return (
    <Dialog open={!!detailId} onOpenChange={closeDetail}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>컴플라이언스 보고서 상세</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{compliance.report_name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                {reportTypeLabels[compliance.report_type]}
              </Badge>
              <Badge className={complianceStatusColors[compliance.compliance_status]}>
                {complianceStatusLabels[compliance.compliance_status]}
              </Badge>
              <Badge className={statusColors[compliance.status]}>
                {statusLabels[compliance.status]}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base text-muted-foreground">보고 기간</p>
              <p className="mt-1">
                {formatDate(compliance.start_date, "yyyy-MM-dd")} ~ {formatDate(compliance.close_date, "yyyy-MM-dd")}
              </p>
            </div>
            <div>
              <p className="text-base text-muted-foreground">생성일시</p>
              <p className="mt-1">{formatDate(compliance.generated_at, "yyyy-MM-dd HH:mm:ss")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base text-muted-foreground">적용 범위</p>
              <p className="mt-1">{scopeLabels[compliance.scope]}</p>
            </div>
            <div>
              <p className="text-base text-muted-foreground">파일 형식</p>
              <p className="mt-1">{fileTypeLabels[compliance.file_type]}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base text-muted-foreground">발견된 이슈</p>
              <p className="mt-1 text-3xl font-bold">{compliance.findings_count}</p>
            </div>
            <div>
              <p className="text-base text-muted-foreground">심각한 이슈</p>
              <p className="mt-1 text-3xl font-bold text-destructive">
                {compliance.critical_count}
              </p>
            </div>
          </div>

          {compliance.file_path && (
            <div>
              <p className="text-base text-muted-foreground">파일 경로</p>
              <code className="mt-1 block p-2 bg-muted rounded text-sm">
                {compliance.file_path}
              </code>
            </div>
          )}

          {compliance.file_size && (
            <div>
              <p className="text-base text-muted-foreground">파일 크기</p>
              <p className="mt-1">
                {(compliance.file_size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {compliance.approved_at && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-base text-muted-foreground">승인일시</p>
                <p className="mt-1">{formatDate(compliance.approved_at, "yyyy-MM-dd HH:mm:ss")}</p>
              </div>
              {compliance.approved_by && (
                <div>
                  <p className="text-base text-muted-foreground">승인자</p>
                  <p className="mt-1">{compliance.approved_by}</p>
                </div>
              )}
            </div>
          )}

          {compliance.tenant_ids && compliance.tenant_ids.length > 0 && (
            <div>
              <p className="text-base text-muted-foreground">대상 테넌트</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {compliance.tenant_ids.map((id) => (
                  <Badge key={id} variant="outline">
                    {id}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
