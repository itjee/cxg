"use client";

/**
 * @file transaction-table.tsx
 * @description 거래 관리 테이블 컴포넌트
 *
 * TanStack Table을 사용한 거래 목록 테이블
 * - 정렬, 필터링, 페이지네이션 기능
 * - 컬럼별 정렬 가능
 * - 행별 상세 보기 액션
 */

import { DataTable } from "@/components/data-table";
import { useTransactionStore } from "../stores";
import { getTransactionColumns } from "./transaction-columns";
import type { Transaction } from "../types";

/**
 * TransactionTable 컴포넌트 Props 인터페이스
 */
interface TransactionTableProps {
  /** 표시할 거래 데이터 배열 */
  data: Transaction[];

  /** 거래 상세 보기 핸들러 */
  onViewDetails?: (transaction: Transaction) => void;
}

/**
 * 거래 관리 데이터 테이블 컴포넌트
 *
 * @description
 * - TanStack Table 기반 거래 목록 표시
 * - useTransactionStore와 연동하여 정렬 상태 관리
 * - 클라이언트 사이드 페이징 (DataTable 내부 처리)
 * - 통합 필터링 (검색, 상태, 게이트웨이)
 *
 * @features
 * - 컬럼별 정렬 (오름차순/내림차순)
 * - 행별 상세 보기 액션
 * - 정렬 상태 persist (Zustand store)
 * - 빈 데이터 상태 처리
 *
 * @example
 * ```tsx
 * <TransactionTable
 *   data={transactions}
 *   onViewDetails={handleViewDetails}
 * />
 * ```
 */
export function TransactionTable({
  data,
  onViewDetails,
}: TransactionTableProps) {
  // Zustand 스토어에서 정렬 상태 가져오기
  const { sorting, setSorting } = useTransactionStore();

  // 컬럼 정의 생성
  const columns = getTransactionColumns({ onViewDetails });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="transaction_no"
      searchPlaceholder="거래 번호 검색..."
      showColumnVisibility={false}
      showPagination={true}
      pageSize={20}
      useCollapsibleFilter={true}
      filters={[
        {
          key: "status",
          label: "상태",
          options: [
            { label: "성공", value: "SUCCESS" },
            { label: "대기 중", value: "PENDING" },
            { label: "실패", value: "FAILED" },
            { label: "취소됨", value: "CANCELED" },
          ],
        },
        {
          key: "transaction_type",
          label: "거래 유형",
          options: [
            { label: "결제", value: "PAYMENT" },
            { label: "환불", value: "REFUND" },
            { label: "차지백", value: "CHARGEBACK" },
          ],
        },
        {
          key: "payment_gateway",
          label: "결제 게이트웨이",
          options: [
            { label: "Stripe", value: "STRIPE" },
            { label: "PayPal", value: "PAYPAL" },
            { label: "Toss", value: "TOSS" },
            { label: "KakaoPay", value: "KAKAOPAY" },
            { label: "NaverPay", value: "NAVERPAY" },
          ],
        },
      ]}
    />
  );
}
