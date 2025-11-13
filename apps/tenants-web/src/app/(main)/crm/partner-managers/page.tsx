'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  PartnerManagersHeader,
  PartnerManagersStats,
  PartnerManagersFilters,
  PartnerManagersTable,
  PartnerManagersPaging,
  PartnerManagersEdit,
} from '@/features/crm/partner-managers';
import { usePartnerManagersStore } from '@/features/crm/partner-managers/stores';

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

interface PartnerManager {
  id: string;
  partner_id: string;
  partner_name: string;
  manager_name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  assigned_date: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

const dummyManagers: PartnerManager[] = [
  {
    id: '1',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    manager_name: '김영업',
    department: '영업팀',
    position: '과장',
    email: 'kim.sales@example.com',
    phone: '010-1234-5678',
    assigned_date: '2024-01-01',
    status: 'ACTIVE',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    manager_name: '이판매',
    department: '판매팀',
    position: '대리',
    email: 'lee.sales@example.com',
    phone: '010-2345-6789',
    assigned_date: '2024-03-15',
    status: 'ACTIVE',
    created_at: '2024-03-15T14:00:00Z',
    updated_at: '2024-03-15T14:00:00Z',
  },
  {
    id: '3',
    partner_id: 'partner-2',
    partner_name: 'XYZ Corp',
    manager_name: '박전략',
    department: '전략팀',
    position: '부장',
    email: 'park.strategy@example.com',
    phone: '010-3456-7890',
    assigned_date: '2024-06-01',
    status: 'ACTIVE',
    created_at: '2024-06-01T09:30:00Z',
    updated_at: '2024-06-01T09:30:00Z',
  },
];

const createColumns = (
  onEditManager: (manager: PartnerManager) => void,
  onDeleteManager: (manager: PartnerManager) => void
): ColumnDef<PartnerManager>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'partner_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        거래처
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('partner_name')}</div>,
  },
  {
    accessorKey: 'manager_name',
    header: '담당자',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('manager_name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'department',
    header: '부서',
    cell: ({ row }) => <div className="text-sm">{row.getValue('department')}</div>,
  },
  {
    accessorKey: 'position',
    header: '직급',
    cell: ({ row }) => <div className="text-sm">{row.getValue('position')}</div>,
  },
  {
    accessorKey: 'phone',
    header: '연락처',
    cell: ({ row }) => <div className="text-sm font-mono">{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { ACTIVE: '활성', INACTIVE: '비활성' };
      const statusColors: Record<string, string> = { ACTIVE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', INACTIVE: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' };
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditManager(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteManager(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function PartnerManagersPage() {
  const store = usePartnerManagersStore();
  const filteredManagers = useMemo(() => dummyManagers.filter(() => true), []);
  const columns = createColumns((m) => store.openForm(m.id), () => {});

  return (
    <div className="space-y-6">
      <PartnerManagersHeader onRefresh={() => {}} onExport={() => {}} />
      <PartnerManagersStats managers={dummyManagers} />
      <PartnerManagersFilters managers={dummyManagers} />
      <PartnerManagersTable columns={columns} data={filteredManagers} />
      <PartnerManagersPaging totalItems={filteredManagers.length} itemsPerPage={10} />
      <PartnerManagersEdit managers={dummyManagers} onSubmit={() => {}} />
    </div>
  );
}
