'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  AccountsPayableHeader,
  AccountsPayableStats,
  AccountsPayableFilters,
  AccountsPayableList,
  AccountsPayablePaging,
  AccountsPayableEdit,
} from '@/features/fim/accounts-payable';
import { useAccountsPayableStore } from '@/features/fim/accounts-payable/stores';

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

// AccountPayable 인터페이스 정의
interface AccountPayable {
  id: string;
  vendor_name: string;
  invoice_amount: number;
  paid_amount: number;
  unpaid_amount: number;
  status: '미지급' | '부분지급' | '완전지급';
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyAccountsPayable: AccountPayable[] = [
  {
    id: '1',
    vendor_name: '(주)삼성물산',
    invoice_amount: 50000000,
    paid_amount: 0,
    unpaid_amount: 50000000,
    status: '미지급',
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    vendor_name: '현대건설(주)',
    invoice_amount: 80000000,
    paid_amount: 40000000,
    unpaid_amount: 40000000,
    status: '부분지급',
    created_at: '2025-09-15T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    vendor_name: 'LG전자',
    invoice_amount: 30000000,
    paid_amount: 30000000,
    unpaid_amount: 0,
    status: '완전지급',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-09-30T15:20:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  return `${(amount / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditAccountPayable: (accountPayable: AccountPayable) => void,
  onDeleteAccountPayable: (accountPayable: AccountPayable) => void
): ColumnDef<AccountPayable>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'vendor_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        거래처
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('vendor_name')}</div>
    ),
  },
  {
    accessorKey: 'invoice_amount',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        청구금액
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-right font-medium">
        {formatAmount(row.getValue('invoice_amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'paid_amount',
    header: '지급금액',
    cell: ({ row }) => (
      <div className="text-sm text-right text-green-600 dark:text-green-400">
        {formatAmount(row.getValue('paid_amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'unpaid_amount',
    header: '미지급금액',
    cell: ({ row }) => (
      <div className="text-sm text-right text-red-600 dark:text-red-400">
        {formatAmount(row.getValue('unpaid_amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorMap: Record<string, string> = {
        '미지급': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        '부분지급': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        '완전지급': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      };
      return (
        <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${colorMap[status]}`}>
          {status}
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
          onClick={() => onEditAccountPayable(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteAccountPayable(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function AccountsPayablePage() {
  const {
    selectedStatus,
  } = useAccountsPayableStore();

  // 필터링된 데이터
  const filteredAccountsPayable = useMemo(() => {
    return dummyAccountsPayable.filter((accountPayable) => {
      if (selectedStatus && accountPayable.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditAccountPayable = (accountPayable: AccountPayable) => {
    const { openForm } = useAccountsPayableStore.getState();
    openForm(accountPayable.id);
  };

  const handleDeleteAccountPayable = (accountPayable: AccountPayable) => {
    console.log('Delete account payable:', accountPayable);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useAccountsPayableStore.getState();
    if (editingId) {
      console.log('Update account payable:', editingId, formData);
    } else {
      console.log('Create account payable:', formData);
    }
  };

  const columns = createColumns(handleEditAccountPayable, handleDeleteAccountPayable);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <AccountsPayableHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <AccountsPayableStats accountsPayable={dummyAccountsPayable} />

      {/* 필터 섹션 */}
      <AccountsPayableFilters accountsPayable={dummyAccountsPayable} />

      {/* 데이터 테이블 */}
      <AccountsPayableList columns={columns} data={filteredAccountsPayable} />

      {/* 페이지네이션 */}
      <AccountsPayablePaging totalItems={filteredAccountsPayable.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <AccountsPayableEdit accountsPayable={dummyAccountsPayable} onSubmit={handleFormSubmit} />
    </div>
  );
}
