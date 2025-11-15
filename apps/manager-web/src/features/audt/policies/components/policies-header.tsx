import { Plus, RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { usePoliciesStore } from "../stores/policies.store";

interface PoliciesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function PoliciesHeader({ onRefresh, onExport }: PoliciesHeaderProps) {
  const { openForm } = usePoliciesStore();

  const actions = [
    ...(onRefresh ? [{
      label: '새로고침',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline' as const,
    }] : []),
    {
          label: "정책 생성",
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
      title="보안 정책"
      description="시스템 보안 정책을 정의하고 관리합니다"
      actions={actions}
    />
  );
}
