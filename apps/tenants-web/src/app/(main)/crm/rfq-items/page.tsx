'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  RfqItemsHeader,
  RfqItemsStats,
  RfqItemsFilters,
  RfqItemsTable,
  RfqItemsPaging,
  RfqItemsEdit,
} from '@/features/crm/rfq-items';
import { useRfqItemsStore } from '@/features/crm/rfq-items/stores';

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

interface RfqItem {
  id: string;
  rfq_id: string;
  rfq_number: string;
  item_code: string;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price?: number;
  total_price?: number;
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

const dummyRfqItems: RfqItem[] = [
  {
    id: '1',
    rfq_id: 'rfq-1',
    rfq_number: 'RFQ-2024-001',
    item_code: 'ITEM-001',
    item_name: '서버 메모리 16GB',
    quantity: 5,
    unit: '개',
    unit_price: 150000,
    total_price: 750000,
    status: 'QUOTED',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-05T14:00:00Z',
  },
  {
    id: '2',
    rfq_id: 'rfq-1',
    rfq_number: 'RFQ-2024-001',
    item_code: 'ITEM-002',
    item_name: 'SSD 1TB',
    quantity: 10,
    unit: '개',
    unit_price: 120000,
    total_price: 1200000,
    status: 'QUOTED',
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-05T14:00:00Z',
  },
  {
    id: '3',
    rfq_id: 'rfq-2',
    rfq_number: 'RFQ-2024-002',
    item_code: 'ITEM-003',
    item_name: '네트워크 스위치',
    quantity: 2,
    unit: '대',
    unit_price: 500000,
    total_price: 1000000,
    status: 'PENDING',
    created_at: '2024-10-15T09:30:00Z',
    updated_at: '2024-10-15T09:30:00Z',
  },
];

const createColumns = (
  onEditItem: (item: RfqItem) => void,
  onDeleteItem: (item: RfqItem) => void
): ColumnDef<RfqItem>[] => [
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
    cell: ({ row }) => <div className="font-medium">{row.getValue('rfq_number')}</div>,
  },
  {
    accessorKey: 'item_code',
    header: '상품코드',
    cell: ({ row }) => <div className="text-sm font-mono">{row.getValue('item_code')}</div>,
  },
  {
    accessorKey: 'item_name',
    header: '상품명',
    cell: ({ row }) => <div className="text-sm">{row.getValue('item_name')}</div>,
  },
  {
    accessorKey: 'quantity',
    header: '수량',
    cell: ({ row }) => {
      const qty = row.getValue('quantity');
      const unit = row.original.unit;
      return <div className="text-sm">{qty} {unit}</div>;
    },
  },
  {
    accessorKey: 'total_price',
    header: '합계',
    cell: ({ row }) => {
      const price = row.getValue('total_price') as number;
      return <div className="text-sm font-medium">{price ? `${(price / 1000000).toFixed(1)}백만원` : '-'}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { PENDING: '대기중', QUOTED: '견적완료', ACCEPTED: '승인', REJECTED: '거절' };
      const statusColors: Record<string, string> = { PENDING: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400', QUOTED: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', ACCEPTED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', REJECTED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' };
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

export default function RfqItemsPage() {
  const store = useRfqItemsStore();
  const filteredItems = useMemo(() => dummyRfqItems.filter(() => true), []);
  const columns = createColumns((i) => store.openForm(i.id), () => {});

  return (
    <div className="space-y-6">
      <RfqItemsHeader onRefresh={() => {}} onExport={() => {}} />
      <RfqItemsStats items={dummyRfqItems} />
      <RfqItemsFilters items={dummyRfqItems} />
      <RfqItemsTable columns={columns} data={filteredItems} />
      <RfqItemsPaging totalItems={filteredItems.length} itemsPerPage={10} />
      <RfqItemsEdit items={dummyRfqItems} onSubmit={() => {}} />
    </div>
  );
}
