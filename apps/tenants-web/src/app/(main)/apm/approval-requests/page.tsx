'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ApprovalRequestsHeader,
  ApprovalRequestsStats,
  ApprovalRequestsFilters,
  ApprovalRequestsList,
  ApprovalRequestsPaging,
  ApprovalRequestsEdit,
} from '@/features/apm/approval-requests';
import { useApprovalRequestsStore } from '@/features/apm/approval-requests/stores';

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

interface ApprovalRequest {
  id: string;
  request_number: string;
  title: string;
  requester_id: string;
  requester_name: string;
  department: string;
  amount?: number;
  status: 'DRAFT' | 'SUBMITTED' | 'IN_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  created_at: string;
  updated_at: string;
}

const dummyRequests: ApprovalRequest[] = [
  {
    id: '1',
    request_number: 'APR-2024-001',
    title: '마케팅 예산 승인 요청',
    requester_id: 'user-1',
    requester_name: '김영수',
    department: '마케팅팀',
    amount: 5000000,
    status: 'IN_APPROVAL',
    priority: 'HIGH',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-02T14:00:00Z',
  },
  {
    id: '2',
    request_number: 'APR-2024-002',
    title: '출장 비용 승인',
    requester_id: 'user-2',
    requester_name: '이순신',
    department: '영업팀',
    amount: 1500000,
    status: 'APPROVED',
    priority: 'NORMAL',
    created_at: '2024-10-28T09:30:00Z',
    updated_at: '2024-10-30T17:00:00Z',
  },
  {
    id: '3',
    request_number: 'APR-2024-003',
    title: '장비 구매 요청',
    requester_id: 'user-3',
    requester_name: '박지성',
    department: '개발팀',
    amount: 8000000,
    status: 'SUBMITTED',
    priority: 'URGENT',
    created_at: '2024-11-02T11:15:00Z',
    updated_at: '2024-11-02T11:15:00Z',
  },
];

const createColumns = (
  onEditRequest: (request: ApprovalRequest) => void,
  onDeleteRequest: (request: ApprovalRequest) => void
): ColumnDef<ApprovalRequest>[] => [
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
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('request_number')}</div>
        <div className="text-xs text-muted-foreground">{row.original.title}</div>
      </div>
    ),
  },
  {
    accessorKey: 'requester_name',
    header: '요청자',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('requester_name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.department}</div>
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: '금액',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return <div className="text-sm font-medium">{amount ? `${(amount / 1000000).toFixed(1)}백만원` : '-'}</div>;
    },
  },
  {
    accessorKey: 'priority',
    header: '우선순위',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      const priorityMap: Record<string, string> = { LOW: '낮음', NORMAL: '보통', HIGH: '높음', URGENT: '긴급' };
      const priorityColors: Record<string, string> = { LOW: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', NORMAL: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', HIGH: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400', URGENT: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${priorityColors[priority] || 'bg-gray-50'}`}>
          {priorityMap[priority] || priority}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { DRAFT: '초안', SUBMITTED: '제출됨', IN_APPROVAL: '결재중', APPROVED: '승인됨', REJECTED: '반려됨', CANCELLED: '취소됨' };
      const statusColors: Record<string, string> = { DRAFT: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', SUBMITTED: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', IN_APPROVAL: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400', APPROVED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', REJECTED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400', CANCELLED: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' };
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditRequest(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteRequest(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function ApprovalRequestsPage() {
  const store = useApprovalRequestsStore();
  const filteredRequests = useMemo(() => dummyRequests.filter(() => true), []);
  const columns = createColumns((r) => store.openForm(r.id), () => {});

  return (
    <div className="space-y-6">
      <ApprovalRequestsHeader onRefresh={() => {}} onExport={() => {}} />
      <ApprovalRequestsStats requests={dummyRequests} />
      <ApprovalRequestsFilters requests={dummyRequests} />
      <ApprovalRequestsList columns={columns} data={filteredRequests} />
      <ApprovalRequestsPaging totalItems={filteredRequests.length} itemsPerPage={10} />
      <ApprovalRequestsEdit requests={dummyRequests} onSubmit={() => {}} />
    </div>
  );
}
