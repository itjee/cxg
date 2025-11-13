'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useAssetDepreciationStore } from '../stores';

interface AssetDepreciationHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function AssetDepreciationHeader({ onRefresh, onExport }: AssetDepreciationHeaderProps) {
  const { openForm } = useAssetDepreciationStore();

  return (
    <ListPageHeader
      title="감가상각 관리"
      description="감가상각 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '감가상각 추가',
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
