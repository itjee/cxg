'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  JournalEntryLinesHeader,
  JournalEntryLinesStats,
  JournalEntryLinesFilters,
  JournalEntryLinesList,
  JournalEntryLinesPaging,
  JournalEntryLinesEdit,
} from '@/features/fim/journal-entry-lines';
import { useJournalEntryLinesStore } from '@/features/fim/journal-entry-lines/stores';

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

// JournalEntryLine 인터페이스 정의
interface JournalEntryLine {
  id: string;
  account_name: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyJournalEntryLines: JournalEntryLine[] = [
  {
    id: '1',
    account_name: '급여',
    description: '10월 급여 지급',
    debit: 150000000,
    credit: 0,
    balance: 150000000,
    created_at: '2025-10-28T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    account_name: '현금',
    description: '10월 급여 지급',
    debit: 0,
    credit: 150000000,
    balance: -150000000,
    created_at: '2025-10-28T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    account_name: '사무용품비',
    description: '사무용품 구매',
    debit: 5000000,
    credit: 0,
    balance: 5000000,
    created_at: '2025-10-25T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  const abs = Math.abs(amount);
  return `${(abs / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditJournalEntryLine: (journalEntryLine: JournalEntryLine) => void,
  onDeleteJournalEntryLine: (journalEntryLine: JournalEntryLine) => void
): ColumnDef<JournalEntryLine>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
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
      <div className="font-medium">{row.getValue('account_name')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: '분기',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'debit',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        차변
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const debit = row.getValue('debit') as number;
      return (
        <div className="text-sm text-right font-medium text-blue-600 dark:text-blue-400">
          {debit > 0 ? formatAmount(debit) : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'credit',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        대변
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const credit = row.getValue('credit') as number;
      return (
        <div className="text-sm text-right font-medium text-red-600 dark:text-red-400">
          {credit > 0 ? formatAmount(credit) : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        잔액
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const balance = row.getValue('balance') as number;
      const isPositive = balance >= 0;
      return (
        <div className={`text-sm text-right font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
          {isPositive ? '+' : '-'}{formatAmount(balance)}
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
          onClick={() => onEditJournalEntryLine(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteJournalEntryLine(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function JournalEntryLinesPage() {
  const {
    selectedAccount,
  } = useJournalEntryLinesStore();

  // 필터링된 데이터
  const filteredJournalEntryLines = useMemo(() => {
    return dummyJournalEntryLines.filter((line) => {
      if (selectedAccount && line.account_name !== selectedAccount) return false;
      return true;
    });
  }, [selectedAccount]);

  const handleEditJournalEntryLine = (line: JournalEntryLine) => {
    const { openForm } = useJournalEntryLinesStore.getState();
    openForm(line.id);
  };

  const handleDeleteJournalEntryLine = (line: JournalEntryLine) => {
    console.log('Delete journal entry line:', line);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useJournalEntryLinesStore.getState();
    if (editingId) {
      console.log('Update journal entry line:', editingId, formData);
    } else {
      console.log('Create journal entry line:', formData);
    }
  };

  const columns = createColumns(handleEditJournalEntryLine, handleDeleteJournalEntryLine);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <JournalEntryLinesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <JournalEntryLinesStats journalEntryLines={dummyJournalEntryLines} />

      {/* 필터 섹션 */}
      <JournalEntryLinesFilters journalEntryLines={dummyJournalEntryLines} />

      {/* 데이터 테이블 */}
      <JournalEntryLinesList columns={columns} data={filteredJournalEntryLines} />

      {/* 페이지네이션 */}
      <JournalEntryLinesPaging totalItems={filteredJournalEntryLines.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <JournalEntryLinesEdit journalEntryLines={dummyJournalEntryLines} onSubmit={handleFormSubmit} />
    </div>
  );
}
