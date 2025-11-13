'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Zap, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductPortalTabRelatedProps {
  productId?: string;
}

export function ProductPortalTabRelated({
  productId,
}: ProductPortalTabRelatedProps) {
  // 모의 관련 제품 데이터
  const relatedProducts = [
    {
      id: '1',
      name: '무선 센서 모듈 Pro',
      sku: 'WSM-002',
      type: '번들 제품',
      description: '이 제품과 함께 자주 구매되는 상위 제품',
    },
    {
      id: '2',
      name: '배터리 팩 3000mAh',
      sku: 'BP-3000',
      type: '보완 제품',
      description: '호환 배터리 팩 (교체용)',
    },
    {
      id: '3',
      name: 'GPS 안테나 외장형',
      sku: 'ANT-GPS-EXT',
      type: '액세서리',
      description: '신호 수신 성능 향상 액세서리',
    },
  ];

  const serviceRequests = {
    total: 45,
    open: 8,
    closed: 37,
    avgResolutionTime: '2.3일',
    topIssues: [
      { issue: '배터리 수명 감소', count: 12, trend: 'up' },
      { issue: '연결 끊김 문제', count: 8, trend: 'stable' },
      { issue: '과열 현상', count: 6, trend: 'down' },
      { issue: '소프트웨어 버그', count: 5, trend: 'down' },
    ],
  };

  const customerFeedback = {
    npsScore: 72,
    averageRating: 4.3,
    totalReviews: 234,
    sentimentBreakdown: {
      positive: 180,
      neutral: 35,
      negative: 19,
    },
  };

  return (
    <div className="space-y-6">
      {/* 구성품 및 번들 */}
      <Card>
        <CardHeader>
          <CardTitle>관련 제품 및 번들</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-start justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {product.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.sku}</p>
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-4 flex-shrink-0">
                  보기
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 서비스 요청 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>서비스 요청 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground">총 요청 건수</p>
              <p className="text-2xl font-bold text-foreground mt-1">{serviceRequests.total}</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-sm text-muted-foreground">미결 건수</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {serviceRequests.open}
              </p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <p className="text-sm text-muted-foreground">해결 건수</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {serviceRequests.closed}
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-muted-foreground">평균 해결 시간</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {serviceRequests.avgResolutionTime}
              </p>
            </div>
          </div>

          {/* 주요 이슈 */}
          <div className="mt-6 pt-6 border-t">
            <p className="font-semibold text-foreground mb-3">주요 이슈</p>
            <div className="space-y-2">
              {serviceRequests.topIssues.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        item.trend === 'up'
                          ? 'bg-orange-500'
                          : item.trend === 'down'
                          ? 'bg-emerald-500'
                          : 'bg-gray-400'
                      )}
                    />
                    <span className="text-sm text-foreground">{item.issue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{item.count}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 피드백 및 평가 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 피드백 및 평가</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-muted-foreground">NPS 점수</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {customerFeedback.npsScore}
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-muted-foreground">평균 평점</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {customerFeedback.averageRating}/5
              </p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <p className="text-sm text-muted-foreground">총 리뷰 수</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {customerFeedback.totalReviews}
              </p>
            </div>
          </div>

          {/* 감정 분석 */}
          <div className="mt-6 pt-6 border-t">
            <p className="font-semibold text-foreground mb-4">고객 반응 분석</p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">긍정</span>
                  <span className="text-sm font-semibold text-foreground">
                    {customerFeedback.sentimentBreakdown.positive}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${(customerFeedback.sentimentBreakdown.positive / customerFeedback.totalReviews) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">중립</span>
                  <span className="text-sm font-semibold text-foreground">
                    {customerFeedback.sentimentBreakdown.neutral}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400"
                    style={{
                      width: `${(customerFeedback.sentimentBreakdown.neutral / customerFeedback.totalReviews) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">부정</span>
                  <span className="text-sm font-semibold text-foreground">
                    {customerFeedback.sentimentBreakdown.negative}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${(customerFeedback.sentimentBreakdown.negative / customerFeedback.totalReviews) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
