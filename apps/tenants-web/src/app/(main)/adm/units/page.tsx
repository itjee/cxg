'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  UnitsHeader,
  UnitsStats,
  UnitsFilters,
  UnitsList,
  UnitsPaging,
  UnitsEdit,
} from '@/features/adm/units';
import { useUnitStore } from '@/features/adm/units/stores';
import type { Unit } from '@/features/adm/units/types';

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
const dummyUnits: Unit[] = [
  {
    id: '1',
    code: 'EA',
    name: '개',
    description: '낱개 단위',
    is_active: true,
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-10-28T14:30:00Z',
  },
  {
    id: '2',
    code: 'BOX',
    name: '박스',
    description: '박스 단위',
    is_active: true,
    created_at: '2025-01-05T09:15:00Z',
    updated_at: '2025-10-27T11:45:00Z',
  },
  {
    id: '3',
    code: 'KG',
    name: '킬로그램',
    description: '무게 단위',
    is_active: true,
    created_at: '2025-01-10T10:30:00Z',
    updated_at: '2025-10-26T16:20:00Z',
  },
  {
    id: '4',
    code: 'M',
    name: '미터',
    description: '길이 단위',
    is_active: true,
    created_at: '2025-01-15T11:00:00Z',
    updated_at: '2025-10-25T13:10:00Z',
  },
  {
    id: '5',
    code: 'SET',
    name: '세트',
    description: '세트 단위',
    is_active: false,
    created_at: '2025-01-20T12:45:00Z',
    updated_at: '2025-10-24T09:55:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditUnit: (unit: Unit) => void,
  onDeleteUnit: (unit: Unit) => void
): ColumnDef<Unit>[] => [
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
        단위 코드
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-mono text-sm font-medium">
          {row.getValue('code')}
        </div>
        <div className="text-xs text-muted-foreground">{row.original.name}</div>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: '설명',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('description')}</div>
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
          onClick={() => onEditUnit(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteUnit(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function UnitsPage() {
  const {
    selectedStatus,
  } = useUnitStore();

  // 필터링된 데이터
  const filteredUnits = useMemo(() => {
    return dummyUnits.filter((unit) => {
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !unit.is_active : unit.is_active)
      )
        return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditUnit = (unit: Unit) => {
    const { openForm } = useUnitStore.getState();
    openForm(unit.id);
  };

  const handleDeleteUnit = (unit: Unit) => {
    console.log('Delete unit:', unit);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useUnitStore.getState();
    if (editingId) {
      console.log('Update unit:', editingId, formData);
    } else {
      console.log('Create unit:', formData);
    }
  };

  const columns = createColumns(handleEditUnit, handleDeleteUnit);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <UnitsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <UnitsStats units={dummyUnits} />

      {/* 필터 섹션 */}
      <UnitsFilters units={dummyUnits} />

      {/* 데이터 테이블 */}
      <UnitsList columns={columns} data={filteredUnits} />

      {/* 페이지네이션 */}
      <UnitsPaging totalItems={filteredUnits.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <UnitsEdit units={dummyUnits} onSubmit={handleFormSubmit} />
    </div>
  );
}
