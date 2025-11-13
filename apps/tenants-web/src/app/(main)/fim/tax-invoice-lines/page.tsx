'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  TaxInvoiceLinesHeader,
  TaxInvoiceLinesStats,
  TaxInvoiceLinesFilters,
  TaxInvoiceLinesList,
  TaxInvoiceLinesPaging,
  TaxInvoiceLinesEdit,
} from '@/features/fim/tax-invoice-lines';
import { useTaxInvoiceLinesStore } from '@/features/fim/tax-invoice-lines/stores';

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

// TaxInvoiceLine 인터페이스 정의
interface TaxInvoiceLine {
  id: string;
  invoice_number: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyTaxInvoiceLines: TaxInvoiceLine[] = [
  {
    id: '1',
    invoice_number: 'TAX-2025-001',
    product_name: '서버 장비',
    quantity: 10,
    unit_price: 10000000,
    total_amount: 100000000,
    created_at: '2025-10-28T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    invoice_number: 'TAX-2025-001',
    product_name: '네트워크 스위치',
    quantity: 5,
    unit_price: 2000000,
    total_amount: 10000000,
    created_at: '2025-10-28T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    invoice_number: 'TAX-2025-002',
    product_name: '건축 자재',
    quantity: 100,
    unit_price: 880000,
    total_amount: 88000000,
    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  return `${(amount / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditTaxInvoiceLine: (taxInvoiceLine: TaxInvoiceLine) => void,
  onDeleteTaxInvoiceLine: (taxInvoiceLine: TaxInvoiceLine) => void
): ColumnDef<TaxInvoiceLine>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'invoice_number',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        송장번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('invoice_number')}</div>
    ),
  },
  {
    accessorKey: 'product_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        상품명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('product_name')}</div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        수량
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-right">{row.getValue('quantity')}</div>
    ),
  },
  {
    accessorKey: 'unit_price',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        단가
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-right">
        {formatAmount(row.getValue('unit_price'))}
      </div>
    ),
  },
  {
    accessorKey: 'total_amount',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        합계금액
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-right font-medium text-green-600 dark:text-green-400">
        {formatAmount(row.getValue('total_amount'))}
      </div>
    ),
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
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEditTaxInvoiceLine(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteTaxInvoiceLine(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function TaxInvoiceLinesPage() {
  const {
    selectedInvoice,
  } = useTaxInvoiceLinesStore();

  // 필터링된 데이터
  const filteredTaxInvoiceLines = useMemo(() => {
    return dummyTaxInvoiceLines.filter((line) => {
      if (selectedInvoice && line.invoice_number !== selectedInvoice) return false;
      return true;
    });
  }, [selectedInvoice]);

  const handleEditTaxInvoiceLine = (line: TaxInvoiceLine) => {
    const { openForm } = useTaxInvoiceLinesStore.getState();
    openForm(line.id);
  };

  const handleDeleteTaxInvoiceLine = (line: TaxInvoiceLine) => {
    console.log('Delete tax invoice line:', line);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useTaxInvoiceLinesStore.getState();
    if (editingId) {
      console.log('Update tax invoice line:', editingId, formData);
    } else {
      console.log('Create tax invoice line:', formData);
    }
  };

  const columns = createColumns(handleEditTaxInvoiceLine, handleDeleteTaxInvoiceLine);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <TaxInvoiceLinesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <TaxInvoiceLinesStats taxInvoiceLines={dummyTaxInvoiceLines} />

      {/* 필터 섹션 */}
      <TaxInvoiceLinesFilters taxInvoiceLines={dummyTaxInvoiceLines} />

      {/* 데이터 테이블 */}
      <TaxInvoiceLinesList columns={columns} data={filteredTaxInvoiceLines} />

      {/* 페이지네이션 */}
      <TaxInvoiceLinesPaging totalItems={filteredTaxInvoiceLines.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <TaxInvoiceLinesEdit taxInvoiceLines={dummyTaxInvoiceLines} onSubmit={handleFormSubmit} />
    </div>
  );
}
