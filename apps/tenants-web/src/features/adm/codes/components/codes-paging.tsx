"use client";

import { useState } from "react";
import { Pagination } from "@/components/pagination";
import { useCodeStore } from "../stores";

interface CodesPagingProps {
  totalItems: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

/**
 * Codes 페이지 페이지네이션 컴포넌트
 * 공통 Pagination 컴포넌트를 래핑하여 useCodesStore와 연동
 */
export function CodesPaging({
  totalItems,
  itemsPerPage: initialItemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}: CodesPagingProps) {
  const { currentPage, setCurrentPage } = useCodeStore();
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    onItemsPerPageChange?.(newItemsPerPage);
  };

  return (
    <Pagination
      totalItems={totalItems}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      itemsPerPage={itemsPerPage}
      onItemsPerPageChange={handleItemsPerPageChange}
      itemsPerPageOptions={[10, 20, 30, 40, 50]}
      showInfo={true}
    />
  );
}
