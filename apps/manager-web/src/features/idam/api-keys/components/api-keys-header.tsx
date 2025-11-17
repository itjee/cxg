"use client";

/**
 * @file api-keys-header.tsx
 * @description API 키 관리 페이지 헤더 컴포넌트
 *
 * PageHeader 컴포넌트를 사용하여 페이지 제목과 주요 액션 버튼을 제공합니다.
 * - 새로고침 버튼
 * - API 키 추가 버튼
 */

import { Plus, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { useApiKeysStore } from "../stores/api-keys.store";

interface ApiKeysHeaderProps {
  onRefresh?: () => void;
}

export function ApiKeysHeader({ onRefresh }: ApiKeysHeaderProps) {
  const { openForm } = useApiKeysStore();

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
      label: "API 키 추가",
      icon: Plus,
      onClick: () => openForm(),
      variant: "default" as const,
    },
  ];

  return (
    <PageHeader
      title="API 키 관리"
      description="API 키를 생성하고 관리합니다"
      actions={actions}
    />
  );
}
