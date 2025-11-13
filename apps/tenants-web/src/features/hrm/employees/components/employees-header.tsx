'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useEmployeeStore } from '../stores';

interface EmployeesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Employees 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function EmployeesHeader({ onRefresh, onExport }: EmployeesHeaderProps) {
  const { openForm } = useEmployeeStore();

  return (
    <ListPageHeader
      title="직원 관리"
      description="직원 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '직원 추가',
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

