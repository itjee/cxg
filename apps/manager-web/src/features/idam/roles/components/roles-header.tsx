"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useRolesStore } from "../stores/roles.store";

interface RolesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function RolesHeader({ onRefresh, onExport }: RolesHeaderProps) {
  const { openForm } = useRolesStore();

  const actions = [
    ...(onRefresh ? [{ label: "새로고침", icon: RefreshCw, onClick: onRefresh, variant: "outline" as const }] : []),
    { label: "role 추가", icon: Plus, onClick: () => openForm(), variant: "default" as const },
    ...(onExport ? [{ label: "내보내기", icon: Download, onClick: onExport, variant: "outline" as const }] : []),
  ];

  return <ListPageHeader title="role 관리" description="플랫폼 role를 관리합니다" actions={actions} />;
}
