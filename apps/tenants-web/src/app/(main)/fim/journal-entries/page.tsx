'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  JournalEntriesHeader,
  JournalEntriesStats,
  JournalEntriesFilters,
  JournalEntriesList,
  JournalEntriesPaging,
  JournalEntriesEdit,
} from '@/features/fim/journal-entries';
import { useJournalEntriesStore } from '@/features/fim/journal-entries/stores';

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

// 날짜만 포맷하는 함수
function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// JournalEntry 인터페이스 정의
interface JournalEntry {
  id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  total_amount: number;
  status: '임시' | '확정' | '취소';
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyJournalEntries: JournalEntry[] = [
  {
    id: '1',
    entry_number: 'JE-2025-001',
    entry_date: '2025-10-28T00:00:00Z',
    description: '10월 급여 지급',
    total_amount: 150000000,
    status: '확정',
    created_at: '2025-10-28T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    entry_number: 'JE-2025-002',
    entry_date: '2025-10-25T00:00:00Z',
    description: '사무용품 구매',
    total_amount: 5000000,
    status: '임시',
    created_at: '2025-10-25T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '3',
    entry_number: 'JE-2025-003',
    entry_date: '2025-10-20T00:00:00Z',
    description: '매출 수정 분개',
    total_amount: 25000000,
    status: '취소',
    created_at: '2025-10-20T00:00:00Z',
    updated_at: '2025-10-22T15:20:00Z',
  },
];

// 금액 포맷 함수 (백만원 단위)
function formatAmount(amount: number): string {
  return `${(amount / 1000000).toFixed(1)}M`;
}

// 테이블 컬럼 정의
const createColumns = (
  onEditJournalEntry: (journalEntry: JournalEntry) => void,
  onDeleteJournalEntry: (journalEntry: JournalEntry) => void
): ColumnDef<JournalEntry>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'entry_number',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        분개번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('entry_number')}</div>
    ),
  },
  {
    accessorKey: 'entry_date',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        분개일자
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const entryDate = row.getValue('entry_date') as string;
      return <div className="text-sm">{formatDate(entryDate)}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: '설명',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('description')}</div>
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
      <div className="text-sm text-right font-medium">
        {formatAmount(row.getValue('total_amount'))}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colorMap: Record<string, string> = {
        '임시': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        '확정': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        '취소': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
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
          onClick={() => onEditJournalEntry(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteJournalEntry(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function JournalEntriesPage() {
  const {
    selectedStatus,
  } = useJournalEntriesStore();

  // 필터링된 데이터
  const filteredJournalEntries = useMemo(() => {
    return dummyJournalEntries.filter((entry) => {
      if (selectedStatus && entry.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditJournalEntry = (entry: JournalEntry) => {
    const { openForm } = useJournalEntriesStore.getState();
    openForm(entry.id);
  };

  const handleDeleteJournalEntry = (entry: JournalEntry) => {
    console.log('Delete journal entry:', entry);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useJournalEntriesStore.getState();
    if (editingId) {
      console.log('Update journal entry:', editingId, formData);
    } else {
      console.log('Create journal entry:', formData);
    }
  };

  const columns = createColumns(handleEditJournalEntry, handleDeleteJournalEntry);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <JournalEntriesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <JournalEntriesStats journalEntries={dummyJournalEntries} />

      {/* 필터 섹션 */}
      <JournalEntriesFilters journalEntries={dummyJournalEntries} />

      {/* 데이터 테이블 */}
      <JournalEntriesList columns={columns} data={filteredJournalEntries} />

      {/* 페이지네이션 */}
      <JournalEntriesPaging totalItems={filteredJournalEntries.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <JournalEntriesEdit journalEntries={dummyJournalEntries} onSubmit={handleFormSubmit} />
    </div>
  );
}
