"use client";

import { RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";

interface AuditLogsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function AuditLogsHeader({ onRefresh, onExport }: AuditLogsHeaderProps) {
  const actions = [
    ...(onRefresh ? [{
      label: "새로고침",
      icon: RefreshCw,
      onClick: onRefresh,
      variant: "outline" as const,
    }] : []),
    ...(onExport ? [{
      label: "내보내기",
      icon: Download,
      onClick: onExport,
      variant: "outline" as const,
    }] : []),
  ];

  return (
    <PageHeader
      title="감사 로그"
      description="시스템 변경 및 주요 작업 기록을 확인합니다"
      actions={actions}
    />
  );
}
