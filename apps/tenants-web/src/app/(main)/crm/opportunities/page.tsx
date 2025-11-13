'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  OpportunitiesHeader,
  OpportunitiesStats,
  OpportunitiesFilters,
  OpportunitiesTable,
  OpportunitiesPaging,
  OpportunitiesEdit,
} from '@/features/crm/opportunities';
import { useOpportunityStore } from '@/features/crm/opportunities/stores';
import type { Opportunity } from '@/features/crm/opportunities/types';

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
const dummyOpportunities: Opportunity[] = [
  {
    id: '1',
    name: '신규 프로젝트 계약',
    description: '대규모 프로젝트',
    stage: 'PROPOSAL',
    expected_revenue: 50000000,
    probability: 75,
    expected_close_date: '2024-12-31',
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
  },
  {
    id: '2',
    name: '추가 물품 주문',
    description: '기존 계약 확대',
    stage: 'NEGOTIATION',
    expected_revenue: 15000000,
    probability: 60,
    expected_close_date: '2024-11-30',
    active: true,
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2024-10-15T00:00:00Z',
  },
  {
    id: '3',
    name: '연간 계약 갱신',
    description: '계약 성공',
    stage: 'WON',
    expected_revenue: 30000000,
    probability: 100,
    expected_close_date: '2024-10-01',
    active: false,
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-09-01T00:00:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditOpportunity: (opportunity: Opportunity) => void,
  onDeleteOpportunity: (opportunity: Opportunity) => void
): ColumnDef<Opportunity>[] => [
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
        기회명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: 'stage',
    header: '진행 단계',
    cell: ({ row }) => {
      const stage = row.getValue('stage') as string;
      const stageMap: Record<string, string> = {
        PROSPECT: '예상고객',
        QUALIFICATION: '적격심사',
        PROPOSAL: '제안',
        NEGOTIATION: '협상',
        WON: '성공',
        LOST: '실패',
      };
      const stageColors: Record<string, string> = {
        PROSPECT: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
        QUALIFICATION: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
        PROPOSAL: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
        NEGOTIATION: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
        WON: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
        LOST: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
      };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${stageColors[stage] || 'bg-gray-50'}`}>
          {stageMap[stage] || stage}
        </div>
      );
    },
  },
  {
    accessorKey: 'expected_revenue',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        예상 금액
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const value = row.getValue('expected_revenue') as number;
      return (
        <div className="text-sm font-medium">
          {(value / 1000000).toFixed(0)}백만원
        </div>
      );
    },
  },
  {
    accessorKey: 'probability',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        성공확률
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const prob = row.getValue('probability') as number;
      return (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                prob >= 75 ? 'bg-green-500' : prob >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
              }`}
              style={{ width: `${prob}%` }}
            />
          </div>
          <span className="text-sm font-medium">{prob}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'expected_close_date',
    header: '마감일',
    cell: ({ row }) => {
      const date = row.getValue('expected_close_date') as string;
      if (!date) return <div className="text-sm">-</div>;
      return <div className="text-sm">{new Date(date).toLocaleDateString('ko-KR')}</div>;
    },
  },
  {
    accessorKey: 'active',
    header: '상태',
    cell: ({ row }) => {
      const isActive = row.getValue('active');
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
    accessorKey: 'createdAt',
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
      const createdAt = row.getValue('createdAt') as string;
      return <div className="text-sm">{formatDateTime(createdAt)}</div>;
    },
  },
  {
    accessorKey: 'updatedAt',
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
      const updatedAt = row.getValue('updatedAt') as string;
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
          onClick={() => onEditOpportunity(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteOpportunity(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function OpportunitiesPage() {
  const {
    selectedStage,
    selectedStatus,
  } = useOpportunityStore();

  // 필터링된 데이터
  const filteredOpportunities = useMemo(() => {
    return dummyOpportunities.filter((opportunity) => {
      if (selectedStage && opportunity.stage !== selectedStage) return false;
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !opportunity.active : opportunity.active)
      )
        return false;
      return true;
    });
  }, [selectedStage, selectedStatus]);

  const handleEditOpportunity = (opportunity: Opportunity) => {
    const { openForm } = useOpportunityStore.getState();
    openForm(opportunity.id);
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    console.log('Delete opportunity:', opportunity);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useOpportunityStore.getState();
    if (editingId) {
      console.log('Update opportunity:', editingId, formData);
    } else {
      console.log('Create opportunity:', formData);
    }
  };

  const columns = createColumns(handleEditOpportunity, handleDeleteOpportunity);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <OpportunitiesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <OpportunitiesStats opportunities={dummyOpportunities} />

      {/* 필터 섹션 */}
      <OpportunitiesFilters opportunities={dummyOpportunities} />

      {/* 데이터 테이블 */}
      <OpportunitiesTable columns={columns} data={filteredOpportunities} />

      {/* 페이지네이션 */}
      <OpportunitiesPaging totalItems={filteredOpportunities.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <OpportunitiesEdit opportunities={dummyOpportunities} onSubmit={handleFormSubmit} />
    </div>
  );
}
