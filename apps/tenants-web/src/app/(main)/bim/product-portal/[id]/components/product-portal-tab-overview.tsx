'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductPortalTabOverviewProps {
  productId?: string;
}

export function ProductPortalTabOverview({
  productId,
}: ProductPortalTabOverviewProps) {
  // 모의 제품 상세 데이터
  const productDetails = {
    description: '고성능 무선 통신 모듈로 IoT 디바이스에 최적화되어 있습니다. 안정적인 연결과 낮은 전력 소비를 특징으로 합니다.',
    features: [
      '5G NR 지원',
      '배터리 수명 최대 7일',
      'IPX7 방수 등급',
      'GPS 내장',
      '온도 범위: -40°C ~ 85°C',
    ],
    specifications: {
      '크기': '85 x 55 x 12mm',
      '무게': '120g',
      '연결': 'Bluetooth 5.2, Wi-Fi 6E',
      '배터리': '3000mAh Li-ion',
      '재질': 'Aluminum + Thermoplastic',
    },
    releaseDate: '2024-01-15',
    latestVersion: 'v2.3.1',
    versionHistory: [
      { version: 'v2.3.1', date: '2024-10-30', changes: '버그 수정 및 성능 최적화' },
      { version: 'v2.3.0', date: '2024-09-15', changes: '새로운 기능 추가: AI 기반 자동 진단' },
      { version: 'v2.2.0', date: '2024-08-01', changes: 'UI/UX 개선, 에너지 효율성 증대' },
    ],
    documents: [
      { name: '제품 브로슈어 (KOR)', file: 'brochure_ko.pdf', size: '2.4MB' },
      { name: '사용자 매뉴얼 (ENG)', file: 'user_manual_en.pdf', size: '5.6MB' },
      { name: '설치 가이드', file: 'installation_guide.pdf', size: '1.2MB' },
      { name: 'FAQ 및 문제해결', file: 'faq_troubleshooting.pdf', size: '0.8MB' },
      { name: '기술 스펙시트', file: 'technical_specs.pdf', size: '1.5MB' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 제품 설명 */}
      <Card>
        <CardHeader>
          <CardTitle>제품 설명</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">{productDetails.description}</p>
        </CardContent>
      </Card>

      {/* 주요 기능 */}
      <Card>
        <CardHeader>
          <CardTitle>주요 기능</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productDetails.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 기술 사양 */}
      <Card>
        <CardHeader>
          <CardTitle>기술 사양</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(productDetails.specifications).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm font-medium text-muted-foreground">{key}</p>
                <p className="text-foreground font-semibold mt-1">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 제품 이력 */}
      <Card>
        <CardHeader>
          <CardTitle>버전 및 출시 이력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">출시일</p>
            <p className="text-foreground font-semibold">{productDetails.releaseDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">최신 버전</p>
            <p className="text-foreground font-semibold">{productDetails.latestVersion}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">주요 업데이트</p>
            <div className="space-y-3">
              {productDetails.versionHistory.map((item, idx) => (
                <div key={idx} className="border-l-2 border-primary/30 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{item.version}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.changes}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 관련 문서 */}
      <Card>
        <CardHeader>
          <CardTitle>관련 문서 및 자료</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {productDetails.documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
