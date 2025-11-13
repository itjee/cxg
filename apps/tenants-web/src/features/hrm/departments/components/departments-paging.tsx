'use client';

import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { useDepartmentsStore } from '../stores';

interface DepartmentsPagingProps {
  totalItems: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

/**
 * Departments 페이지 페이지네이션 컴포넌트
 * 공통 Pagination 컴포넌트를 래핑하여 useDepartmentsStore와 연동
 */
export function DepartmentsPaging({
  totalItems,
  itemsPerPage: initialItemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}: DepartmentsPagingProps) {
  const { currentPage, setCurrentPage } = useDepartmentsStore();
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
