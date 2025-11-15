'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'search' | 'select' | 'daterange';
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
}

interface PageFilterProps {
  filters: FilterConfig[];
  values: Record<string, string | { startDate?: string; endDate?: string }>;
  onFilterChange: (key: string, value: string | { startDate?: string; endDate?: string }) => void;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export function PageFilter({
  filters,
  values,
  onFilterChange,
  expanded = true,
  onExpandChange,
}: PageFilterProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpandChange?.(newState);
  };

  if (filters.length === 0) return null;

  return (
    <div>
      {/* 필터 헤더 */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-foreground">검색필터</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <button
          onClick={handleToggle}
          className="ml-4 p-1 hover:bg-accent rounded-md transition-colors"
          title={isExpanded ? '필터 숨기기' : '필터 보이기'}
        >
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              isExpanded ? '' : '-rotate-90'
            }`}
          />
        </button>
      </div>

      {/* 필터 컨텐츠 */}
      {isExpanded && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {filter.label}
                </label>

                {filter.type === 'search' ? (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={filter.placeholder || '검색...'}
                      value={(typeof values[filter.key] === 'string' ? values[filter.key] : '') as string}
                      onChange={(e) => onFilterChange(filter.key, e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                    />
                  </div>
                ) : filter.type === 'daterange' ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={
                        typeof values[filter.key] === 'object'
                          ? (values[filter.key] as { startDate?: string })?.startDate || ''
                          : ''
                      }
                      onChange={(e) =>
                        onFilterChange(filter.key, {
                          startDate: e.target.value,
                          endDate:
                            typeof values[filter.key] === 'object'
                              ? (values[filter.key] as { endDate?: string })?.endDate
                              : '',
                        })
                      }
                      className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                    />
                    <input
                      type="date"
                      value={
                        typeof values[filter.key] === 'object'
                          ? (values[filter.key] as { endDate?: string })?.endDate || ''
                          : ''
                      }
                      onChange={(e) =>
                        onFilterChange(filter.key, {
                          startDate:
                            typeof values[filter.key] === 'object'
                              ? (values[filter.key] as { startDate?: string })?.startDate
                              : '',
                          endDate: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                    />
                  </div>
                ) : (
                  <Select
                    value={(typeof values[filter.key] === 'string' ? values[filter.key] || 'all' : 'all') as string}
                    onValueChange={(value) =>
                      onFilterChange(filter.key, value === 'all' ? '' : value)
                    }
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder={filter.placeholder || '선택...'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 {filter.label}</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
