'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 페이지 번호 생성 함수
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisible = 5; // 최대 표시할 페이지 번호 개수

  if (totalPages <= maxVisible + 2) {
    // 페이지가 적으면 모두 표시
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 페이지가 많으면 현재 페이지 주변만 표시
    pages.push(0); // 첫 페이지는 항상 표시

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);

    // 현재 페이지가 앞쪽에 있을 때
    if (currentPage <= 2) {
      start = 1;
      end = Math.min(totalPages - 2, maxVisible - 1);
    }

    // 현재 페이지가 뒷쪽에 있을 때
    if (currentPage >= totalPages - 3) {
      start = Math.max(1, totalPages - maxVisible);
      end = totalPages - 2;
    }

    if (start > 1) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages - 1); // 마지막 페이지는 항상 표시
  }

  return pages;
}

export interface PaginationProps {
  /**
   * 전체 항목 개수
   */
  totalItems: number;

  /**
   * 현재 페이지 (0부터 시작)
   */
  currentPage: number;

  /**
   * 페이지 변경 콜백
   */
  onPageChange: (page: number) => void;

  /**
   * 페이지당 항목 수 (기본값: 10)
   */
  itemsPerPage?: number;

  /**
   * 페이지당 항목 수 변경 콜백 (선택사항)
   */
  onItemsPerPageChange?: (itemsPerPage: number) => void;

  /**
   * 페이지당 항목 수 옵션 (기본값: [10, 20, 30, 40, 50])
   */
  itemsPerPageOptions?: number[];

  /**
   * 커스텀 스타일 클래스
   */
  className?: string;

  /**
   * 정보 텍스트 표시 여부 (기본값: true)
   */
  showInfo?: boolean;
}

export function Pagination({
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 30, 40, 50],
  className = '',
  showInfo = true,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const canPreviousPage = currentPage > 0 && totalPages > 0;
  const canNextPage = currentPage < totalPages - 1 && totalPages > 0;

  const handlePageChange = (page: number) => {
    const validPage = Math.max(0, Math.min(page, totalPages - 1));
    onPageChange(validPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number(value);
    onItemsPerPageChange?.(newItemsPerPage);
    // 페이지당 항목 수가 변경되면 첫 페이지로 이동
    onPageChange(0);
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* 정보 섹션 */}
      {showInfo && (
        <div className="flex-1 text-sm text-muted-foreground">
          전체{' '}
          <span className="font-medium text-foreground">
            {totalItems}
          </span>
          개
        </div>
      )}

      {/* 페이지네이션 섹션 */}
      <div className="flex items-center gap-6">
        {/* Page Size Selector */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">페이지당 행 수</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="h-9 w-[70px] border border-input bg-background hover:bg-accent/50 transition-colors">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {itemsPerPageOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pagination Buttons */}
        <ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handlePageChange(0)}
            disabled={!canPreviousPage}
            title="첫 페이지로"
            aria-label="첫 페이지로"
          >
            <span className="sr-only">첫 페이지로</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canPreviousPage}
            title="이전 페이지"
            aria-label="이전 페이지"
          >
            <span className="sr-only">이전 페이지</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Number Buttons */}
          {getPageNumbers(currentPage, totalPages).map((pageNum, idx) =>
            pageNum === '...' ? (
              <div
                key={`ellipsis-${idx}`}
                className="h-9 w-9 flex items-center justify-center border-y border-r border-input bg-background"
              >
                <span className="text-muted-foreground text-sm">⋯</span>
              </div>
            ) : (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="icon"
                className="h-9 w-9 text-sm font-medium"
                onClick={() => handlePageChange(pageNum as number)}
              >
                {(pageNum as number) + 1}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canNextPage}
            title="다음 페이지"
            aria-label="다음 페이지"
          >
            <span className="sr-only">다음 페이지</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={!canNextPage}
            title="마지막 페이지로"
            aria-label="마지막 페이지로"
          >
            <span className="sr-only">마지막 페이지로</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
