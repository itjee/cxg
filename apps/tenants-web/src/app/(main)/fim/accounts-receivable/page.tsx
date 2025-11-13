'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  AccountsReceivableHeader,
  AccountsReceivableStats,
  AccountsReceivableFilters,
  AccountsReceivableList,
  AccountsReceivablePaging,
  AccountsReceivableEdit,
} from '@/features/fim/accounts-receivable';
import { useAccountsReceivableStore } from '@/features/fim/accounts-receivable/stores';

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

// AccountReceivable 인터페이스 정의
interface AccountReceivable {
  id: string;
  customer_name: string;
  invoice_amount: number;
  received_amount: number;
  outstanding_amount: number;
  status: '미수' | '부분수금' | '완전수금';
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyAccountsReceivable: AccountReceivable[] = [
  {
    id: '1',
    customer_name: '한국전력공사',
    invoice_amount: 120000000,
    received_amount: 0,
    outstanding_amount: 120000000,
    status: '미수',
    created_at: '2025-10-15T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    customer_name: '포스코',
    invoice_amount: 95000000,
    received_amount: 50000000,
    outstanding_amount: 45000000,
    status: '부분수금',
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    customer_name: 'SK하이닉스',
    invoice_amount: 75000000,
    received_amount: 75000000,
    outstanding_amount: 0,
    status: '완전수금',
    created_at: '2025-09-20T00:00:00Z',
    updated_at: '2025-10-10T15:20:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  return `${(amount / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditAccountReceivable: (accountReceivable: AccountReceivable) => void,
  onDeleteAccountReceivable: (accountReceivable: AccountReceivable) => void
): ColumnDef<AccountReceivable>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'customer_name',
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
      <div className="font-medium">{row.getValue('customer_name')}</div>
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
    accessorKey: 'received_amount',
    header: '수금금액',
    cell: ({ row }) => (
      <div className="text-sm text-right text-green-600 dark:text-green-400">
        {formatAmount(row.getValue('received_amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'outstanding_amount',
    header: '미수금액',
    cell: ({ row }) => (
      <div className="text-sm text-right text-red-600 dark:text-red-400">
        {formatAmount(row.getValue('outstanding_amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorMap: Record<string, string> = {
        '미수': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        '부분수금': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        '완전수금': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
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
          onClick={() => onEditAccountReceivable(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteAccountReceivable(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function AccountsReceivablePage() {
  const {
    selectedStatus,
  } = useAccountsReceivableStore();

  // 필터링된 데이터
  const filteredAccountsReceivable = useMemo(() => {
    return dummyAccountsReceivable.filter((accountReceivable) => {
      if (selectedStatus && accountReceivable.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditAccountReceivable = (accountReceivable: AccountReceivable) => {
    const { openForm } = useAccountsReceivableStore.getState();
    openForm(accountReceivable.id);
  };

  const handleDeleteAccountReceivable = (accountReceivable: AccountReceivable) => {
    console.log('Delete account receivable:', accountReceivable);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useAccountsReceivableStore.getState();
    if (editingId) {
      console.log('Update account receivable:', editingId, formData);
    } else {
      console.log('Create account receivable:', formData);
    }
  };

  const columns = createColumns(handleEditAccountReceivable, handleDeleteAccountReceivable);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <AccountsReceivableHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <AccountsReceivableStats accountsReceivable={dummyAccountsReceivable} />

      {/* 필터 섹션 */}
      <AccountsReceivableFilters accountsReceivable={dummyAccountsReceivable} />

      {/* 데이터 테이블 */}
      <AccountsReceivableList columns={columns} data={filteredAccountsReceivable} />

      {/* 페이지네이션 */}
      <AccountsReceivablePaging totalItems={filteredAccountsReceivable.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <AccountsReceivableEdit accountsReceivable={dummyAccountsReceivable} onSubmit={handleFormSubmit} />
    </div>
  );
}
