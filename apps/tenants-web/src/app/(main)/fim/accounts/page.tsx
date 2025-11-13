'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  AccountsHeader,
  AccountsStats,
  AccountsFilters,
  AccountsList,
  AccountsPaging,
  AccountsEdit,
} from '@/features/fim/accounts';
import { useAccountsStore } from '@/features/fim/accounts/stores';

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

// Account 인터페이스 정의
interface Account {
  id: string;
  account_code: string;
  account_name: string;
  account_type: '자산' | '부채' | '자본' | '수익' | '비용';
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyAccounts: Account[] = [
  {
    id: '1',
    account_code: '1010',
    account_name: '현금',
    account_type: '자산',
    currency: 'KRW',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    account_code: '2010',
    account_name: '미지급금',
    account_type: '부채',
    currency: 'KRW',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    account_code: '4010',
    account_name: '매출',
    account_type: '수익',
    currency: 'KRW',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditAccount: (account: Account) => void,
  onDeleteAccount: (account: Account) => void
): ColumnDef<Account>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'account_code',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        계정코드
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('account_code')}</div>
    ),
  },
  {
    accessorKey: 'account_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        계정명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('account_name')}</div>
    ),
  },
  {
    accessorKey: 'account_type',
    header: '계정유형',
    cell: ({ row }) => {
      const type = row.getValue('account_type') as string;
      const colorMap: Record<string, string> = {
        '자산': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        '부채': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        '자본': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        '수익': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        '비용': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
      };
      return (
        <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${colorMap[type]}`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: 'currency',
    header: '통화',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('currency')}</div>
    ),
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
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEditAccount(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteAccount(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function AccountsPage() {
  const {
    selectedType,
    selectedStatus,
  } = useAccountsStore();

  // 필터링된 데이터
  const filteredAccounts = useMemo(() => {
    return dummyAccounts.filter((account) => {
      if (selectedType && account.account_type !== selectedType) return false;
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !account.is_active : account.is_active)
      )
        return false;
      return true;
    });
  }, [selectedType, selectedStatus]);

  const handleEditAccount = (account: Account) => {
    const { openForm } = useAccountsStore.getState();
    openForm(account.id);
  };

  const handleDeleteAccount = (account: Account) => {
    console.log('Delete account:', account);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useAccountsStore.getState();
    if (editingId) {
      console.log('Update account:', editingId, formData);
    } else {
      console.log('Create account:', formData);
    }
  };

  const columns = createColumns(handleEditAccount, handleDeleteAccount);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <AccountsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <AccountsStats accounts={dummyAccounts} />

      {/* 필터 섹션 */}
      <AccountsFilters accounts={dummyAccounts} />

      {/* 데이터 테이블 */}
      <AccountsList columns={columns} data={filteredAccounts} />

      {/* 페이지네이션 */}
      <AccountsPaging totalItems={filteredAccounts.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <AccountsEdit accounts={dummyAccounts} onSubmit={handleFormSubmit} />
    </div>
  );
}
