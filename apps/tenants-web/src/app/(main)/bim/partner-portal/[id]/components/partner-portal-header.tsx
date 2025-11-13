'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PartnerSelector } from './partner-selector';

interface PartnerPortalHeaderProps {
  partner: {
    id: string;
    code: string;
    name: string;
    type: 'supplier' | 'customer' | 'both';
    tier?: string;
    industry?: string;
    address?: string;
    tel?: string;
    email?: string;
    accountOwner?: string;
    logo?: string;
    englishName?: string;
    bizNo?: string;
    website?: string;
    annualRevenue?: number;
    establishedYear?: number;
    employees?: number;
    creditLimit?: number;
  };
  onBack?: () => void;
  onNewOpportunity?: () => void;
  onNewServiceRequest?: () => void;
  onLogActivity?: () => void;
  getLogoDisplay?: () => React.ReactNode;
}

const getTypeColor = (type?: string) => {
  switch (type) {
    case 'supplier':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'customer':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'both':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'supplier':
      return '공급사';
    case 'customer':
      return '고객사';
    case 'both':
      return '공급사/고객사';
    default:
      return type;
  }
};

const getInitials = (name: string) => {
  // "(주)" 제외하고 초성 추출
  const cleanName = name.replace(/\(주\)/g, '').trim();
  return cleanName
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function PartnerPortalHeader({
  partner,
  onBack,
  onNewOpportunity,
  onNewServiceRequest,
  onLogActivity,
  getLogoDisplay,
}: PartnerPortalHeaderProps) {
  const router = useRouter();
  const logoDisplay = getLogoDisplay ? getLogoDisplay() : null;

  const handleSelectPartner = (id: string, name: string) => {
    router.push(`/bim/partner-portal/${id}`);
  };

  return (
    <div>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* 좌측: 거래처 정보 */}
          <div className="flex items-center gap-4">
            {/* 뒤로가기 버튼 */}
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-10 w-10 flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            {/* 로고 이미지 또는 아이콘 */}
            {logoDisplay ? (
              <div className="flex-shrink-0">
                {logoDisplay}
              </div>
            ) : (
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white border-2 border-blue-200 dark:border-blue-800 flex-shrink-0">
                <span className="text-lg font-bold">{getInitials(partner.name)}</span>
              </div>
            )}

            {/* 텍스트 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {partner.name}
                </h1>
                <PartnerSelector
                  currentPartnerId={partner.id}
                  currentPartnerName={partner.name}
                  onSelectPartner={handleSelectPartner}
                />
                {partner.tier && (
                  <Badge
                    variant="outline"
                    className={cn('text-xs font-medium', 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400')}
                  >
                    {partner.tier}
                  </Badge>
                )}
                {partner.type && (
                  <Badge
                    variant="outline"
                    className={cn('text-xs font-medium', getTypeColor(partner.type))}
                  >
                    {getTypeLabel(partner.type)}
                  </Badge>
                )}
                {partner.industry && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {partner.industry}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {partner.code}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {partner.address && <span>{partner.address}</span>}
                {partner.email && (
                  <a href={`mailto:${partner.email}`} className="hover:text-blue-600">
                    {partner.email}
                  </a>
                )}
                {partner.tel && (
                  <a href={`tel:${partner.tel}`} className="hover:text-blue-600">
                    {partner.tel}
                  </a>
                )}
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
              <span className="hidden sm:inline">기회</span>
            </Button>
            <Button
              onClick={onNewServiceRequest}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">요청</span>
            </Button>
            <Button
              onClick={onLogActivity}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">활동</span>
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
              {partner.accountOwner && `담당 영업사원: ${partner.accountOwner}`}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-500 font-medium">활성</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
