'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DepartmentsHeader,
  DepartmentsStats,
  DepartmentsFilters,
  DepartmentsList,
  DepartmentsPaging,
  DepartmentsEdit,
} from '@/features/hrm/departments';
import { useDepartmentsStore } from '@/features/hrm/departments/stores';
import type { Department } from '@/features/hrm/departments/types';

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
const dummyDepartments: Department[] = [
  {
    id: '1',
    code: 'DEPT001',
    name: '개발팀',
    parent_id: null,
    manager_name: '홍길동',
    description: '소프트웨어 개발 및 유지보수',
    is_active: true,
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-10-28T14:30:00Z',
  },
  {
    id: '2',
    code: 'DEPT002',
    name: '영업팀',
    parent_id: null,
    manager_name: '김영희',
    description: '제품 판매 및 고객 관리',
    is_active: true,
    created_at: '2025-01-05T09:15:00Z',
    updated_at: '2025-10-27T11:45:00Z',
  },
  {
    id: '3',
    code: 'DEPT003',
    name: '마케팅팀',
    parent_id: null,
    manager_name: '이순신',
    description: '마케팅 및 브랜드 관리',
    is_active: true,
    created_at: '2025-01-10T10:30:00Z',
    updated_at: '2025-10-26T16:20:00Z',
  },
  {
    id: '4',
    code: 'DEPT004',
    name: '인사팀',
    parent_id: null,
    manager_name: '박지성',
    description: '인사 및 총무 관리',
    is_active: true,
    created_at: '2025-01-15T11:00:00Z',
    updated_at: '2025-10-25T13:10:00Z',
  },
  {
    id: '5',
    code: 'DEPT005',
    name: '전략팀',
    parent_id: null,
    manager_name: '최팀장',
    description: '전략 수립 및 기획',
    is_active: false,
    created_at: '2025-01-20T12:45:00Z',
    updated_at: '2025-10-24T09:55:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditDepartment: (department: Department) => void,
  onDeleteDepartment: (department: Department) => void
): ColumnDef<Department>[] => [
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
        부서 코드
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
    accessorKey: 'manager_name',
    header: '부서장',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('manager_name')}</div>
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
          onClick={() => onEditDepartment(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteDepartment(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function DepartmentsPage() {
  const {
    selectedStatus,
  } = useDepartmentsStore();

  // 필터링된 데이터
  const filteredDepartments = useMemo(() => {
    return dummyDepartments.filter((department) => {
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !department.is_active : department.is_active)
      )
        return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditDepartment = (department: Department) => {
    const { openForm } = useDepartmentsStore.getState();
    openForm(department.id);
  };

  const handleDeleteDepartment = (department: Department) => {
    console.log('Delete department:', department);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useDepartmentsStore.getState();
    if (editingId) {
      console.log('Update department:', editingId, formData);
    } else {
      console.log('Create department:', formData);
    }
  };

  const columns = createColumns(handleEditDepartment, handleDeleteDepartment);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <DepartmentsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <DepartmentsStats departments={dummyDepartments} />

      {/* 필터 섹션 */}
      <DepartmentsFilters departments={dummyDepartments} />

      {/* 데이터 테이블 */}
      <DepartmentsList columns={columns} data={filteredDepartments} />

      {/* 페이지네이션 */}
      <DepartmentsPaging totalItems={filteredDepartments.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <DepartmentsEdit departments={dummyDepartments} onSubmit={handleFormSubmit} />
    </div>
  );
}
