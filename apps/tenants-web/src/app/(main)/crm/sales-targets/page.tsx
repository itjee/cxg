'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  SalesTargetsHeader,
  SalesTargetsStats,
  SalesTargetsFilters,
  SalesTargetsTable,
  SalesTargetsPaging,
  SalesTargetsEdit,
} from '@/features/crm/sales-targets';
import { useSalesTargetsStore } from '@/features/crm/sales-targets/stores';

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

interface SalesTarget {
  id: string;
  year: number;
  month: number;
  sales_person_id: string;
  sales_person_name: string;
  department: string;
  target_amount: number;
  achieved_amount: number;
  achievement_rate: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

const dummyTargets: SalesTarget[] = [
  {
    id: '1',
    year: 2024,
    month: 11,
    sales_person_id: 'sales-1',
    sales_person_name: '김영업',
    department: '영업팀',
    target_amount: 50000000,
    achieved_amount: 45000000,
    achievement_rate: 90,
    status: 'IN_PROGRESS',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    year: 2024,
    month: 10,
    sales_person_id: 'sales-1',
    sales_person_name: '김영업',
    department: '영업팀',
    target_amount: 50000000,
    achieved_amount: 52000000,
    achievement_rate: 104,
    status: 'COMPLETED',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-31T17:00:00Z',
  },
  {
    id: '3',
    year: 2024,
    month: 11,
    sales_person_id: 'sales-2',
    sales_person_name: '이판매',
    department: '판매팀',
    target_amount: 35000000,
    achieved_amount: 28000000,
    achievement_rate: 80,
    status: 'IN_PROGRESS',
    created_at: '2024-11-01T14:00:00Z',
    updated_at: '2024-11-01T14:00:00Z',
  },
];

const createColumns = (
  onEditTarget: (target: SalesTarget) => void,
  onDeleteTarget: (target: SalesTarget) => void
): ColumnDef<SalesTarget>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'sales_person_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        판매자
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('sales_person_name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.department}</div>
      </div>
    ),
  },
  {
    accessorKey: 'year',
    header: '연도',
    cell: ({ row }) => {
      const year = row.getValue('year');
      const month = row.original.month;
      return <div className="text-sm font-medium">{year}년 {month}월</div>;
    },
  },
  {
    accessorKey: 'target_amount',
    header: '목표금액',
    cell: ({ row }) => {
      const amount = row.getValue('target_amount') as number;
      return <div className="text-sm font-medium">{(amount / 1000000).toFixed(1)}백만원</div>;
    },
  },
  {
    accessorKey: 'achieved_amount',
    header: '달성금액',
    cell: ({ row }) => {
      const amount = row.getValue('achieved_amount') as number;
      return <div className="text-sm font-medium">{(amount / 1000000).toFixed(1)}백만원</div>;
    },
  },
  {
    accessorKey: 'achievement_rate',
    header: '달성률',
    cell: ({ row }) => {
      const rate = row.getValue('achievement_rate') as number;
      const color = rate >= 100 ? 'text-green-700 dark:text-green-400' : rate >= 80 ? 'text-blue-700 dark:text-blue-400' : 'text-yellow-700 dark:text-yellow-400';
      return <div className={`text-sm font-medium ${color}`}>{rate}%</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { PLANNED: '계획중', IN_PROGRESS: '진행중', COMPLETED: '완료', FAILED: '미달성' };
      const statusColors: Record<string, string> = { PLANNED: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', IN_PROGRESS: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', COMPLETED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', FAILED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditTarget(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteTarget(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function SalesTargetsPage() {
  const store = useSalesTargetsStore();
  const filteredTargets = useMemo(() => dummyTargets.filter(() => true), []);
  const columns = createColumns((t) => store.openForm(t.id), () => {});

  return (
    <div className="space-y-6">
      <SalesTargetsHeader onRefresh={() => {}} onExport={() => {}} />
      <SalesTargetsStats targets={dummyTargets} />
      <SalesTargetsFilters targets={dummyTargets} />
      <SalesTargetsTable columns={columns} data={filteredTargets} />
      <SalesTargetsPaging totalItems={filteredTargets.length} itemsPerPage={10} />
      <SalesTargetsEdit targets={dummyTargets} onSubmit={() => {}} />
    </div>
  );
}
