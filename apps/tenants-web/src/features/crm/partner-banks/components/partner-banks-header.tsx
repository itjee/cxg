'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { usePartnerBanksStore } from '../stores';

interface PartnerBanksHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function PartnerBanksHeader({ onRefresh, onExport }: PartnerBanksHeaderProps) {
  const { openForm } = usePartnerBanksStore();

  return (
    <ListPageHeader
      title="거래처 은행 관리"
      description="거래처 은행 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '거래처 은행 추가',
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
