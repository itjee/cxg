'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useAccountsStore } from '../stores';

interface AccountsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function AccountsHeader({ onRefresh, onExport }: AccountsHeaderProps) {
  const { openForm } = useAccountsStore();

  return (
    <ListPageHeader
      title="계정과목 관리"
      description="계정과목 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '계정과목 추가',
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
