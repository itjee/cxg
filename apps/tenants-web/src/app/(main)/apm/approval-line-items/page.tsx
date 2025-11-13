'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ApprovalLineItemsHeader,
  ApprovalLineItemsStats,
  ApprovalLineItemsFilters,
  ApprovalLineItemsList,
  ApprovalLineItemsPaging,
  ApprovalLineItemsEdit,
} from '@/features/apm/approval-line-items';
import { useApprovalLineItemsStore } from '@/features/apm/approval-line-items/stores';

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

interface ApprovalLineItem {
  id: string;
  approval_line_id: string;
  line_number: string;
  approver_id: string;
  approver_name: string;
  approval_amount_from: number;
  approval_amount_to: number;
  approval_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const dummyLineItems: ApprovalLineItem[] = [
  {
    id: '1',
    approval_line_id: 'line-1',
    line_number: 'APL-2024-001',
    approver_id: 'approver-1',
    approver_name: '이사장',
    approval_amount_from: 5000000,
    approval_amount_to: 10000000,
    approval_level: 1,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    approval_line_id: 'line-2',
    line_number: 'APL-2024-002',
    approver_id: 'approver-2',
    approver_name: '부사장',
    approval_amount_from: 1000000,
    approval_amount_to: 5000000,
    approval_level: 2,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '3',
    approval_line_id: 'line-3',
    line_number: 'APL-2024-003',
    approver_id: 'approver-3',
    approver_name: '담당이사',
    approval_amount_from: 0,
    approval_amount_to: 1000000,
    approval_level: 3,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
];

const createColumns = (
  onEditItem: (item: ApprovalLineItem) => void,
  onDeleteItem: (item: ApprovalLineItem) => void
): ColumnDef<ApprovalLineItem>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'line_number',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        결재라인
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('line_number')}</div>,
  },
  {
    accessorKey: 'approver_name',
    header: '결재자',
    cell: ({ row }) => <div className="text-sm">{row.getValue('approver_name')}</div>,
  },
  {
    accessorKey: 'approval_level',
    header: '승인레벨',
    cell: ({ row }) => {
      const level = row.getValue('approval_level') as number;
      return <div className="text-sm font-medium text-center">{level}</div>;
    },
  },
  {
    accessorKey: 'approval_amount_from',
    header: '승인범위',
    cell: ({ row }) => {
      const from = row.getValue('approval_amount_from') as number;
      const to = row.original.approval_amount_to as number;
      return (
        <div className="text-sm">
          {from === 0 ? '0' : `${(from / 1000000).toFixed(1)}백만원`} ~{' '}
          {`${(to / 1000000).toFixed(1)}백만원`}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: '상태',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <div className="text-sm">
          {isActive ? (
            <span className="px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">활성</span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400">비활성</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: '생성일시',
    cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue('created_at') as string)}</div>,
  },
  {
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditItem(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteItem(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function ApprovalLineItemsPage() {
  const store = useApprovalLineItemsStore();
  const filteredItems = useMemo(() => dummyLineItems.filter(() => true), []);
  const columns = createColumns((i) => store.openForm(i.id), () => {});

  return (
    <div className="space-y-6">
      <ApprovalLineItemsHeader onRefresh={() => {}} onExport={() => {}} />
      <ApprovalLineItemsStats items={dummyLineItems} />
      <ApprovalLineItemsFilters items={dummyLineItems} />
      <ApprovalLineItemsList columns={columns} data={filteredItems} />
      <ApprovalLineItemsPaging totalItems={filteredItems.length} itemsPerPage={10} />
      <ApprovalLineItemsEdit items={dummyLineItems} onSubmit={() => {}} />
    </div>
  );
}
