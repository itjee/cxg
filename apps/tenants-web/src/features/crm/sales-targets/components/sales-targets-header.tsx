'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useSalesTargetsStore } from '../stores';

interface SalesTargetsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function SalesTargetsHeader({ onRefresh, onExport }: SalesTargetsHeaderProps) {
  const { openForm } = useSalesTargetsStore();

  return (
    <ListPageHeader
      title="영업 목표 관리"
      description="영업 목표 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '영업 목표 추가',
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
