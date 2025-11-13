'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useSalesAnalyticsStore } from '../stores';

interface SalesAnalyticsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function SalesAnalyticsHeader({ onRefresh, onExport }: SalesAnalyticsHeaderProps) {
  const { openForm } = useSalesAnalyticsStore();

  return (
    <ListPageHeader
      title="영업 분석 관리"
      description="영업 분석 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '영업 분석 추가',
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
