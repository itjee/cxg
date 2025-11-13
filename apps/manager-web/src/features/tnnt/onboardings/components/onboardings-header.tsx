/**
 * @file onboardings-header.tsx
 * @description 온보딩 프로세스 페이지 헤더
 */

'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useOnboardingsStore } from '../stores';

interface OnboardingsHeaderProps {
  onRefresh?: () => void;
}

export function OnboardingsHeader({ onRefresh }: OnboardingsHeaderProps) {
  const { openForm } = useOnboardingsStore();

  const actions = [
    ...(onRefresh ? [{
      label: '새로고침',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline' as const,
    }] : []),
    {
      label: '온보딩 추가',
      icon: Plus,
      onClick: () => openForm(),
      variant: 'default' as const,
    },
  ];

  return (
    <ListPageHeader
      title="온보딩 프로세스 관리"
      description="테넌트 온보딩 프로세스를 관리합니다"
      actions={actions}
    />
  );
}
