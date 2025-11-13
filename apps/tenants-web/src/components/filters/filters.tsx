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
import { Input } from '@/components/ui/input';

/**
 * 필터 컨트롤 타입
 */
export type FilterControlType = 'text' | 'search' | 'select' | 'date' | 'checkbox';

/**
 * 필터 옵션 (Select 타입용)
 */
export interface FilterOption {
  label: string;
  value: string;
}

/**
 * 필터 정의
 */
export interface FilterConfig {
  /**
   * 필터 고유 키 (store setter 메서드 이름)
   */
  key: string;

  /**
   * 필터 라벨
   */
  label: string;

  /**
   * 필터 설명 (placeholder, tooltip 등)
   */
  description?: string;

  /**
   * 컨트롤 타입
   */
  type: FilterControlType;

  /**
   * Select/Checkbox 타입일 때 옵션 배열
   */
  options?: FilterOption[];

  /**
   * 너비 설정 (tailwind 클래스: 'w-full', 'w-1/2' 등)
   */
  width?: string;

  /**
   * 초기값
   */
  defaultValue?: string | string[];
}

export interface FiltersProps {
  /**
   * 필터 설정 배열
   */
  filters: FilterConfig[];

  /**
   * 필터 값 객체
   */
  values: Record<string, string | string[]>;

  /**
   * 필터 변경 콜백
   */
  onChange: (key: string, value: string | string[]) => void;

  /**
   * 필터 섹션 제목
   */
  title?: string;

  /**
   * 초기 확장 상태
   */
  defaultExpanded?: boolean;

  /**
   * 초기화 콜백 (선택사항)
   */
  onReset?: () => void;

  /**
   * 커스텀 클래스
   */
  className?: string;
}

/**
 * 공통 필터 컴포넌트
 * 다양한 필터 타입을 동적으로 지원합니다.
 */
export function Filters({
  filters,
  values,
  onChange,
  title = '검색필터',
  defaultExpanded = true,
  onReset,
  className = '',
}: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleFilterChange = (key: string, value: string | string[]) => {
    onChange(key, value);
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className={className}>
      {/* 필터 헤더 */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
              title="필터 초기화"
            >
              초기화
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 p-1 hover:bg-accent rounded-md transition-colors"
            title={isExpanded ? '필터 숨기기' : '필터 보이기'}
          >
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform ${
                isExpanded ? '' : '-rotate-90'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 필터 컨텐츠 */}
      {isExpanded && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filters.map((filter) => {
              const value = values[filter.key] ?? '';

              return (
                <div key={filter.key} className={filter.width || 'w-full'}>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {filter.label}
                  </label>

                  {/* Text Input */}
                  {filter.type === 'text' && (
                    <Input
                      type="text"
                      placeholder={filter.description}
                      value={value as string}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="bg-background border-input"
                    />
                  )}

                  {/* Search Input */}
                  {filter.type === 'search' && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={filter.description}
                        value={value as string}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="pl-10 bg-background border-input"
                      />
                    </div>
                  )}

                  {/* Date Input */}
                  {filter.type === 'date' && (
                    <Input
                      type="date"
                      value={value as string}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="bg-background border-input"
                    />
                  )}

                  {/* Select */}
                  {filter.type === 'select' && filter.options && (
                    <Select
                      value={value === '' ? 'all' : (value as string)}
                      onValueChange={(newValue) =>
                        handleFilterChange(filter.key, newValue === 'all' ? '' : newValue)
                      }
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue placeholder={filter.description || '전체'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Checkbox */}
                  {filter.type === 'checkbox' && filter.options && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={(value as string[])?.includes(option.value) ?? false}
                            onChange={(e) => {
                              const currentValues = (value as string[]) ?? [];
                              if (e.target.checked) {
                                handleFilterChange(filter.key, [
                                  ...currentValues,
                                  option.value,
                                ]);
                              } else {
                                handleFilterChange(
                                  filter.key,
                                  currentValues.filter((v) => v !== option.value)
                                );
                              }
                            }}
                            className="rounded border-input"
                          />
                          <span className="text-sm text-foreground">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
