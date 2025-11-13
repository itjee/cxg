'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  CustomerSegmentMembersHeader,
  CustomerSegmentMembersStats,
  CustomerSegmentMembersFilters,
  CustomerSegmentMembersTable,
  CustomerSegmentMembersPaging,
  CustomerSegmentMembersEdit,
} from '@/features/crm/customer-segment-members';
import { useCustomerSegmentMembersStore } from '@/features/crm/customer-segment-members/stores';

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

interface CustomerSegmentMember {
  id: string;
  segment_id: string;
  segment_name: string;
  customer_id: string;
  customer_name: string;
  email: string;
  phone?: string;
  added_date: string;
  created_at: string;
  updated_at: string;
}

const dummyMembers: CustomerSegmentMember[] = [
  {
    id: '1',
    segment_id: 'seg-1',
    segment_name: '프리미엄 고객',
    customer_id: 'cust-1',
    customer_name: '김영수',
    email: 'kim@company.com',
    phone: '010-1234-5678',
    added_date: '2024-09-01',
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2024-09-01T10:00:00Z',
  },
  {
    id: '2',
    segment_id: 'seg-1',
    segment_name: '프리미엄 고객',
    customer_id: 'cust-2',
    customer_name: '이순신',
    email: 'lee@company.com',
    phone: '010-2345-6789',
    added_date: '2024-10-15',
    created_at: '2024-10-15T14:00:00Z',
    updated_at: '2024-10-15T14:00:00Z',
  },
  {
    id: '3',
    segment_id: 'seg-2',
    segment_name: '활동 고객',
    customer_id: 'cust-3',
    customer_name: '박지성',
    email: 'park@company.com',
    phone: '010-3456-7890',
    added_date: '2024-11-01',
    created_at: '2024-11-01T09:30:00Z',
    updated_at: '2024-11-01T09:30:00Z',
  },
];

const createColumns = (
  onEditMember: (member: CustomerSegmentMember) => void,
  onDeleteMember: (member: CustomerSegmentMember) => void
): ColumnDef<CustomerSegmentMember>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'segment_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        세그먼트
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('segment_name')}</div>,
  },
  {
    accessorKey: 'customer_name',
    header: '고객명',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('customer_name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'added_date',
    header: '추가일시',
    cell: ({ row }) => {
      const date = new Date(row.getValue('added_date') as string).toLocaleDateString('ko-KR');
      return <div className="text-sm">{date}</div>;
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditMember(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteMember(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function CustomerSegmentMembersPage() {
  const store = useCustomerSegmentMembersStore();
  const filteredMembers = useMemo(() => dummyMembers.filter(() => true), []);
  const columns = createColumns((m) => store.openForm(m.id), () => {});

  return (
    <div className="space-y-6">
      <CustomerSegmentMembersHeader onRefresh={() => {}} onExport={() => {}} />
      <CustomerSegmentMembersStats members={dummyMembers} />
      <CustomerSegmentMembersFilters members={dummyMembers} />
      <CustomerSegmentMembersTable columns={columns} data={filteredMembers} />
      <CustomerSegmentMembersPaging totalItems={filteredMembers.length} itemsPerPage={10} />
      <CustomerSegmentMembersEdit members={dummyMembers} onSubmit={() => {}} />
    </div>
  );
}
