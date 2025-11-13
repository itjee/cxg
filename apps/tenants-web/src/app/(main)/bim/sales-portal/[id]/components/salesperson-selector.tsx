'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Salesperson {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface SalespersonSelectorProps {
  currentSalespersonId: string;
  currentSalespersonName: string;
  onSelectSalesperson: (id: string, name: string) => void;
  recentSalespeople?: Salesperson[];
}

// 모의 영업사원 목록 데이터
const mockSalespeople: Salesperson[] = [
  {
    id: '1',
    name: '김영업',
    position: '과장',
    department: '영업팀',
  },
  {
    id: '2',
    name: '이판매',
    position: '대리',
    department: '영업팀',
  },
  {
    id: '3',
    name: '박세일',
    position: '사원',
    department: '영업팀',
  },
  {
    id: '4',
    name: '정트레이드',
    position: '과장',
    department: '외시장팀',
  },
  {
    id: '5',
    name: '최커머셜',
    position: '대리',
    department: '외시장팀',
  },
  {
    id: '6',
    name: '황비즈',
    position: '사원',
    department: '외시장팀',
  },
  {
    id: '7',
    name: '송솔루션',
    position: '과장',
    department: '솔루션팀',
  },
  {
    id: '8',
    name: '윤마케팅',
    position: '대리',
    department: '솔루션팀',
  },
];

export function SalespersonSelector({
  currentSalespersonId,
  currentSalespersonName,
  onSelectSalesperson,
  recentSalespeople = [],
}: SalespersonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 최근 영업사원 (로컬스토리지에서 가져옴)
  const recentSalespersonIds = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('recentSalespeople');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // 필터링된 영업사원 목록
  const filteredSalespeople = useMemo(() => {
    return mockSalespeople.filter((salesperson) =>
      salesperson.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salesperson.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // 최근 영업사원 목록
  const recentList = useMemo(() => {
    return mockSalespeople
      .filter((p) => recentSalespersonIds.includes(p.id) && p.id !== currentSalespersonId)
      .slice(0, 5);
  }, [recentSalespersonIds, currentSalespersonId]);

  const handleSelectSalesperson = (id: string, name: string) => {
    // 최근 영업사원에 추가
    const updated = [id, ...recentSalespersonIds.filter((pid: string) => pid !== id)].slice(0, 10);
    localStorage.setItem('recentSalespeople', JSON.stringify(updated));

    onSelectSalesperson(id, name);
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
                  placeholder="영업사원 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>

            {/* 최근 영업사원 */}
            {recentList.length > 0 && searchQuery === '' && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    최근 영업사원
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {recentList.map((salesperson) => (
                    <div
                      key={salesperson.id}
                      onClick={() => handleSelectSalesperson(salesperson.id, salesperson.name)}
                      className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{salesperson.name}</p>
                        <span className="text-xs text-muted-foreground">{salesperson.position}</span>
                      </div>
                      {salesperson.department && (
                        <p className="text-xs text-muted-foreground mt-0.5">{salesperson.department}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 영업사원 목록 */}
            <div className={cn(
              'max-h-64 overflow-y-auto',
              searchQuery === '' && recentList.length > 0 && 'border-t'
            )}>
              {filteredSalespeople.length > 0 ? (
                filteredSalespeople.map((salesperson) => (
                  <div
                    key={salesperson.id}
                    onClick={() => handleSelectSalesperson(salesperson.id, salesperson.name)}
                    className={cn(
                      'px-3 py-2 hover:bg-muted cursor-pointer transition-colors text-sm border-b last:border-b-0',
                      salesperson.id === currentSalespersonId && 'bg-primary/10 border-primary/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        'font-medium',
                        salesperson.id === currentSalespersonId ? 'text-primary' : 'text-foreground'
                      )}>
                        {salesperson.name}
                      </p>
                      <span className="text-xs text-muted-foreground">{salesperson.position}</span>
                    </div>
                    {salesperson.department && (
                      <p className="text-xs text-muted-foreground mt-0.5">{salesperson.department}</p>
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
              총 {mockSalespeople.length}명 영업사원
            </div>
          </div>
        </>
      )}
    </div>
  );
}
