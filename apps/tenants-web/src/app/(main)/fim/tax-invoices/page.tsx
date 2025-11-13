'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  TaxInvoicesHeader,
  TaxInvoicesStats,
  TaxInvoicesFilters,
  TaxInvoicesList,
  TaxInvoicesPaging,
  TaxInvoicesEdit,
} from '@/features/fim/tax-invoices';
import { useTaxInvoicesStore } from '@/features/fim/tax-invoices/stores';

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

// TaxInvoice 인터페이스 정의
interface TaxInvoice {
  id: string;
  invoice_number: string;
  issuer_name: string;
  supplier_name: string;
  amount: number;
  status: '미발행' | '발행' | '취소';
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyTaxInvoices: TaxInvoice[] = [
  {
    id: '1',
    invoice_number: 'TAX-2025-001',
    issuer_name: '(주)우리회사',
    supplier_name: '(주)삼성물산',
    amount: 110000000,
    status: '발행',
    created_at: '2025-10-28T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    invoice_number: 'TAX-2025-002',
    issuer_name: '(주)우리회사',
    supplier_name: '현대건설(주)',
    amount: 88000000,
    status: '미발행',
    created_at: '2025-10-27T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    invoice_number: 'TAX-2025-003',
    issuer_name: '(주)우리회사',
    supplier_name: 'LG전자',
    amount: 33000000,
    status: '취소',
    created_at: '2025-10-25T00:00:00Z',
    updated_at: '2025-10-26T15:20:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  return `${(amount / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditTaxInvoice: (taxInvoice: TaxInvoice) => void,
  onDeleteTaxInvoice: (taxInvoice: TaxInvoice) => void
): ColumnDef<TaxInvoice>[] => [
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
    accessorKey: 'issuer_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        발급사
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('issuer_name')}</div>
    ),
  },
  {
    accessorKey: 'supplier_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        공급사
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('supplier_name')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        금액
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-right font-medium">
        {formatAmount(row.getValue('amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorMap: Record<string, string> = {
        '미발행': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        '발행': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        '취소': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
      };
      return (
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${status === '발행' ? 'bg-green-500' : status === '미발행' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
          <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${colorMap[status]}`}>
            {status}
          </div>
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
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEditTaxInvoice(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteTaxInvoice(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function TaxInvoicesPage() {
  const {
    selectedStatus,
  } = useTaxInvoicesStore();

  // 필터링된 데이터
  const filteredTaxInvoices = useMemo(() => {
    return dummyTaxInvoices.filter((invoice) => {
      if (selectedStatus && invoice.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditTaxInvoice = (invoice: TaxInvoice) => {
    const { openForm } = useTaxInvoicesStore.getState();
    openForm(invoice.id);
  };

  const handleDeleteTaxInvoice = (invoice: TaxInvoice) => {
    console.log('Delete tax invoice:', invoice);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useTaxInvoicesStore.getState();
    if (editingId) {
      console.log('Update tax invoice:', editingId, formData);
    } else {
      console.log('Create tax invoice:', formData);
    }
  };

  const columns = createColumns(handleEditTaxInvoice, handleDeleteTaxInvoice);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <TaxInvoicesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <TaxInvoicesStats taxInvoices={dummyTaxInvoices} />

      {/* 필터 섹션 */}
      <TaxInvoicesFilters taxInvoices={dummyTaxInvoices} />

      {/* 데이터 테이블 */}
      <TaxInvoicesList columns={columns} data={filteredTaxInvoices} />

      {/* 페이지네이션 */}
      <TaxInvoicesPaging totalItems={filteredTaxInvoices.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <TaxInvoicesEdit taxInvoices={dummyTaxInvoices} onSubmit={handleFormSubmit} />
    </div>
  );
}
