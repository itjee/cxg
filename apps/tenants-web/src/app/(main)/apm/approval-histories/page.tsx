'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ApprovalHistoriesHeader,
  ApprovalHistoriesStats,
  ApprovalHistoriesFilters,
  ApprovalHistoriesList,
  ApprovalHistoriesPaging,
  ApprovalHistoriesEdit,
} from '@/features/apm/approval-histories';
import { useApprovalHistoriesStore } from '@/features/apm/approval-histories/stores';

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

interface ApprovalHistory {
  id: string;
  request_id: string;
  request_number: string;
  approver_id: string;
  approver_name: string;
  action: 'APPROVED' | 'REJECTED' | 'RETURNED' | 'COMMENTED';
  comment?: string;
  created_at: string;
  updated_at: string;
}

const dummyHistories: ApprovalHistory[] = [
  {
    id: '1',
    request_id: 'req-1',
    request_number: 'APR-2024-001',
    approver_id: 'user-approver-1',
    approver_name: '최승인',
    action: 'APPROVED',
    comment: '승인하였습니다.',
    created_at: '2024-11-02T10:00:00Z',
    updated_at: '2024-11-02T10:00:00Z',
  },
  {
    id: '2',
    request_id: 'req-2',
    request_number: 'APR-2024-002',
    approver_id: 'user-approver-2',
    approver_name: '홍결재',
    action: 'COMMENTED',
    comment: '추가 자료를 제출해주세요.',
    created_at: '2024-11-01T14:30:00Z',
    updated_at: '2024-11-01T14:30:00Z',
  },
  {
    id: '3',
    request_id: 'req-3',
    request_number: 'APR-2024-003',
    approver_id: 'user-approver-3',
    approver_name: '박심사',
    action: 'RETURNED',
    comment: '내용 수정 후 재제출 부탁합니다.',
    created_at: '2024-10-31T11:45:00Z',
    updated_at: '2024-10-31T11:45:00Z',
  },
];

const createColumns = (
  onEditHistory: (history: ApprovalHistory) => void,
  onDeleteHistory: (history: ApprovalHistory) => void
): ColumnDef<ApprovalHistory>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'request_number',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        결재번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('request_number')}</div>,
  },
  {
    accessorKey: 'approver_name',
    header: '결재자',
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('approver_name')}</div>,
  },
  {
    accessorKey: 'action',
    header: '처리',
    cell: ({ row }) => {
      const action = row.getValue('action') as string;
      const actionMap: Record<string, string> = { APPROVED: '승인', REJECTED: '반려', RETURNED: '반송', COMMENTED: '의견' };
      const actionColors: Record<string, string> = { APPROVED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', REJECTED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400', RETURNED: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400', COMMENTED: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${actionColors[action] || 'bg-gray-50'}`}>
          {actionMap[action] || action}
        </div>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: '의견',
    cell: ({ row }) => {
      const comment = row.getValue('comment') as string;
      return <div className="text-sm text-muted-foreground">{comment || '-'}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: '처리일시',
    cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('created_at') as string)}</div>,
  },
  {
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditHistory(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteHistory(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function ApprovalHistoriesPage() {
  const store = useApprovalHistoriesStore();
  const filteredHistories = useMemo(() => dummyHistories.filter(() => true), []);
  const columns = createColumns((h) => store.openForm(h.id), () => {});

  return (
    <div className="space-y-6">
      <ApprovalHistoriesHeader onRefresh={() => {}} onExport={() => {}} />
      <ApprovalHistoriesStats histories={dummyHistories} />
      <ApprovalHistoriesFilters histories={dummyHistories} />
      <ApprovalHistoriesList columns={columns} data={filteredHistories} />
      <ApprovalHistoriesPaging totalItems={filteredHistories.length} itemsPerPage={10} />
      <ApprovalHistoriesEdit histories={dummyHistories} onSubmit={() => {}} />
    </div>
  );
}
