'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useAccountsReceivableStore } from '../stores';

interface AccountsReceivableHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function AccountsReceivableHeader({ onRefresh, onExport }: AccountsReceivableHeaderProps) {
  const { openForm } = useAccountsReceivableStore();

  return (
    <ListPageHeader
      title="매출채권 관리"
      description="매출채권 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '매출채권 추가',
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
