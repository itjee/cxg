'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  PartnerAddressesHeader,
  PartnerAddressesStats,
  PartnerAddressesFilters,
  PartnerAddressesTable,
  PartnerAddressesPaging,
  PartnerAddressesEdit,
} from '@/features/crm/partner-addresses';
import { usePartnerAddressesStore } from '@/features/crm/partner-addresses/stores';

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

interface PartnerAddress {
  id: string;
  partner_id: string;
  partner_name: string;
  address_type: 'BILLING' | 'SHIPPING' | 'HEADQUARTERS' | 'BRANCH' | 'OTHER';
  country: string;
  state?: string;
  city: string;
  street: string;
  postal_code: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

const dummyAddresses: PartnerAddress[] = [
  {
    id: '1',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    address_type: 'HEADQUARTERS',
    country: '대한민국',
    state: '서울',
    city: '강남구',
    street: '테헤란로 123',
    postal_code: '06234',
    is_primary: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    address_type: 'SHIPPING',
    country: '대한민국',
    state: '경기',
    city: '수원시',
    street: '팔달로 456',
    postal_code: '16201',
    is_primary: false,
    created_at: '2024-02-01T14:00:00Z',
    updated_at: '2024-02-01T14:00:00Z',
  },
  {
    id: '3',
    partner_id: 'partner-2',
    partner_name: 'XYZ Corp',
    address_type: 'BILLING',
    country: '대한민국',
    state: '서울',
    city: '서초구',
    street: '강남대로 789',
    postal_code: '06546',
    is_primary: true,
    created_at: '2024-06-15T09:30:00Z',
    updated_at: '2024-06-15T09:30:00Z',
  },
];

const createColumns = (
  onEditAddress: (address: PartnerAddress) => void,
  onDeleteAddress: (address: PartnerAddress) => void
): ColumnDef<PartnerAddress>[] => [
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
    accessorKey: 'address_type',
    header: '주소유형',
    cell: ({ row }) => {
      const type = row.getValue('address_type') as string;
      const typeMap: Record<string, string> = { BILLING: '청구처', SHIPPING: '배송지', HEADQUARTERS: '본사', BRANCH: '지점', OTHER: '기타' };
      return <div className="text-sm">{typeMap[type] || type}</div>;
    },
  },
  {
    accessorKey: 'street',
    header: '주소',
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{row.getValue('street')}</div>
        <div className="text-xs text-muted-foreground">{row.original.city} {row.original.postal_code}</div>
      </div>
    ),
  },
  {
    accessorKey: 'is_primary',
    header: '기본주소',
    cell: ({ row }) => {
      const isPrimary = row.getValue('is_primary') as boolean;
      return (
        <div className="text-sm">
          {isPrimary ? (
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">주소</span>
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditAddress(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteAddress(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function PartnerAddressesPage() {
  const store = usePartnerAddressesStore();
  const filteredAddresses = useMemo(() => dummyAddresses.filter(() => true), []);
  const columns = createColumns((a) => store.openForm(a.id), () => {});

  return (
    <div className="space-y-6">
      <PartnerAddressesHeader onRefresh={() => {}} onExport={() => {}} />
      <PartnerAddressesStats addresses={dummyAddresses} />
      <PartnerAddressesFilters addresses={dummyAddresses} />
      <PartnerAddressesTable columns={columns} data={filteredAddresses} />
      <PartnerAddressesPaging totalItems={filteredAddresses.length} itemsPerPage={10} />
      <PartnerAddressesEdit addresses={dummyAddresses} onSubmit={() => {}} />
    </div>
  );
}
