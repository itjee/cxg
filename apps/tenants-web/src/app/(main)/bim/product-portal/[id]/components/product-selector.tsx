'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  sku: string;
  name: string;
  family?: string;
}

interface ProductSelectorProps {
  currentProductId: string;
  currentProductName: string;
  onSelectProduct: (id: string, name: string) => void;
  recentProducts?: Product[];
}

// 모의 제품 목록 데이터
const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'WM-001-BLK',
    name: '무선 센서 모듈 V2.3',
    family: 'IoT 센서',
  },
  {
    id: '2',
    sku: 'WM-002-WHT',
    name: '무선 센서 모듈 V2.4',
    family: 'IoT 센서',
  },
  {
    id: '3',
    sku: 'AP-001-BLK',
    name: 'AP 게이트웨이',
    family: '네트워크 장비',
  },
  {
    id: '4',
    sku: 'AP-002-WHT',
    name: 'AP 게이트웨이 Pro',
    family: '네트워크 장비',
  },
  {
    id: '5',
    sku: 'USB-001-BLK',
    name: 'USB 동글 라이트',
    family: '액세서리',
  },
  {
    id: '6',
    sku: 'USB-002-BLK',
    name: 'USB 동글 프로',
    family: '액세서리',
  },
  {
    id: '7',
    sku: 'BAT-001-BLK',
    name: '배터리 팩 2000mAh',
    family: '배터리',
  },
  {
    id: '8',
    sku: 'BAT-002-BLK',
    name: '배터리 팩 5000mAh',
    family: '배터리',
  },
];

export function ProductSelector({
  currentProductId,
  currentProductName,
  onSelectProduct,
  recentProducts = [],
}: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 최근 제품 (로컬스토리지에서 가져옴)
  const recentProductIds = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('recentProducts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // 필터링된 제품 목록
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // 최근 제품 목록
  const recentList = useMemo(() => {
    return mockProducts
      .filter((p) => recentProductIds.includes(p.id) && p.id !== currentProductId)
      .slice(0, 5);
  }, [recentProductIds, currentProductId]);

  const handleSelectProduct = (id: string, name: string) => {
    // 최근 제품에 추가
    const updated = [id, ...recentProductIds.filter((pid: string) => pid !== id)].slice(0, 10);
    localStorage.setItem('recentProducts', JSON.stringify(updated));

    onSelectProduct(id, name);
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
                  placeholder="제품 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            </div>

            {/* 최근 제품 */}
            {recentList.length > 0 && searchQuery === '' && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    최근 제품
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {recentList.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id, product.name)}
                      className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <span className="text-xs text-muted-foreground">{product.sku}</span>
                      </div>
                      {product.family && (
                        <p className="text-xs text-muted-foreground mt-0.5">{product.family}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 제품 목록 */}
            <div className={cn(
              'max-h-64 overflow-y-auto',
              searchQuery === '' && recentList.length > 0 && 'border-t'
            )}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id, product.name)}
                    className={cn(
                      'px-3 py-2 hover:bg-muted cursor-pointer transition-colors text-sm border-b last:border-b-0',
                      product.id === currentProductId && 'bg-primary/10 border-primary/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        'font-medium',
                        product.id === currentProductId ? 'text-primary' : 'text-foreground'
                      )}>
                        {product.name}
                      </p>
                      <span className="text-xs text-muted-foreground">{product.sku}</span>
                    </div>
                    {product.family && (
                      <p className="text-xs text-muted-foreground mt-0.5">{product.family}</p>
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
              총 {mockProducts.length}개 제품
            </div>
          </div>
        </>
      )}
    </div>
  );
}
