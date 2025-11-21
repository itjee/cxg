"use client";

/**
 * @file sessions-header.tsx
 * @description 사용자 관리 페이지 헤더 컴포넌트
 *
 * PageHeader 컴포넌트를 사용하여 페이지 제목과 주요 액션 버튼을 제공합니다.
 * - 새로고침 버튼
 * - 사용자 추가 버튼
 * - 내보내기 버튼 (선택)
 */

import { Plus, RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { useSessionsStore } from "../stores/sessions.store";

interface SessionHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function SessionsHeader({ onRefresh, onExport }: SessionHeaderProps) {
  const { openForm } = useSessionsStore();

  const actions = [
    ...(onRefresh
      ? [
          {
            id: "refresh",
            label: "새로고침",
            icon: RefreshCw,
            onClick: onRefresh,
            variant: "outline" as const,
          },
        ]
      : []),
    {
      id: "add",
      label: "사용자 추가",
      icon: Plus,
      onClick: () => openForm(),
      variant: "default" as const,
    },
    ...(onExport
      ? [
          {
            id: "export",
            label: "내보내기",
            icon: Download,
            onClick: onExport,
            variant: "outline" as const,
          },
        ]
      : []),
  ];

  return (
    <PageHeader
      title="사용자 관리"
      description="플랫폼 사용자를 관리합니다"
      actions={actions}
    />
  );
}
