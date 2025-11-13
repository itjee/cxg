'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  PartnerBanksHeader,
  PartnerBanksStats,
  PartnerBanksFilters,
  PartnerBanksTable,
  PartnerBanksPaging,
  PartnerBanksEdit,
} from '@/features/crm/partner-banks';
import { usePartnerBanksStore } from '@/features/crm/partner-banks/stores';

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

interface PartnerBank {
  id: string;
  partner_id: string;
  partner_name: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  swift_code?: string;
  iban?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

const dummyBanks: PartnerBank[] = [
  {
    id: '1',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    bank_name: '국민은행',
    account_number: '123-456-789012',
    account_holder: '(주)ABC',
    swift_code: 'KKBKKRSE',
    is_primary: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    bank_name: '신한은행',
    account_number: '456-789-012345',
    account_holder: '(주)ABC',
    swift_code: 'SHBKKRSE',
    is_primary: false,
    created_at: '2024-02-01T14:00:00Z',
    updated_at: '2024-02-01T14:00:00Z',
  },
  {
    id: '3',
    partner_id: 'partner-2',
    partner_name: 'XYZ Corp',
    bank_name: '하나은행',
    account_number: '789-012-345678',
    account_holder: 'XYZ Corp',
    swift_code: 'HNBKKRSE',
    is_primary: true,
    created_at: '2024-06-15T09:30:00Z',
    updated_at: '2024-06-15T09:30:00Z',
  },
];

const createColumns = (
  onEditBank: (bank: PartnerBank) => void,
  onDeleteBank: (bank: PartnerBank) => void
): ColumnDef<PartnerBank>[] => [
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
    accessorKey: 'bank_name',
    header: '은행',
    cell: ({ row }) => <div className="text-sm">{row.getValue('bank_name')}</div>,
  },
  {
    accessorKey: 'account_number',
    header: '계좌번호',
    cell: ({ row }) => (
      <div className="text-sm font-mono">{row.getValue('account_number')}</div>
    ),
  },
  {
    accessorKey: 'account_holder',
    header: '예금주',
    cell: ({ row }) => <div className="text-sm">{row.getValue('account_holder')}</div>,
  },
  {
    accessorKey: 'is_primary',
    header: '주계좌',
    cell: ({ row }) => {
      const isPrimary = row.getValue('is_primary') as boolean;
      return (
        <div className="text-sm">
          {isPrimary ? (
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">주계좌</span>
          ) : (
            <span className="text-muted-foreground">-</span>
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditBank(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteBank(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function PartnerBanksPage() {
  const store = usePartnerBanksStore();
  const filteredBanks = useMemo(() => dummyBanks.filter(() => true), []);
  const columns = createColumns((b) => store.openForm(b.id), () => {});

  return (
    <div className="space-y-6">
      <PartnerBanksHeader onRefresh={() => {}} onExport={() => {}} />
      <PartnerBanksStats banks={dummyBanks} />
      <PartnerBanksFilters banks={dummyBanks} />
      <PartnerBanksTable columns={columns} data={filteredBanks} />
      <PartnerBanksPaging totalItems={filteredBanks.length} itemsPerPage={10} />
      <PartnerBanksEdit banks={dummyBanks} onSubmit={() => {}} />
    </div>
  );
}
