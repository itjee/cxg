'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Tag, Target, Megaphone, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  sku: string;
  name: string;
  family?: string;
}

interface ProductPortalSidebarProps {
  productId?: string;
}

export function ProductPortalSidebar({
  productId,
}: ProductPortalSidebarProps) {
  const router = useRouter();

  // Mock 모든 제품 (product-selector와 동일한 데이터)
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

  // 최근 제품 가져오기
  const recentProductIds = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('recentProducts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // 최근 제품 목록 (현재 제품 제외, 최대 5개)
  const recentList = useMemo(() => {
    return mockProducts
      .filter((p) => recentProductIds.includes(p.id) && p.id !== productId)
      .slice(0, 5);
  }, [recentProductIds, productId]);

  const handleSelectProduct = (id: string) => {
    router.push(`/bim/product-portal/${id}`);
  };
  // 모의 가격표 데이터
  const priceBooks = [
    {
      id: '1',
      name: '기본 가격표 (국내)',
      listPrice: 850000,
      currency: 'KRW',
      effectiveDate: '2024-01-01',
      status: 'Active',
    },
    {
      id: '2',
      name: '국제 수출 가격표',
      listPrice: 750,
      currency: 'USD',
      effectiveDate: '2024-01-15',
      status: 'Active',
    },
    {
      id: '3',
      name: '대량 구매 할인',
      listPrice: 750000,
      currency: 'KRW',
      effectiveDate: '2024-03-01',
      status: 'Active',
    },
  ];

  // 모의 기회 데이터
  const opportunities = [
    {
      id: '1',
      accountName: 'SK C&C',
      opportunityName: 'IoT 프로젝트',
      amount: 50000000,
      probability: 85,
      stage: 'negotiation',
    },
    {
      id: '2',
      accountName: '삼성전자',
      opportunityName: '센서 모듈 공급',
      amount: 35000000,
      probability: 70,
      stage: 'proposal',
    },
    {
      id: '3',
      accountName: 'LG전자',
      opportunityName: '스마트홈 통합',
      amount: 25000000,
      probability: 55,
      stage: 'qualification',
    },
  ];

  // 모의 캠페인 데이터
  const campaigns = [
    {
      id: '1',
      name: '2024 Q4 신상품 런칭',
      type: 'Product Launch',
      status: 'Active',
      budget: 10000000,
      roi: 180,
    },
    {
      id: '2',
      name: '디지털 마케팅 캠페인',
      type: 'Digital',
      status: 'Active',
      budget: 5000000,
      roi: 150,
    },
    {
      id: '3',
      name: '파트너 채널 프로모션',
      type: 'Partner',
      status: 'Planned',
      budget: 3000000,
      roi: 0,
    },
  ];

  const formatCurrency = (value: number) => {
    return `₩${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* 최근 제품 */}
      {recentList.length > 0 && (
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          {/* 배경 그라디언트 */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">최근 제품</h3>
            </div>

            <div className="space-y-2">
              {recentList.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className={cn(
                    "w-full text-left p-3 border border-border rounded-lg transition-colors",
                    "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700",
                    product.id === productId && "bg-primary/10 border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-medium truncate",
                      product.id === productId ? "text-primary" : "text-foreground"
                    )}>
                      {product.name}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{product.sku}</span>
                  </div>
                  {product.family && (
                    <p className="text-xs text-muted-foreground mt-1">{product.family}</p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 가격표 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">가격표</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {priceBooks.map((book) => (
            <div key={book.id} className="border border-border rounded-lg p-3 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{book.name}</p>
                <Badge
                  variant="outline"
                  className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                >
                  {book.status}
                </Badge>
              </div>
              <p className="text-sm font-bold text-primary">
                {book.listPrice.toLocaleString()} {book.currency}
              </p>
              <p className="text-xs text-muted-foreground mt-1">효력일: {book.effectiveDate}</p>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            모든 가격표 보기
          </Button>
        </CardContent>
      </Card>

      {/* 기회 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">관련 기회</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {opportunities.map((opp) => (
            <div key={opp.id} className="border border-border rounded-lg p-3 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-semibold text-foreground truncate">{opp.opportunityName}</p>
                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 -mr-2">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{opp.accountName}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  ₩{(opp.amount / 1000000).toFixed(0)}M
                </span>
                <span className="text-xs text-muted-foreground">{opp.probability}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full"
                  style={{ width: `${opp.probability}%` }}
                />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            모든 기회 보기
          </Button>
        </CardContent>
      </Card>

      {/* 캠페인 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">관련 캠페인</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="border border-border rounded-lg p-3 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{campaign.name}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    campaign.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  )}
                >
                  {campaign.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{campaign.type}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span>예산: ₩{(campaign.budget / 1000000).toFixed(0)}M</span>
                {campaign.roi > 0 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ROI {campaign.roi}%</span>
                )}
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            모든 캠페인 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
