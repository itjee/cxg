"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { usePermissionsStore } from "../stores/permissions.store";

interface PermissionsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function PermissionsHeader({
  onRefresh,
  onExport,
}: PermissionsHeaderProps) {
  const { openForm } = usePermissionsStore();

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
      label: "권한 추가",
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
      title="권한 관리"
      description="플랫폼 권한을 관리합니다"
      actions={actions}
    />
  );
}
