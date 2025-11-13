'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ApprovalLinesHeader,
  ApprovalLinesStats,
  ApprovalLinesFilters,
  ApprovalLinesList,
  ApprovalLinesPaging,
  ApprovalLinesEdit,
} from '@/features/apm/approval-lines';
import { useApprovalLinesStore } from '@/features/apm/approval-lines/stores';

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

interface ApprovalLine {
  id: string;
  line_number: string;
  approver_id: string;
  approver_name: string;
  approver_position: string;
  approval_type: 'REQUIRE' | 'OPTIONAL' | 'NOTIFICATION';
  sequence: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const dummyLines: ApprovalLine[] = [
  {
    id: '1',
    line_number: 'APL-2024-001',
    approver_id: 'approver-1',
    approver_name: '이사장',
    approver_position: '이사',
    approval_type: 'REQUIRE',
    sequence: 1,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    line_number: 'APL-2024-002',
    approver_id: 'approver-2',
    approver_name: '부사장',
    approver_position: '부사장',
    approval_type: 'REQUIRE',
    sequence: 2,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '3',
    line_number: 'APL-2024-003',
    approver_id: 'approver-3',
    approver_name: '담당이사',
    approver_position: '이사',
    approval_type: 'OPTIONAL',
    sequence: 3,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
];

const createColumns = (
  onEditLine: (line: ApprovalLine) => void,
  onDeleteLine: (line: ApprovalLine) => void
): ColumnDef<ApprovalLine>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'sequence',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        순서
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium text-center">{row.getValue('sequence')}</div>,
  },
  {
    accessorKey: 'approver_name',
    header: '결재자',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('approver_name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.approver_position}</div>
      </div>
    ),
  },
  {
    accessorKey: 'approval_type',
    header: '결재유형',
    cell: ({ row }) => {
      const type = row.getValue('approval_type') as string;
      const typeMap: Record<string, string> = { REQUIRE: '필수', OPTIONAL: '선택', NOTIFICATION: '알림' };
      const typeColors: Record<string, string> = { REQUIRE: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400', OPTIONAL: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', NOTIFICATION: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${typeColors[type] || 'bg-gray-50'}`}>
          {typeMap[type] || type}
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditLine(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteLine(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function ApprovalLinesPage() {
  const store = useApprovalLinesStore();
  const filteredLines = useMemo(() => dummyLines.filter(() => true), []);
  const columns = createColumns((l) => store.openForm(l.id), () => {});

  return (
    <div className="space-y-6">
      <ApprovalLinesHeader onRefresh={() => {}} onExport={() => {}} />
      <ApprovalLinesStats lines={dummyLines} />
      <ApprovalLinesFilters lines={dummyLines} />
      <ApprovalLinesList columns={columns} data={filteredLines} />
      <ApprovalLinesPaging totalItems={filteredLines.length} itemsPerPage={10} />
      <ApprovalLinesEdit lines={dummyLines} onSubmit={() => {}} />
    </div>
  );
}
