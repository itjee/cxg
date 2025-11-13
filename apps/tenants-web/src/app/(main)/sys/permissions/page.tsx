'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  PermissionsHeader,
  PermissionsStats,
  PermissionsFilters,
  PermissionsList,
  PermissionsPaging,
  PermissionsEdit,
} from '@/features/sys/permissions';
import { usePermissionStore } from '@/features/sys/permissions/stores';
import type { Permission } from '@/features/sys/permissions/types';

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
const dummyPermissions: Permission[] = [
  {
    id: '1',
    code: 'USER_READ',
    name: '사용자 조회',
    description: '사용자 정보 조회 권한',
    module: 'users',
    resource: 'user',
    action: 'read',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    code: 'USER_CREATE',
    name: '사용자 생성',
    description: '새로운 사용자 생성 권한',
    module: 'users',
    resource: 'user',
    action: 'create',
    active: true,
    createdAt: '2025-02-15T00:00:00Z',
    updatedAt: '2025-10-28T09:30:00Z',
  },
  {
    id: '3',
    code: 'USER_UPDATE',
    name: '사용자 수정',
    description: '사용자 정보 수정 권한',
    module: 'users',
    resource: 'user',
    action: 'update',
    active: true,
    createdAt: '2025-03-20T00:00:00Z',
    updatedAt: '2025-10-25T14:15:00Z',
  },
  {
    id: '4',
    code: 'USER_DELETE',
    name: '사용자 삭제',
    description: '사용자 삭제 권한',
    module: 'users',
    resource: 'user',
    action: 'delete',
    active: false,
    createdAt: '2025-04-10T00:00:00Z',
    updatedAt: '2025-04-10T00:00:00Z',
  },
  {
    id: '5',
    code: 'ROLE_READ',
    name: '역할 조회',
    description: '역할 정보 조회 권한',
    module: 'roles',
    resource: 'role',
    action: 'read',
    active: true,
    createdAt: '2025-05-05T00:00:00Z',
    updatedAt: '2025-10-28T11:00:00Z',
  },
  {
    id: '6',
    code: 'ROLE_MANAGE',
    name: '역할 관리',
    description: '역할 생성, 수정, 삭제 권한',
    module: 'roles',
    resource: 'role',
    action: 'manage',
    active: true,
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-10-26T10:00:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditPermission: (permission: Permission) => void,
  onDeletePermission: (permission: Permission) => void
): ColumnDef<Permission>[] => [
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
        권한 코드
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-mono font-medium">{row.getValue('code')}</div>
        <div className="text-xs text-muted-foreground">{row.original.name}</div>
      </div>
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
    accessorKey: 'module',
    header: '모듈',
    cell: ({ row }) => (
      <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
        {row.getValue('module')}
      </div>
    ),
  },
  {
    accessorKey: 'action',
    header: '액션',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('action')}</div>
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
          onClick={() => onEditPermission(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeletePermission(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function PermissionsPage() {
  const {
    selectedModule,
    selectedStatus,
  } = usePermissionStore();

  // 필터링된 데이터
  const filteredPermissions = useMemo(() => {
    return dummyPermissions.filter((permission) => {
      if (selectedModule && permission.module !== selectedModule) return false;
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !permission.active : permission.active)
      )
        return false;
      return true;
    });
  }, [selectedModule, selectedStatus]);

  const handleEditPermission = (permission: Permission) => {
    const { openForm } = usePermissionStore.getState();
    openForm(permission.id);
  };

  const handleDeletePermission = (permission: Permission) => {
    console.log('Delete permission:', permission);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = usePermissionStore.getState();
    if (editingId) {
      console.log('Update permission:', editingId, formData);
    } else {
      console.log('Create permission:', formData);
    }
  };

  const columns = createColumns(handleEditPermission, handleDeletePermission);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <PermissionsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <PermissionsStats permissions={dummyPermissions} />

      {/* 필터 섹션 */}
      <PermissionsFilters permissions={dummyPermissions} />

      {/* 데이터 테이블 */}
      <PermissionsList columns={columns} data={filteredPermissions} />

      {/* 페이지네이션 */}
      <PermissionsPaging totalItems={filteredPermissions.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <PermissionsEdit permissions={dummyPermissions} onSubmit={handleFormSubmit} />
    </div>
  );
}
