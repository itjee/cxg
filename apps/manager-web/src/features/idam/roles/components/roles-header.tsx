"use client";

/**
 * @file roles-header.tsx
 * @description 역할 관리 페이지 헤더 컴포넌트
 *
 * PageHeader 컴포넌트를 사용하여 페이지 제목과 주요 액션 버튼을 제공합니다.
 * - 새로고침 버튼
 * - 역할 추가 버튼
 * - 내보내기 버튼 (선택)
 */

import { Plus, RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { useRolesStore } from "../stores/roles.store";

interface RolesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function RolesHeader({ onRefresh, onExport }: RolesHeaderProps) {
  const { openForm } = useRolesStore();

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
      label: "역할 추가",
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
      title="역할 관리"
      description="플랫폼 역할을 관리합니다"
      actions={actions}
    />
  );
}
