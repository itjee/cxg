/**
 * Code Help Modal
 *
 * 코드 헬프 검색 모달 컴포넌트
 */

"use client";

import { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/data-table";
import { useCodeHelp } from "@/shared/hooks/use-code-help";
import { codeHelpService } from "@/shared/services/code-help.service";
import { getCodeHelpColumns } from "./code-help-columns";
import type {
  CodeHelpModalProps,
  CodeHelpResult,
} from "@/shared/types/code-help.types";
import { X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CodeHelpModal({
  open,
  onOpenChange,
  searchType,
  title,
  width,
  height,
  onSelect,
  onMultiSelect,
  multiSelect = false,
  filters: initialFilters,
  onFiltersChange,
  allowNewEntry = false,
  showMetadata = true,
  emptyMessage,
}: CodeHelpModalProps) {
  const actualWidth = width || codeHelpService.getDefaultWidth(searchType);
  const actualHeight = height || codeHelpService.getDefaultHeight(searchType);
  const modalTitle = title || codeHelpService.getDefaultTitle(searchType);

  const {
    items,
    totalCount,
    hasMore,
    selectedItems,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    handleSelect,
    clearSelection,
  } = useCodeHelp({
    searchType,
    initialFilters:
      initialFilters || codeHelpService.getDefaultFilters(searchType),
    pageSize: 20,
  });

  const columns = getCodeHelpColumns({ searchType, showMetadata });

  const handleConfirm = useCallback(() => {
    if (multiSelect && selectedItems.length > 0) {
      if (onMultiSelect) {
        onMultiSelect(selectedItems);
      }
      selectedItems.forEach((item) => onSelect(item));
    } else if (!multiSelect && selectedItems.length === 1) {
      onSelect(selectedItems[0]);
    }
    onOpenChange(false);
    clearSelection();
  }, [
    selectedItems,
    multiSelect,
    onSelect,
    onMultiSelect,
    onOpenChange,
    clearSelection,
  ]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
    clearSelection();
  }, [onOpenChange, clearSelection]);

  const selectionLabel = useMemo(() => {
    if (selectedItems.length === 0) {
      return "";
    }
    return multiSelect
      ? `${selectedItems.length}개 선택됨`
      : `${codeHelpService.formatSelectedItem(selectedItems[0])}`;
  }, [selectedItems, multiSelect]);

  const searchPlaceholder = codeHelpService.getSearchPlaceholder(searchType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: actualWidth,
          height: actualHeight,
          maxWidth: "95vw",
          maxHeight: "95vh",
        }}
        className="flex flex-col p-0"
      >
        {/* 헤더 */}
        <DialogHeader className="border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-4xl">{modalTitle}</DialogTitle>
              {selectionLabel && (
                <DialogDescription className="mt-1">
                  {selectionLabel}
                </DialogDescription>
              )}
            </div>
            {selectedItems.length > 0 && (
              <Badge variant="secondary" className="h-fit">
                {multiSelect ? `${selectedItems.length}개` : "선택됨"}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* 검색바 */}
        <div className="border-b px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  title="검색 초기화"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          {error ? (
            <div className="flex items-center justify-center h-full text-red-600">
              <div className="text-center">
                <p className="font-medium mb-1">오류가 발생했습니다</p>
                <p className="text-muted-foreground">{error.message}</p>
              </div>
            </div>
          ) : loading && items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>로딩 중...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {emptyMessage || "검색 결과가 없습니다"}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={items}
              showPagination={false}
              onRowClick={(row) => handleSelect(row, multiSelect)}
              selectedRows={selectedItems}
              isLoading={loading}
              className="h-full"
            />
          )}
        </div>

        {/* 하단: 버튼 */}
        <DialogFooter className="border-t px-6 py-4 flex-shrink-0 flex items-center justify-between">
          <Button variant="outline" onClick={handleCancel} className="w-20">
            취소
          </Button>
          <div className="flex gap-2 ml-auto">
            {allowNewEntry && (
              <Button
                variant="outline"
                onClick={() => {
                  // 새 항목 추가 로직
                  console.log("새 항목 추가");
                }}
              >
                새로 추가
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="w-20"
            >
              선택
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
