"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useCurrencyStore } from "../stores";

interface CurrenciesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Currencies 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function CurrenciesHeader({
  onRefresh,
  onExport,
}: CurrenciesHeaderProps) {
  const { openForm } = useCurrencyStore();

  return (
    <ListPageHeader
      title="통화 관리"
      description="국가별 통화 정보를 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "통화 추가",
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
