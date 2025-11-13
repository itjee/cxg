'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  RolesHeader,
  RolesStats,
  RolesFilters,
  RolesList,
  RolesPaging,
  RolesEdit,
} from '@/features/sys/roles';
import { useRoleStore } from '@/features/sys/roles/stores';
import type { Role } from '@/features/sys/roles/types';

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
const dummyRoles: Role[] = [
  {
    id: '1',
    name: '관리자',
    description: '시스템 전체 관리 권한을 가진 역할',
    active: true,
    permissionIds: ['read', 'write', 'delete', 'admin'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '매니저',
    description: '부서 및 팀 관리 권한',
    active: true,
    permissionIds: ['read', 'write', 'manage_users'],
    createdAt: '2025-02-15T00:00:00Z',
    updatedAt: '2025-10-28T09:30:00Z',
  },
  {
    id: '3',
    name: '사용자',
    description: '일반 사용자 기본 권한',
    active: true,
    permissionIds: ['read', 'write'],
    createdAt: '2025-03-20T00:00:00Z',
    updatedAt: '2025-10-25T14:15:00Z',
  },
  {
    id: '4',
    name: '뷰어',
    description: '읽기 전용 권한',
    active: false,
    permissionIds: ['read'],
    createdAt: '2025-04-10T00:00:00Z',
    updatedAt: '2025-04-10T00:00:00Z',
  },
  {
    id: '5',
    name: '운영자',
    description: '운영 및 모니터링 권한',
    active: true,
    permissionIds: ['read', 'write', 'monitor'],
    createdAt: '2025-05-05T00:00:00Z',
    updatedAt: '2025-10-28T11:00:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditRole: (role: Role) => void,
  onDeleteRole: (role: Role) => void
): ColumnDef<Role>[] => [
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
        역할명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'description',
    header: '설명',
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.getValue('description')}</div>
    ),
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
    accessorKey: 'permissionIds',
    header: '권한',
    cell: ({ row }) => {
      const permissions = row.getValue('permissionIds') as string[];
      return (
        <div className="text-sm">
          {permissions?.length > 0 ? `${permissions.length}개 권한` : '권한 없음'}
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
          onClick={() => onEditRole(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteRole(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function RolesPage() {
  const {
    selectedStatus,
  } = useRoleStore();

  // 필터링된 데이터
  const filteredRoles = useMemo(() => {
    return dummyRoles.filter((role) => {
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !role.active : role.active)
      )
        return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditRole = (role: Role) => {
    const { openForm } = useRoleStore.getState();
    openForm(role.id);
  };

  const handleDeleteRole = (role: Role) => {
    console.log('Delete role:', role);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useRoleStore.getState();
    if (editingId) {
      console.log('Update role:', editingId, formData);
    } else {
      console.log('Create role:', formData);
    }
  };

  const columns = createColumns(handleEditRole, handleDeleteRole);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <RolesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <RolesStats roles={dummyRoles} />

      {/* 필터 섹션 */}
      <RolesFilters roles={dummyRoles} />

      {/* 데이터 테이블 */}
      <RolesList columns={columns} data={filteredRoles} />

      {/* 페이지네이션 */}
      <RolesPaging totalItems={filteredRoles.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <RolesEdit roles={dummyRoles} onSubmit={handleFormSubmit} />
    </div>
  );
}
