'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, ArrowLeft, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProductSelector } from './product-selector';

interface ProductPortalHeaderProps {
  product: {
    id: string;
    sku: string;
    name: string;
    family?: string;
    status?: 'Active' | 'EOL' | 'Draft';
    standardPrice?: number;
    description?: string;
    category?: string;
    image?: string;
  };
  onBack?: () => void;
  onEditProduct?: () => void;
  onCreateCampaign?: () => void;
  onViewPriceBook?: () => void;
}

export function ProductPortalHeader({
  product,
  onBack,
  onEditProduct,
  onCreateCampaign,
  onViewPriceBook,
}: ProductPortalHeaderProps) {
  const router = useRouter();

  const handleSelectProduct = (id: string, name: string) => {
    router.push(`/bim/product-portal/${id}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'EOL':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Draft':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* 좌측: 제품 정보 */}
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

            {/* 제품 이미지 또는 아이콘 */}
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover border-2 border-blue-200 dark:border-blue-800 flex-shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-200 dark:border-blue-800 flex-shrink-0">
                <Package className="w-8 h-8" />
              </div>
            )}

            {/* 텍스트 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {product.name}
                </h1>
                <ProductSelector
                  currentProductId={product.id}
                  currentProductName={product.name}
                  onSelectProduct={handleSelectProduct}
                />
                {product.status && (
                  <Badge className={cn('text-xs font-medium', getStatusColor(product.status))}>
                    {product.status}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {product.sku}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {product.family && <span>제품군: {product.family}</span>}
                {product.category && <span>카테고리: {product.category}</span>}
                {product.standardPrice && (
                  <span className="font-semibold text-foreground">
                    기준가: ₩{product.standardPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 우측: 액션 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onEditProduct}
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">수정</span>
            </Button>
            <Button
              onClick={onCreateCampaign}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">캠페인</span>
            </Button>
            <Button
              onClick={onViewPriceBook}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">가격표</span>
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
              마지막 업데이트: 오늘 14:32
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
