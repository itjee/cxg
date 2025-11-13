'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  CurrenciesHeader,
  CurrenciesStats,
  CurrenciesFilters,
  CurrenciesList,
  CurrenciesPaging,
  CurrenciesEdit,
} from '@/features/adm/currencies';
import { useCurrencyStore } from '@/features/adm/currencies/stores';
import type { Currency } from '@/features/adm/currencies/types';

// 날짜 포맷 함수
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

// 더미 데이터
const dummyCurrencies: Currency[] = [
  {
    id: '1',
    code: 'USD',
    name: '미국 달러',
    symbol: '$',
    decimal_places: 2,
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-10-28T10:30:00Z',
  },
  {
    id: '2',
    code: 'KRW',
    name: '한국 원',
    symbol: '₩',
    decimal_places: 0,
    is_active: true,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-10-27T15:20:00Z',
  },
  {
    id: '3',
    code: 'EUR',
    name: '유로',
    symbol: '€',
    decimal_places: 2,
    is_active: true,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-10-25T09:15:00Z',
  },
  {
    id: '4',
    code: 'JPY',
    name: '일본 엔',
    symbol: '¥',
    decimal_places: 0,
    is_active: true,
    created_at: '2025-02-10T00:00:00Z',
    updated_at: '2025-10-24T12:00:00Z',
  },
  {
    id: '5',
    code: 'GBP',
    name: '영국 파운드',
    symbol: '£',
    decimal_places: 2,
    is_active: false,
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-10-20T08:00:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditCurrency: (currency: Currency) => void,
  onDeleteCurrency: (currency: Currency) => void
): ColumnDef<Currency>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        코드
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('code')}</div>
        <div className="text-xs text-muted-foreground">{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'symbol',
    header: '기호',
    cell: ({ row }) => (
      <div className="text-lg font-medium">{row.getValue('symbol')}</div>
    ),
  },
  {
    accessorKey: 'decimal_places',
    header: '소수점',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('decimal_places')}자리</div>
    ),
  },
  {
    accessorKey: 'is_active',
    header: '상태',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active');
      return (
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">활성</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span className="text-sm">비활성</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        생성일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      return <div className="text-sm">{formatDateTime(createdAt)}</div>;
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        수정일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue('updated_at') as string;
      return <div className="text-sm">{formatDateTime(updatedAt)}</div>;
    },
  },
  {
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEditCurrency(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteCurrency(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function CurrenciesPage() {
  const {
    globalFilter,
    selectedDecimal,
    selectedStatus,
  } = useCurrencyStore();

  // 필터링된 데이터
  const filteredCurrencies = useMemo(() => {
    return dummyCurrencies.filter((currency) => {
      // globalFilter 적용
      if (globalFilter) {
        const searchLower = globalFilter.toLowerCase();
        const matchesSearch = 
          currency.code.toLowerCase().includes(searchLower) ||
          currency.name.toLowerCase().includes(searchLower) ||
          currency.symbol?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // selectedDecimal 필터
      if (selectedDecimal !== null && currency.decimal_places !== selectedDecimal) return false;
      
      // selectedStatus 필터
      if (selectedStatus) {
        if (selectedStatus === 'active' && !currency.is_active) return false;
        if (selectedStatus === 'inactive' && currency.is_active) return false;
      }
      
      return true;
    });
  }, [globalFilter, selectedDecimal, selectedStatus]);

  const handleEditCurrency = (currency: Currency) => {
    const { openForm } = useCurrencyStore.getState();
    openForm(currency.id);
  };

  const handleDeleteCurrency = (currency: Currency) => {
    console.log('Delete currency:', currency);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const columns = createColumns(handleEditCurrency, handleDeleteCurrency);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <CurrenciesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <CurrenciesStats currencies={dummyCurrencies} />

      {/* 필터 섹션 */}
      <CurrenciesFilters currencies={dummyCurrencies} />

      {/* 데이터 테이블 */}
      <CurrenciesList columns={columns} data={filteredCurrencies} />

      {/* 페이지네이션 */}
      <CurrenciesPaging totalItems={filteredCurrencies.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <CurrenciesEdit currencies={dummyCurrencies} />
    </div>
  );
}
