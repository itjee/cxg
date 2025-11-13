'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  ContractsHeader,
  ContractsStats,
  ContractsFilters,
  ContractsTable,
  ContractsPaging,
  ContractsEdit,
} from '@/features/crm/contracts';
import { useContractsStore } from '@/features/crm/contracts/stores';

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

// 계약 타입 정의
interface Contract {
  id: string;
  contract_no: string;
  partner_id: string;
  partner_name: string;
  title: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyContracts: Contract[] = [
  {
    id: '1',
    contract_no: 'CT-2024-001',
    partner_id: 'partner-1',
    partner_name: '(주)ABC',
    title: '용역 계약',
    amount: 50000000,
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'ACTIVE',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    contract_no: 'CT-2024-002',
    partner_id: 'partner-2',
    partner_name: 'XYZ Corp',
    title: '공급 계약',
    amount: 30000000,
    start_date: '2024-06-01',
    end_date: '2025-05-31',
    status: 'ACTIVE',
    created_at: '2024-06-01T14:00:00Z',
    updated_at: '2024-06-01T14:00:00Z',
  },
  {
    id: '3',
    contract_no: 'CT-2023-005',
    partner_id: 'partner-3',
    partner_name: 'DEF 솔루션',
    title: '유지보수 계약',
    amount: 10000000,
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    status: 'EXPIRED',
    created_at: '2023-01-01T09:00:00Z',
    updated_at: '2023-12-31T17:00:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditContract: (contract: Contract) => void,
  onDeleteContract: (contract: Contract) => void
): ColumnDef<Contract>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'contract_no',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        계약번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('contract_no')}</div>
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
    accessorKey: 'amount',
    header: '계약금액',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      return <div className="text-sm font-medium">{(amount / 1000000).toFixed(0)}백만원</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        DRAFT: '초안',
        ACTIVE: '진행중',
        EXPIRED: '만료됨',
        TERMINATED: '종료됨',
      };
      const statusColors: Record<string, string> = {
        DRAFT: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400',
        ACTIVE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
        EXPIRED: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
        TERMINATED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
      };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'start_date',
    header: '계약기간',
    cell: ({ row }) => {
      const startDate = new Date(row.getValue('start_date') as string).toLocaleDateString('ko-KR');
      const endDate = new Date(row.original.end_date).toLocaleDateString('ko-KR');
      return <div className="text-sm">{startDate} ~ {endDate}</div>;
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
    id: 'actions',
    header: '작업',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEditContract(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteContract(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function ContractsPage() {
  const contractStore = useContractsStore();

  // 필터링된 데이터
  const filteredContracts = useMemo(() => {
    return dummyContracts.filter(() => true);
  }, []);

  const handleEditContract = (contract: Contract) => {
    contractStore.openForm(contract.id);
  };

  const handleDeleteContract = (contract: Contract) => {
    console.log('Delete contract:', contract);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    if (contractStore.editingId) {
      console.log('Update contract:', contractStore.editingId, formData);
    } else {
      console.log('Create contract:', formData);
    }
  };

  const columns = createColumns(handleEditContract, handleDeleteContract);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <ContractsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <ContractsStats contracts={dummyContracts} />

      {/* 필터 섹션 */}
      <ContractsFilters contracts={dummyContracts} />

      {/* 데이터 테이블 */}
      <ContractsTable columns={columns} data={filteredContracts} />

      {/* 페이지네이션 */}
      <ContractsPaging totalItems={filteredContracts.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <ContractsEdit contracts={dummyContracts} onSubmit={handleFormSubmit} />
    </div>
  );
}
