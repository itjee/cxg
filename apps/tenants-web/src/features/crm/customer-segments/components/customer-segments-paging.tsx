'use client';

import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { useCustomerSegmentsStore } from '../stores';

interface CustomerSegmentsPagingProps {
  totalItems: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function CustomerSegmentsPaging({
  totalItems,
  itemsPerPage: initialItemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}: CustomerSegmentsPagingProps) {
  const { currentPage, setCurrentPage } = useCustomerSegmentsStore();
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
