import { Plus, RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { useCompliancesStore } from "../stores/compliances.store";

interface CompliancesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function CompliancesHeader({ onRefresh, onExport }: CompliancesHeaderProps) {
  const { openForm } = useCompliancesStore();

  const actions = [
    ...(onRefresh ? [{
      label: '새로고침',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline' as const,
    }] : []),
    {
          label: "보고서 생성",
          icon: Plus,
          onClick: () => openForm(),
          variant: "default",
        },
    {
          label: "내보내기",
          icon: Download,
          onClick: onExport,
          variant: "outline",
        },
  ];


  return (
    <PageHeader
      title="컴플라이언스 보고서"
      description="GDPR, SOX, HIPAA 등 규정 준수 보고서를 관리합니다"
      actions={actions}
    />
  );
}
