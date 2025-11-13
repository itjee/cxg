"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { usePermissionsStore } from "../stores/permissions.store";

interface PermissionsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function PermissionsHeader({ onRefresh, onExport }: PermissionsHeaderProps) {
  const { openForm } = usePermissionsStore();

  const actions = [
    ...(onRefresh ? [{ label: "새로고침", icon: RefreshCw, onClick: onRefresh, variant: "outline" as const }] : []),
    { label: "permission 추가", icon: Plus, onClick: () => openForm(), variant: "default" as const },
    ...(onExport ? [{ label: "내보내기", icon: Download, onClick: onExport, variant: "outline" as const }] : []),
  ];

  return <ListPageHeader title="permission 관리" description="플랫폼 permission를 관리합니다" actions={actions} />;
}
