'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useAccountsPayableStore } from '../stores';

interface AccountsPayableHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function AccountsPayableHeader({ onRefresh, onExport }: AccountsPayableHeaderProps) {
  const { openForm } = useAccountsPayableStore();

  return (
    <ListPageHeader
      title="매입채무 관리"
      description="매입채무 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '매입채무 추가',
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
