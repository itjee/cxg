'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  RfqsHeader,
  RfqsStats,
  RfqsFilters,
  RfqsTable,
  RfqsPaging,
  RfqsEdit,
} from '@/features/crm/rfqs';
import { useRfqsStore } from '@/features/crm/rfqs/stores';

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

interface Rfq {
  id: string;
  rfq_number: string;
  partner_id: string;
  partner_name: string;
  title: string;
  item_count: number;
  total_amount?: number;
  status: 'DRAFT' | 'SENT' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'CLOSED';
  due_date: string;
  created_at: string;
  updated_at: string;
}

const dummyRfqs: Rfq[] = [
  {
    id: '1',
    rfq_number: 'RFQ-2024-001',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    title: '서버 장비 및 부품 구매 요청',
    item_count: 5,
    total_amount: 5000000,
    status: 'QUOTED',
    due_date: '2024-10-20',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-05T14:00:00Z',
  },
  {
    id: '2',
    rfq_number: 'RFQ-2024-002',
    partner_id: 'partner-2',
    partner_name: 'XYZ Corp',
    title: '네트워크 장비 구매 요청',
    item_count: 3,
    total_amount: 3500000,
    status: 'SENT',
    due_date: '2024-10-25',
    created_at: '2024-10-15T09:30:00Z',
    updated_at: '2024-10-15T09:30:00Z',
  },
  {
    id: '3',
    rfq_number: 'RFQ-2024-003',
    partner_id: 'partner-3',
    partner_name: 'DEF 솔루션',
    title: '소프트웨어 라이선스 구매',
    item_count: 2,
    total_amount: 2000000,
    status: 'DRAFT',
    due_date: '2024-11-10',
    created_at: '2024-10-20T11:00:00Z',
    updated_at: '2024-10-20T11:00:00Z',
  },
];

const createColumns = (
  onEditRfq: (rfq: Rfq) => void,
  onDeleteRfq: (rfq: Rfq) => void
): ColumnDef<Rfq>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'rfq_number',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        RFQ번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('rfq_number')}</div>
        <div className="text-xs text-muted-foreground">{row.original.title}</div>
      </div>
    ),
  },
  {
    accessorKey: 'partner_name',
    header: '거래처',
    cell: ({ row }) => <div className="text-sm">{row.getValue('partner_name')}</div>,
  },
  {
    accessorKey: 'item_count',
    header: '항목수',
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('item_count')} 개</div>,
  },
  {
    accessorKey: 'total_amount',
    header: '총액',
    cell: ({ row }) => {
      const amount = row.getValue('total_amount') as number;
      return <div className="text-sm font-medium">{amount ? `${(amount / 1000000).toFixed(1)}백만원` : '-'}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { DRAFT: '초안', SENT: '발송됨', QUOTED: '견적완료', ACCEPTED: '승인', REJECTED: '거절', CLOSED: '종료' };
      const statusColors: Record<string, string> = { DRAFT: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', SENT: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', QUOTED: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400', ACCEPTED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', REJECTED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400', CLOSED: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'due_date',
    header: '마감일',
    cell: ({ row }) => {
      const date = new Date(row.getValue('due_date') as string).toLocaleDateString('ko-KR');
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditRfq(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteRfq(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function RfqsPage() {
  const store = useRfqsStore();
  const filteredRfqs = useMemo(() => dummyRfqs.filter(() => true), []);
  const columns = createColumns((r) => store.openForm(r.id), () => {});

  return (
    <div className="space-y-6">
      <RfqsHeader onRefresh={() => {}} onExport={() => {}} />
      <RfqsStats rfqs={dummyRfqs} />
      <RfqsFilters rfqs={dummyRfqs} />
      <RfqsTable columns={columns} data={filteredRfqs} />
      <RfqsPaging totalItems={filteredRfqs.length} itemsPerPage={10} />
      <RfqsEdit rfqs={dummyRfqs} onSubmit={() => {}} />
    </div>
  );
}
