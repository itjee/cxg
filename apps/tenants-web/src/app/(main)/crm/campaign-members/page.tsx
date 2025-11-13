'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  CampaignMembersHeader,
  CampaignMembersStats,
  CampaignMembersFilters,
  CampaignMembersTable,
  CampaignMembersPaging,
  CampaignMembersEdit,
} from '@/features/crm/campaign-members';
import { useCampaignMembersStore } from '@/features/crm/campaign-members/stores';

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

interface CampaignMember {
  id: string;
  campaign_id: string;
  campaign_name: string;
  customer_id: string;
  customer_name: string;
  email: string;
  phone?: string;
  status: 'PENDING' | 'SENT' | 'OPENED' | 'CLICKED' | 'CONVERTED';
  created_at: string;
  updated_at: string;
}

const dummyCampaignMembers: CampaignMember[] = [
  {
    id: '1',
    campaign_id: 'camp-1',
    campaign_name: '이메일 마케팅 캠페인',
    customer_id: 'cust-1',
    customer_name: '김영수',
    email: 'kim@company.com',
    phone: '010-1234-5678',
    status: 'SENT',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    campaign_id: 'camp-1',
    campaign_name: '이메일 마케팅 캠페인',
    customer_id: 'cust-2',
    customer_name: '이순신',
    email: 'lee@company.com',
    phone: '010-2345-6789',
    status: 'OPENED',
    created_at: '2024-11-01T10:30:00Z',
    updated_at: '2024-11-02T14:00:00Z',
  },
  {
    id: '3',
    campaign_id: 'camp-2',
    campaign_name: 'SNS 프로모션',
    customer_id: 'cust-3',
    customer_name: '박지성',
    email: 'park@company.com',
    phone: '010-3456-7890',
    status: 'CLICKED',
    created_at: '2024-10-15T14:00:00Z',
    updated_at: '2024-10-25T11:30:00Z',
  },
];

const createColumns = (
  onEditMember: (member: CampaignMember) => void,
  onDeleteMember: (member: CampaignMember) => void
): ColumnDef<CampaignMember>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'campaign_name',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        캠페인명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('campaign_name')}</div>,
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
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { PENDING: '대기중', SENT: '발송', OPENED: '오픈', CLICKED: '클릭', CONVERTED: '전환' };
      const statusColors: Record<string, string> = { PENDING: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', SENT: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', OPENED: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400', CLICKED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', CONVERTED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' };
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

export default function CampaignMembersPage() {
  const campaignMemberStore = useCampaignMembersStore();
  const filteredMembers = useMemo(() => dummyCampaignMembers.filter(() => true), []);
  const columns = createColumns((m) => campaignMemberStore.openForm(m.id), () => {});

  return (
    <div className="space-y-6">
      <CampaignMembersHeader onRefresh={() => {}} onExport={() => {}} />
      <CampaignMembersStats members={dummyCampaignMembers} />
      <CampaignMembersFilters members={dummyCampaignMembers} />
      <CampaignMembersTable columns={columns} data={filteredMembers} />
      <CampaignMembersPaging totalItems={filteredMembers.length} itemsPerPage={10} />
      <CampaignMembersEdit members={dummyCampaignMembers} onSubmit={() => {}} />
    </div>
  );
}
