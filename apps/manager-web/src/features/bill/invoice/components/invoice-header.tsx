"use client";

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useInvoiceStore } from "../stores";

interface InvoiceHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function InvoiceHeader({ onRefresh, onExport }: InvoiceHeaderProps) {
  const { openForm } = useInvoiceStore();

  return (
    <ListPageHeader
      title="청구서 관리"
      description="테넌트별 청구서를 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "청구서 생성",
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
