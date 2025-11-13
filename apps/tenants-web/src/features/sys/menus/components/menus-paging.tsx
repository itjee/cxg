/**
 * @file menus-paging.tsx
 * @description Menus 페이지 페이지네이션 컴포넌트
 * 공통 Pagination 컴포넌트를 래핑하여 useMenuStore와 연동
 */

"use client";

import { Pagination } from "@/components/pagination";
import { useMenuStore } from "../stores";

interface MenusPagingProps {
  totalItems: number;
}

export function MenusPaging({ totalItems }: MenusPagingProps) {
  const { currentPage, setCurrentPage, itemsPerPage, setItemsPerPage } = useMenuStore();

  return (
    <Pagination
      totalItems={totalItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      itemsPerPage={itemsPerPage}
      onItemsPerPageChange={setItemsPerPage}
      itemsPerPageOptions={[10, 20, 30, 40, 50]}
      showInfo={true}
    />
  );
}
