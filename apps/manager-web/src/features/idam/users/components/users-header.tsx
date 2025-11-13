"use client";

/**
 * @file users-header.tsx
 * @description 사용자 관리 페이지 헤더 컴포넌트
 * 
 * ListPageHeader 컴포넌트를 사용하여 페이지 제목과 주요 액션 버튼을 제공합니다.
 * - 새로고침 버튼
 * - 사용자 추가 버튼
 * - 내보내기 버튼 (선택)
 */

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useUsersStore } from "../stores/users.store";

interface UsersHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function UsersHeader({ onRefresh, onExport }: UsersHeaderProps) {
  const { openForm } = useUsersStore();

  const actions = [
    ...(onRefresh ? [{ label: "새로고침", icon: RefreshCw, onClick: onRefresh, variant: "outline" as const }] : []),
    { label: "사용자 추가", icon: Plus, onClick: () => openForm(), variant: "default" as const },
    ...(onExport ? [{ label: "내보내기", icon: Download, onClick: onExport, variant: "outline" as const }] : []),
  ];

  return <ListPageHeader title="사용자 관리" description="플랫폼 사용자를 관리합니다" actions={actions} />;
}
