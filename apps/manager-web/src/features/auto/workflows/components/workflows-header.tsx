"use client";

/**
 * @file workflows-header.tsx
 * @description 워크플로우 관리 페이지 헤더 컴포넌트
 */

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useWorkflowsStore } from "../stores/workflows.store";

interface WorkflowsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * 워크플로우 관리 페이지 헤더 컴포넌트
 */
export function WorkflowsHeader({ onRefresh, onExport }: WorkflowsHeaderProps) {
  const { openForm } = useWorkflowsStore();

  const actions = [
    {
      label: "새로고침",
      icon: RefreshCw,
      onClick: onRefresh,
      variant: "outline" as const,
    },
    {
      label: "워크플로우 추가",
      icon: Plus,
      onClick: () => openForm(),
      variant: "default" as const,
    },
    ...(onExport
      ? [
          {
            label: "내보내기",
            icon: Download,
            onClick: onExport,
            variant: "outline" as const,
          },
        ]
      : []),
  ];

  return (
    <ListPageHeader
      title="워크플로우 관리"
      description="자동화 워크플로우를 생성하고 관리합니다"
      actions={actions}
    />
  );
}
