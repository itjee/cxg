'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  code: string;
  name: string;
  type: 'supplier' | 'customer' | 'both';
  tier?: string;
}

interface PartnerSelectorProps {
  currentPartnerId: string;
  currentPartnerName: string;
  onSelectPartner: (id: string, name: string) => void;
  recentPartners?: Partner[];
}

// 모의 거래처 목록 데이터
const mockPartners: Partner[] = [
  {
    id: '1',
    code: 'CUST_001',
    name: 'ABC고객사',
    type: 'customer',
    tier: '우수',
  },
  {
    id: '2',
    code: 'CUST_002',
    name: '삼성전자',
    type: 'customer',
    tier: '우수',
  },
  {
    id: '3',
    code: 'CUST_003',
    name: 'LG전자',
    type: 'customer',
    tier: '일반',
  },
  {
    id: '4',
    code: 'SUPP_001',
    name: '(주)부품공급사',
    type: 'supplier',
    tier: '협력사',
  },
  {
    id: '5',
    code: 'SUPP_002',
    name: 'CJ제일제당',
    type: 'customer',
    tier: '우수',
  },
  {
    id: '6',
    code: 'SUPP_003',
    name: '현대자동차',
    type: 'customer',
    tier: '우수',
  },
  {
    id: '7',
    code: 'SUPP_004',
    name: 'SK하이닉스',
    type: 'customer',
    tier: '일반',
  },
  {
    id: '8',
    code: 'SUPP_005',
    name: '넥슨',
    type: 'customer',
    tier: '일반',
  },
];

export function PartnerSelector({
  currentPartnerId,
  currentPartnerName,
  onSelectPartner,
  recentPartners = [],
}: PartnerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 최근 거래처 (로컬스토리지에서 가져옴)
  const recentPartnerIds = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('recentPartners');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // 필터링된 거래처 목록
  const filteredPartners = useMemo(() => {
    return mockPartners.filter((partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // 최근 거래처 목록
  const recentList = useMemo(() => {
    return mockPartners
      .filter((p) => recentPartnerIds.includes(p.id) && p.id !== currentPartnerId)
      .slice(0, 5);
  }, [recentPartnerIds, currentPartnerId]);

  const handleSelectPartner = (id: string, name: string) => {
    // 최근 거래처에 추가
    const updated = [id, ...recentPartnerIds.filter((pid: string) => pid !== id)].slice(0, 10);
    localStorage.setItem('recentPartners', JSON.stringify(updated));

    onSelectPartner(id, name);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 px-2"
      >
        <span className="text-xs text-muted-foreground">변경</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 드롭다운 메뉴 */}
          <div className="absolute top-10 right-0 w-72 bg-card border border-border rounded-lg shadow-lg z-50">
            {/* 검색 입력 */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="거래처 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>

            {/* 최근 거래처 */}
            {recentList.length > 0 && searchQuery === '' && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    최근 거래처
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {recentList.map((partner) => (
                    <div
                      key={partner.id}
                      onClick={() => handleSelectPartner(partner.id, partner.name)}
                      className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{partner.name}</p>
                        <span className="text-xs text-muted-foreground">{partner.code}</span>
                      </div>
                      {partner.tier && (
                        <p className="text-xs text-muted-foreground mt-0.5">{partner.tier}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 거래처 목록 */}
            <div className={cn(
              'max-h-64 overflow-y-auto',
              searchQuery === '' && recentList.length > 0 && 'border-t'
            )}>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => handleSelectPartner(partner.id, partner.name)}
                    className={cn(
                      'px-3 py-2 hover:bg-muted cursor-pointer transition-colors text-sm border-b last:border-b-0',
                      partner.id === currentPartnerId && 'bg-primary/10'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        'font-medium',
                        partner.id === currentPartnerId ? 'text-primary' : 'text-foreground'
                      )}>
                        {partner.name}
                      </p>
                      <span className="text-xs text-muted-foreground">{partner.code}</span>
                    </div>
                    {partner.tier && (
                      <p className="text-xs text-muted-foreground mt-0.5">{partner.tier}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  검색 결과가 없습니다
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="px-3 py-2 border-t text-xs text-muted-foreground text-center bg-muted/30">
              총 {mockPartners.length}개 거래처
            </div>
          </div>
        </>
      )}
    </div>
  );
}
