'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useTaxInvoicesStore } from '../stores';

interface TaxInvoicesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function TaxInvoicesHeader({ onRefresh, onExport }: TaxInvoicesHeaderProps) {
  const { openForm } = useTaxInvoicesStore();

  return (
    <ListPageHeader
      title="세금계산서 관리"
      description="세금계산서 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '세금계산서 추가',
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
