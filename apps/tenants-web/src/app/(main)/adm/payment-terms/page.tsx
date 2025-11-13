'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  PaymentTermsHeader,
  PaymentTermsStats,
  PaymentTermsFilters,
  PaymentTermsList,
  PaymentTermsPaging,
  PaymentTermsEdit,
} from '@/features/adm/payment-terms';
import { usePaymentTermsStore } from '@/features/adm/payment-terms/stores';
import type { PaymentTerm } from '@/features/adm/payment-terms/types';

// 날짜 포맷 함수
function formatDateTime(dateString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

// 더미 데이터
const dummyPaymentTerms: PaymentTerm[] = [
  {
    id: '1',
    code: 'NET30',
    name: '30일 후 지급',
    days: 30,
    description: '발주일로부터 30일 이내 결제',
    is_active: true,
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-10-28T14:30:00Z',
  },
  {
    id: '2',
    code: 'NET60',
    name: '60일 후 지급',
    days: 60,
    description: '발주일로부터 60일 이내 결제',
    is_active: true,
    created_at: '2025-01-05T09:15:00Z',
    updated_at: '2025-10-27T11:45:00Z',
  },
  {
    id: '3',
    code: 'COD',
    name: '현금 결제',
    days: 0,
    description: '상품 인수시 현금 결제',
    is_active: true,
    created_at: '2025-01-10T10:30:00Z',
    updated_at: '2025-10-26T16:20:00Z',
  },
  {
    id: '4',
    code: 'ADVANCE',
    name: '선금',
    days: -1,
    description: '발주 전 선금 결제',
    is_active: true,
    created_at: '2025-01-15T11:00:00Z',
    updated_at: '2025-10-25T13:10:00Z',
  },
  {
    id: '5',
    code: 'INSTALLMENT',
    name: '분할 결제',
    days: 90,
    description: '3회 분할 결제 (30일 간격)',
    is_active: false,
    created_at: '2025-01-20T12:45:00Z',
    updated_at: '2025-10-24T09:55:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditPaymentTerm: (paymentTerm: PaymentTerm) => void,
  onDeletePaymentTerm: (paymentTerm: PaymentTerm) => void
): ColumnDef<PaymentTerm>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        코드
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('code')}</div>
        <div className="text-xs text-muted-foreground">{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'days',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        기한(일)
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const days = row.getValue('days') as number;
      if (days === -1) return <span className="font-medium">선금</span>;
      if (days === 0) return <span className="font-medium">현금</span>;
      return <span className="font-medium">{days}일</span>;
    },
  },
  {
    accessorKey: 'description',
    header: '설명',
    cell: ({ row }) => <div className="text-sm">{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'is_active',
    header: '상태',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active');
      return (
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">활성</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span className="text-sm">비활성</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        생성일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      return <div className="text-sm">{formatDateTime(createdAt)}</div>;
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        수정일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue('updated_at') as string;
      return <div className="text-sm">{formatDateTime(updatedAt)}</div>;
    },
  },
  {
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEditPaymentTerm(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeletePaymentTerm(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function PaymentTermsPage() {
  const {
    selectedDays,
    selectedStatus,
  } = usePaymentTermsStore();

  // 필터링된 데이터
  const filteredPaymentTerms = useMemo(() => {
    return dummyPaymentTerms.filter((paymentTerm) => {
      if (selectedDays !== null && paymentTerm.days !== selectedDays) return false;
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !paymentTerm.is_active : paymentTerm.is_active)
      )
        return false;
      return true;
    });
  }, [selectedDays, selectedStatus]);

  const handleEditPaymentTerm = (paymentTerm: PaymentTerm) => {
    const { openForm } = usePaymentTermsStore.getState();
    openForm(paymentTerm.id);
  };

  const handleDeletePaymentTerm = (paymentTerm: PaymentTerm) => {
    console.log('Delete payment term:', paymentTerm);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = usePaymentTermsStore.getState();
    if (editingId) {
      console.log('Update payment term:', editingId, formData);
    } else {
      console.log('Create payment term:', formData);
    }
  };

  const columns = createColumns(handleEditPaymentTerm, handleDeletePaymentTerm);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <PaymentTermsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <PaymentTermsStats paymentTerms={dummyPaymentTerms} />

      {/* 필터 섹션 */}
      <PaymentTermsFilters paymentTerms={dummyPaymentTerms} />

      {/* 데이터 테이블 */}
      <PaymentTermsList columns={columns} data={filteredPaymentTerms} />

      {/* 페이지네이션 */}
      <PaymentTermsPaging totalItems={filteredPaymentTerms.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <PaymentTermsEdit paymentTerms={dummyPaymentTerms} onSubmit={handleFormSubmit} />
    </div>
  );
}
