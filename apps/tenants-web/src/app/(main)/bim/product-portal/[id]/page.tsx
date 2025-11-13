'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProductPortalHeader } from './components/product-portal-header';
import { ProductPortalMetrics } from './components/product-portal-metrics';
import { ProductPortalTabs } from './components/product-portal-tabs';
import { ProductPortalTabOverview } from './components/product-portal-tab-overview';
import { ProductPortalTabMarket } from './components/product-portal-tab-market';
import { ProductPortalTabRelated } from './components/product-portal-tab-related';
import { ProductPortalSidebar } from './components/product-portal-sidebar';

export default function ProductPortalPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  // 모의 제품 데이터
  const product = {
    id: productId || '1',
    sku: 'WM-001-BLK',
    name: '무선 센서 모듈 V2.3',
    family: 'IoT 센서',
    status: 'Active' as const,
    standardPrice: 850000,
    description: '고성능 무선 통신 모듈',
    category: '전자 부품',
    image: undefined,
  };

  // Note: Breadcrumb displays menu name (제품 포탈) for portal routes, not entity name
  // useEffect(() => {
  //   setDynamicData({ [productId]: product.name });
  //   return () => clearDynamicData();
  // }, [productId, product.name, setDynamicData, clearDynamicData]);

  // 제품 성과 데이터
  const performanceData = {
    totalRevenue: 4850000000,
    grossMargin: 36.8,
    unitsSold: 12500,
    marketShare: 18.5,
    revenueTrend: 12.5,
    marginTrend: 3.2,
  };

  // 탭 구성
  const tabs = [
    {
      id: 'overview',
      label: '개요 및 사양',
      badge: undefined,
      content: <ProductPortalTabOverview productId={product.id} />,
    },
    {
      id: 'market',
      label: '시장 및 판매 실적',
      badge: undefined,
      content: <ProductPortalTabMarket productId={product.id} />,
    },
    {
      id: 'related',
      label: '관련 항목 및 서비스',
      badge: 8,
      content: <ProductPortalTabRelated productId={product.id} />,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 상단 헤더 */}
      <ProductPortalHeader
        product={product}
        onBack={() => router.back()}
        onEditProduct={() => console.log('Edit Product')}
        onCreateCampaign={() => console.log('Create Campaign')}
        onViewPriceBook={() => console.log('View Price Book')}
      />

      {/* 메인 콘텐츠 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 메트릭스 */}
          <ProductPortalMetrics performanceData={performanceData} />

          {/* 탭 */}
          <ProductPortalTabs tabs={tabs} />
        </div>

        {/* 우측 사이드바 */}
        <div>
          <ProductPortalSidebar productId={product.id} />
        </div>
      </div>
    </div>
  );
}
