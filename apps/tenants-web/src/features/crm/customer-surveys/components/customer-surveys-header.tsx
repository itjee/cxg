'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useCustomerSurveysStore } from '../stores';

interface CustomerSurveysHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function CustomerSurveysHeader({ onRefresh, onExport }: CustomerSurveysHeaderProps) {
  const { openForm } = useCustomerSurveysStore();

  return (
    <ListPageHeader
      title="고객 설문 관리"
      description="고객 설문 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '고객 설문 추가',
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
