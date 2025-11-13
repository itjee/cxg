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

interface CategoriesFilterProps {
  globalFilter: string;
  selectedStatus: string;
  onGlobalFilterChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function CategoriesFilter({
  globalFilter,
  selectedStatus,
  onGlobalFilterChange,
  onStatusChange,
}: CategoriesFilterProps) {
  const [filterExpanded, setFilterExpanded] = useState(true);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 검색 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="카테고리명, 코드..."
                  value={globalFilter}
                  onChange={(e) => onGlobalFilterChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            </div>

            {/* 활성화 필터 */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                활성화 상태
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
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
