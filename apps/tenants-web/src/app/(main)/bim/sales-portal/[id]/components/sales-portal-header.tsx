'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import { SalespersonSelector } from './salesperson-selector';

interface SalesPortalHeaderProps {
  salesperson: {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  onNewOpportunity?: () => void;
  onNewActivity?: () => void;
}

export function SalesPortalHeader({
  salesperson,
  onNewOpportunity,
  onNewActivity,
}: SalesPortalHeaderProps) {
  const router = useRouter();

  const handleSelectSalesperson = (id: string, name: string) => {
    router.push(`/bim/sales-portal/${id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침입니다';
    if (hour < 18) return '좋은 오후입니다';
    return '좋은 저녁입니다';
  };

  return (
    <div>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* 좌측: 사용자 정보 */}
          <div className="flex items-center gap-4">
            {/* 아바타 */}
            {salesperson.avatar ? (
              <img
                src={salesperson.avatar}
                alt={salesperson.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-200 dark:border-blue-800">
                {getInitials(salesperson.name)}
              </div>
            )}

            {/* 텍스트 정보 */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {getGreeting()}, {salesperson.name}님
                </h1>
                <SalespersonSelector
                  currentSalespersonId={salesperson.id}
                  currentSalespersonName={salesperson.name}
                  onSelectSalesperson={handleSelectSalesperson}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {salesperson.department} · {salesperson.position}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <a href={`mailto:${salesperson.email}`} className="hover:text-blue-600">
                  {salesperson.email}
                </a>
                <a href={`tel:${salesperson.phone}`} className="hover:text-blue-600">
                  {salesperson.phone}
                </a>
              </div>
            </div>
          </div>

          {/* 우측: 액션 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onNewOpportunity}
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">기회 추가</span>
            </Button>
            <Button
              onClick={onNewActivity}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">활동 기록</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 하단 상태 라인 */}
        <div className="mt-6 space-y-6">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">
              마지막 로그인: 오늘 14:32
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-500 font-medium">온라인 상태</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
