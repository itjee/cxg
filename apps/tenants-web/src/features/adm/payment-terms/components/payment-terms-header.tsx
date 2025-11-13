"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { usePaymentTermStore } from "../stores/payment-term.store";

interface PaymentTermsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * PaymentTerms 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function PaymentTermsHeader({
  onRefresh,
  onExport,
}: PaymentTermsHeaderProps) {
  const { openSidebar } = usePaymentTermStore();

  return (
    <ListPageHeader
      title="결제조건관리"
      description="결제 조건 정보를 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "결제조건 추가",
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
