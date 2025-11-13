'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductsFilterProps {
  globalFilter: string;
  selectedCategory: string;
  selectedStatus: string;
  categories: string[];
  onGlobalFilterChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ProductsFilter({
  globalFilter,
  selectedCategory,
  selectedStatus,
  categories,
  onGlobalFilterChange,
  onCategoryChange,
  onStatusChange,
}: ProductsFilterProps) {
  const [filterExpanded, setFilterExpanded] = useState(true);

  const categoryMap: Record<string, string> = {
    ELECTRONICS: '전자기기',
    ACCESSORIES: '액세서리',
    SOFTWARE: '소프트웨어',
    SERVICE: '서비스',
  };

  return (
    <div>
      {/* 필터 헤더 */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-foreground">검색필터</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <button
          onClick={() => setFilterExpanded(!filterExpanded)}
          className="ml-4 p-1 hover:bg-accent rounded-md transition-colors"
          title={filterExpanded ? '필터 숨기기' : '필터 보이기'}
        >
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              filterExpanded ? '' : '-rotate-90'
            }`}
          />
        </button>
      </div>

      {/* 필터 컨텐츠 */}
      {filterExpanded && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 검색 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="제품명, 코드, 브랜드..."
                  value={globalFilter}
                  onChange={(e) => onGlobalFilterChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                카테고리
              </label>
              <Select
                value={selectedCategory || 'all'}
                onValueChange={(value) =>
                  onCategoryChange(value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="전체 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  <SelectItem value="ELECTRONICS">전자기기</SelectItem>
                  <SelectItem value="ACCESSORIES">액세서리</SelectItem>
                  <SelectItem value="SOFTWARE">소프트웨어</SelectItem>
                  <SelectItem value="SERVICE">서비스</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                상태
              </label>
              <Select
                value={selectedStatus || 'all'}
                onValueChange={(value) =>
                  onStatusChange(value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="전체 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="active">판매중</SelectItem>
                  <SelectItem value="inactive">중단</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
