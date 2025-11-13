'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  CustomerSegmentsHeader,
  CustomerSegmentsStats,
  CustomerSegmentsFilters,
  CustomerSegmentsTable,
  CustomerSegmentsPaging,
  CustomerSegmentsEdit,
} from '@/features/crm/customer-segments';
import { useCustomerSegmentsStore } from '@/features/crm/customer-segments/stores';

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

interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  type: 'BEHAVIORAL' | 'DEMOGRAPHIC' | 'GEOGRAPHIC' | 'PSYCHOGRAPHIC' | 'VALUE_BASED';
  member_count: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  created_at: string;
  updated_at: string;
}

const dummySegments: CustomerSegment[] = [
  {
    id: '1',
    name: '프리미엄 고객',
    description: '높은 구매력을 가진 고객',
    type: 'VALUE_BASED',
    member_count: 245,
    status: 'ACTIVE',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    name: '신규 고객',
    description: '최근 3개월 이내 가입한 고객',
    type: 'BEHAVIORAL',
    member_count: 128,
    status: 'ACTIVE',
    created_at: '2024-08-01T14:00:00Z',
    updated_at: '2024-10-28T14:00:00Z',
  },
  {
    id: '3',
    name: '휴면 고객',
    description: '6개월 이상 활동이 없는 고객',
    type: 'BEHAVIORAL',
    member_count: 87,
    status: 'ACTIVE',
    created_at: '2024-09-15T09:30:00Z',
    updated_at: '2024-11-01T09:30:00Z',
  },
];

const createColumns = (
  onEditSegment: (segment: CustomerSegment) => void,
  onDeleteSegment: (segment: CustomerSegment) => void
): ColumnDef<CustomerSegment>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        세그먼트명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: '유형',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const typeMap: Record<string, string> = { BEHAVIORAL: '행동기반', DEMOGRAPHIC: '인구통계', GEOGRAPHIC: '지리적', PSYCHOGRAPHIC: '심리적', VALUE_BASED: '가치기반' };
      return <div className="text-sm">{typeMap[type] || type}</div>;
    },
  },
  {
    accessorKey: 'member_count',
    header: '멤버수',
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('member_count')} 명</div>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { ACTIVE: '활성', INACTIVE: '비활성', ARCHIVED: '보관됨' };
      const statusColors: Record<string, string> = { ACTIVE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', INACTIVE: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400', ARCHIVED: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' };
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditSegment(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteSegment(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function CustomerSegmentsPage() {
  const store = useCustomerSegmentsStore();
  const filteredSegments = useMemo(() => dummySegments.filter(() => true), []);
  const columns = createColumns((s) => store.openForm(s.id), () => {});

  return (
    <div className="space-y-6">
      <CustomerSegmentsHeader onRefresh={() => {}} onExport={() => {}} />
      <CustomerSegmentsStats segments={dummySegments} />
      <CustomerSegmentsFilters segments={dummySegments} />
      <CustomerSegmentsTable columns={columns} data={filteredSegments} />
      <CustomerSegmentsPaging totalItems={filteredSegments.length} itemsPerPage={10} />
      <CustomerSegmentsEdit segments={dummySegments} onSubmit={() => {}} />
    </div>
  );
}
