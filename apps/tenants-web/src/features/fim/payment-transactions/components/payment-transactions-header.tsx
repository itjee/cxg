'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { usePaymentTransactionsStore } from '../stores';

interface PaymentTransactionsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function PaymentTransactionsHeader({ onRefresh, onExport }: PaymentTransactionsHeaderProps) {
  const { openForm } = usePaymentTransactionsStore();

  return (
    <ListPageHeader
      title="지급 거래 관리"
      description="지급 거래 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '지급 거래 추가',
          icon: Plus,
          onClick: () => openForm(),
          variant: 'default',
        },
        {
          label: '내보내기',
          icon: Download,
          onClick: () => onExport?.(),
          variant: 'outline',
        },
      ]}
    />
  );
}
