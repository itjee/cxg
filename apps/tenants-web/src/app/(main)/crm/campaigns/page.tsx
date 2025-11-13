'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  CampaignsHeader,
  CampaignsStats,
  CampaignsFilters,
  CampaignsTable,
  CampaignsPaging,
  CampaignsEdit,
} from '@/features/crm/campaigns';
import { useCampaignsStore } from '@/features/crm/campaigns/stores';

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

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'SUSPENDED';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

const dummyCampaigns: Campaign[] = [
  {
    id: '1',
    name: '이메일 마케팅 캠페인',
    type: 'EMAIL',
    status: 'RUNNING',
    start_date: '2024-11-01',
    end_date: '2024-11-30',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'SNS 프로모션',
    type: 'SOCIAL',
    status: 'RUNNING',
    start_date: '2024-10-15',
    end_date: '2024-11-15',
    created_at: '2024-10-15T14:00:00Z',
    updated_at: '2024-10-15T14:00:00Z',
  },
  {
    id: '3',
    name: '연말 세일',
    type: 'PROMOTION',
    status: 'COMPLETED',
    start_date: '2023-12-01',
    end_date: '2023-12-31',
    created_at: '2023-12-01T09:00:00Z',
    updated_at: '2023-12-31T17:00:00Z',
  },
];

const createColumns = (
  onEditCampaign: (campaign: Campaign) => void,
  onDeleteCampaign: (campaign: Campaign) => void
): ColumnDef<Campaign>[] => [
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
        캠페인명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'type',
    header: '유형',
    cell: ({ row }) => <div className="text-sm">{row.getValue('type')}</div>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { DRAFT: '초안', RUNNING: '진행중', COMPLETED: '완료', SUSPENDED: '일시정지' };
      const statusColors: Record<string, string> = { DRAFT: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', RUNNING: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', COMPLETED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', SUSPENDED: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'start_date',
    header: '기간',
    cell: ({ row }) => {
      const start = new Date(row.getValue('start_date') as string).toLocaleDateString('ko-KR');
      const end = new Date(row.original.end_date).toLocaleDateString('ko-KR');
      return <div className="text-sm">{start} ~ {end}</div>;
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditCampaign(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteCampaign(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function CampaignsPage() {
  const campaignStore = useCampaignsStore();
  const filteredCampaigns = useMemo(() => dummyCampaigns.filter(() => true), []);
  const columns = createColumns((c) => campaignStore.openForm(c.id), () => {});

  return (
    <div className="space-y-6">
      <CampaignsHeader onRefresh={() => {}} onExport={() => {}} />
      <CampaignsStats campaigns={dummyCampaigns} />
      <CampaignsFilters campaigns={dummyCampaigns} />
      <CampaignsTable columns={columns} data={filteredCampaigns} />
      <CampaignsPaging totalItems={filteredCampaigns.length} itemsPerPage={10} />
      <CampaignsEdit campaigns={dummyCampaigns} onSubmit={() => {}} />
    </div>
  );
}
