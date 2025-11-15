"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";
import { useTransactionStore } from "../stores";

interface TransactionHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function TransactionHeader({ onRefresh, onExport }: TransactionHeaderProps) {
  const { openForm } = useTransactionStore();

  return (
    <PageHeader
      title="거래 관리"
      description="결제 거래를 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "거래 생성",
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
