"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useCodeStore } from "../stores/codes.store";

interface CodesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Codes 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function CodesHeader({ onRefresh, onExport }: CodesHeaderProps) {
  const { openForm } = useCodeStore();

  return (
    <ListPageHeader
      title="코드관리"
      description="코드그룹 내의 개별 코드 정보를 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "코드 추가",
          icon: Plus,
          onClick: () => openForm(),
          variant: "default",
        },
        {
          label: "내보내기",
          icon: Download,
          onClick: () => onExport?.(),
          variant: "outline",
        },
      ]}
    />
  );
}
