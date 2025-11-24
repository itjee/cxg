"use client";

/**
 * @file tenants-header.tsx
 * @description 테넌트 관리 페이지 헤더 컴포넌트
 *
 * PageHeader 컴포넌트를 사용하여 페이지 제목과 주요 액션 버튼을 제공합니다.
 * - 새로고침 버튼
 * - 테넌트 추가 버튼
 * - 내보내기 버튼 (선택)
 */

import { useState } from "react";
import { Plus, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layouts/page-header";
import { useTenantsStore } from "../stores/tenants.store";

interface TenantsHeaderProps {
  onRefresh?: () => Promise<void> | void;
  onExport?: () => void;
}

export function TenantsHeader({ onRefresh, onExport }: TenantsHeaderProps) {
  const { openForm } = useTenantsStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const loadingToast = toast.loading("데이터를 조회 중입니다...");
    try {
      await onRefresh?.();
      toast.dismiss(loadingToast);
      toast.success("데이터가 갱신되었습니다");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("데이터 조회에 실패했습니다");
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const actions = [
    ...(onRefresh
      ? [
          {
            id: "refresh",
            label: "새로고침",
            icon: RefreshCw,
            onClick: handleRefresh,
            variant: "outline" as const,
            disabled: isRefreshing,
          },
        ]
      : []),
    {
      id: "add",
      label: "테넌트 추가",
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
      title="테넌트 관리"
      description="플랫폼 테넌트를 관리합니다"
      actions={actions}
    />
  );
}
