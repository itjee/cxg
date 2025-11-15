"use client";

/**
 * @file tasks-header.tsx
 * @description 스케줄된 작업 페이지 헤더
 */

import { Plus, RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { useTasksStore } from "../stores";

interface TasksHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function TasksHeader({ onRefresh, onExport }: TasksHeaderProps) {
  const { openForm } = useTasksStore();

  const actions = [
    ...(onRefresh ? [{
      label: '새로고침',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline' as const,
    }] : []),
    {
          label: "작업 추가",
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
      title="스케줄된 작업 관리"
      description="정기적으로 실행되는 시스템 작업을 관리합니다"
      actions={actions}
    />
  );
}
