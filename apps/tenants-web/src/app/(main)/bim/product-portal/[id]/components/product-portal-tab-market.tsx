'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductPortalTabMarketProps {
  productId?: string;
}

export function ProductPortalTabMarket({
  productId,
}: ProductPortalTabMarketProps) {
  // 모의 판매 데이터
  const topCustomers = [
    {
      id: '1',
      name: 'SK C&C',
      purchaseAmount: 450000000,
      unitsPurchased: 3500,
      lastOrderDate: '2024-10-28',
      orderCount: 12,
    },
    {
      id: '2',
      name: '삼성전자',
      purchaseAmount: 380000000,
      unitsPurchased: 2800,
      lastOrderDate: '2024-10-25',
      orderCount: 10,
    },
    {
      id: '3',
      name: 'LG전자',
      purchaseAmount: 320000000,
      unitsPurchased: 2400,
      lastOrderDate: '2024-10-22',
      orderCount: 9,
    },
    {
      id: '4',
      name: 'CJ제일제당',
      purchaseAmount: 280000000,
      unitsPurchased: 2100,
      lastOrderDate: '2024-10-20',
      orderCount: 8,
    },
    {
      id: '5',
      name: '현대자동차',
      purchaseAmount: 250000000,
      unitsPurchased: 1900,
      lastOrderDate: '2024-10-18',
      orderCount: 7,
    },
  ];

  const competitorComparison = [
    {
      feature: '기본 가격',
      ourProduct: '₩850,000',
      competitor1: '₩920,000',
      competitor2: '₩780,000',
      winner: 'competitor2',
    },
    {
      feature: '배터리 수명',
      ourProduct: '7일',
      competitor1: '5일',
      competitor2: '6일',
      winner: 'ourProduct',
    },
    {
      feature: '무게',
      ourProduct: '120g',
      competitor1: '150g',
      competitor2: '110g',
      winner: 'competitor2',
    },
    {
      feature: '방수 등급',
      ourProduct: 'IPX7',
      competitor1: 'IPX5',
      competitor2: 'IPX7',
      winner: 'ourProduct',
    },
    {
      feature: 'GPS 내장',
      ourProduct: '예',
      competitor1: '아니오',
      competitor2: '예',
      winner: 'ourProduct',
    },
  ];

  const profitabilityData = [
    { month: '1월', asp: 850000, margin: 35 },
    { month: '2월', asp: 860000, margin: 36 },
    { month: '3월', asp: 855000, margin: 35.5 },
    { month: '4월', asp: 870000, margin: 37 },
    { month: '5월', asp: 880000, margin: 38 },
    { month: '6월', asp: 875000, margin: 37.5 },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₩${(value / 1000000).toFixed(0)}M`;
    }
    return `₩${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* 판매 트렌드 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 판매 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">최근 6개월 판매 데이터</p>
            <div className="grid grid-cols-6 gap-2">
              {profitabilityData.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="h-24 bg-muted rounded-lg relative flex items-end justify-center pb-2">
                    <div
                      className="bg-primary rounded-t-md w-full"
                      style={{ height: `${(item.margin / 40) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{item.month}</p>
                  <p className="text-xs font-medium text-foreground">{item.margin}%</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수익성 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>수익성 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground">평균 판매 가격(ASP)</p>
              <p className="text-3xl font-bold text-foreground mt-2">₩867,500</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">↑ 2% (전월 대비)</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <p className="text-sm text-muted-foreground">평균 이익률</p>
              <p className="text-3xl font-bold text-foreground mt-2">36.8%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">↑ 1.2% (전월 대비)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 경쟁사 비교 */}
      <Card>
        <CardHeader>
          <CardTitle>경쟁사 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">항목</th>
                  <th className="text-center py-3 px-3 text-foreground font-semibold">우리 제품</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-medium">경쟁사 A</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-medium">경쟁사 B</th>
                </tr>
              </thead>
              <tbody>
                {competitorComparison.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-3 text-foreground font-medium">{item.feature}</td>
                    <td
                      className={cn(
                        'text-center py-3 px-3 font-semibold',
                        item.winner === 'ourProduct'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-foreground'
                      )}
                    >
                      {item.ourProduct}
                    </td>
                    <td
                      className={cn(
                        'text-center py-3 px-3 font-semibold',
                        item.winner === 'competitor1'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-foreground'
                      )}
                    >
                      {item.competitor1}
                    </td>
                    <td
                      className={cn(
                        'text-center py-3 px-3 font-semibold',
                        item.winner === 'competitor2'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-foreground'
                      )}
                    >
                      {item.competitor2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 상위 구매 거래처 */}
      <Card>
        <CardHeader>
          <CardTitle>상위 구매 거래처 (Top 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-start justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">{customer.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      주문 {customer.orderCount}회
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">총 구매액</p>
                      <p className="font-semibold text-foreground">{formatCurrency(customer.purchaseAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">구매 수량</p>
                      <p className="font-semibold text-foreground">{customer.unitsPurchased.toLocaleString()}개</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">최근 주문</p>
                      <p className="font-semibold text-foreground">{customer.lastOrderDate}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
