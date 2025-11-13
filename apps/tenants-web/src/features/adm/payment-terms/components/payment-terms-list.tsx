"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { usePaymentTermStore } from "../stores/payment-term.store";

interface PaymentTermsListProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
}

/**
 * PaymentTerms 페이지 데이터 리스트 컴포넌트
 * 공통 DataTable을 래핑하여 usePaymentTermStore와 연동
 */
export function PaymentTermsList<T>({ columns, data }: PaymentTermsListProps<T>) {
  const { searchQuery, setSearchQuery } = usePaymentTermStore();

  return (
    <DataTable
      columns={columns}
      data={data}
      globalFilter={searchQuery}
      onGlobalFilterChange={setSearchQuery}
      emptyMessage="데이터가 없습니다."
    />
  );
}
