"use client";

/**
 * @file executions-header.tsx
 * @description 실행 이력 페이지 헤더
 */

import { RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";

interface ExecutionsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ExecutionsHeader({ 
  onRefresh, 
  onExport 
}: ExecutionsHeaderProps) {
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
      title="실행 이력 관리"
      description="워크플로우 실행 이력을 조회하고 관리합니다"
      actions={actions}
    />
  );
}
