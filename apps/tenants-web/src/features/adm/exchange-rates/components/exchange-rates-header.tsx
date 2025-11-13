"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useExchangeRatesStore } from "../stores/exchange-rates.store";

interface ExchangeRatesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * ExchangeRates 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function ExchangeRatesHeader({
  onRefresh,
  onExport,
}: ExchangeRatesHeaderProps) {
  const { openSidebar } = useExchangeRatesStore();

  return (
    <ListPageHeader
      title="환율관리"
      description="통화별 환율 정보를 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "환율 추가",
          icon: Plus,
          onClick: () => openSidebar(),
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
