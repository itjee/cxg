"use client";

/**
 * @file invoice-table.tsx
 * @description 청구서 관리 테이블 컴포넌트
 * 
 * TanStack Table을 사용한 청구서 목록 테이블
 * - 정렬, 필터링, 페이지네이션 기능
 * - 컬럼별 정렬 가능
 * - 행별 상세/다운로드 액션
 */

import { DataTable } from "@/components/ui/data-table";
import { useInvoiceStore } from "../stores";
import { getInvoiceColumns } from "./invoice-columns";
import type { Invoice } from "../types";

/**
 * InvoiceTable 컴포넌트 Props 인터페이스
 */
interface InvoiceTableProps {
  /** 표시할 청구서 데이터 배열 */
  data: Invoice[];
  
  /** 청구서 상세 보기 핸들러 */
  onViewDetails?: (invoice: Invoice) => void;
  
  /** 청구서 PDF 다운로드 핸들러 */
  onDownload?: (invoice: Invoice) => void;
}

/**
 * 청구서 관리 데이터 테이블 컴포넌트
 * 
 * @description
 * - TanStack Table 기반 청구서 목록 표시
 * - useInvoiceStore와 연동하여 정렬 상태 관리
 * - 클라이언트 사이드 페이징 (DataTable 내부 처리)
 * - 통합 필터링 (검색, 상태, 테넌트)
 * 
 * @features
 * - 컬럼별 정렬 (오름차순/내림차순)
 * - 행별 상세/다운로드 액션
 * - 정렬 상태 persist (Zustand store)
 * - 빈 데이터 상태 처리
 * 
 * @example
 * ```tsx
 * <InvoiceTable
 *   data={invoices}
 *   onViewDetails={handleViewDetails}
 *   onDownload={handleDownload}
 * />
 * ```
 */
export function InvoiceTable({ 
  data, 
  onViewDetails, 
  onDownload,
}: InvoiceTableProps) {
  // Zustand 스토어에서 정렬 상태 가져오기
  const { sorting, setSorting } = useInvoiceStore();

  // 컬럼 정의 생성
  const columns = getInvoiceColumns({ onViewDetails, onDownload });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="invoiceNumber"
      searchPlaceholder="청구서 번호, 테넌트명 검색..."
      showColumnVisibility={false}
      showPagination={true}
      pageSize={20}
      useCollapsibleFilter={true}
      filters={[
        {
          key: "status",
          label: "상태",
          options: [
            { label: "지급 완료", value: "PAID" },
            { label: "미지급", value: "PENDING" },
            { label: "연체", value: "OVERDUE" },
            { label: "취소됨", value: "CANCELLED" },
          ],
        },
      ]}
    />
  );
}
