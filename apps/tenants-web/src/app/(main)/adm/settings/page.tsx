'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  SettingsHeader,
  SettingsStats,
  SettingsFilters,
  SettingsList,
  SettingsPaging,
  SettingsEdit,
} from '@/features/adm/settings';
import { useSettingStore as useSettingsStore } from '@/features/adm/settings/stores';
import type { Setting } from '@/features/adm/settings/types';

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
const dummySettings: Setting[] = [
  {
    id: '1',
    key: 'APP_NAME',
    value: 'My Application',
    value_type: 'STRING',
    description: '애플리케이션 이름',
    category: 'General',
    is_active: true,
    is_encrypted: false,
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-10-28T14:30:00Z',
  },
  {
    id: '2',
    key: 'MAX_UPLOAD_SIZE',
    value: '104857600',
    value_type: 'NUMBER',
    description: '최대 업로드 크기 (바이트)',
    category: 'Upload',
    is_active: true,
    is_encrypted: false,
    created_at: '2025-01-05T09:15:00Z',
    updated_at: '2025-10-27T11:45:00Z',
  },
  {
    id: '3',
    key: 'ENABLE_EMAIL_NOTIFICATION',
    value: 'true',
    value_type: 'BOOLEAN',
    description: '이메일 알림 활성화',
    category: 'Notification',
    is_active: true,
    is_encrypted: false,
    created_at: '2025-01-10T10:30:00Z',
    updated_at: '2025-10-26T16:20:00Z',
  },
  {
    id: '4',
    key: 'DATABASE_CONFIG',
    value: '{"host":"localhost","port":5432}',
    value_type: 'JSON',
    description: '데이터베이스 설정',
    category: 'Database',
    is_active: true,
    is_encrypted: false,
    created_at: '2025-01-15T11:00:00Z',
    updated_at: '2025-10-25T13:10:00Z',
  },
  {
    id: '5',
    key: 'API_SECRET_KEY',
    value: 'secret_key_value',
    value_type: 'STRING',
    description: 'API 시크릿 키',
    category: 'Security',
    is_active: false,
    is_encrypted: true,
    created_at: '2025-01-20T12:45:00Z',
    updated_at: '2025-10-24T09:55:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditSetting: (setting: Setting) => void,
  onDeleteSetting: (setting: Setting) => void
): ColumnDef<Setting>[] => [
  {
    id: 'rowNumber',
    header: 'NO',
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: 'key',
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        설정 키
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {row.getValue('key')}
      </div>
    ),
  },
  {
    accessorKey: 'value',
    header: '값',
    cell: ({ row }) => {
      const setting = row.original;
      return (
        <div className="text-sm">
          {setting.is_encrypted ? (
            <span className="text-muted-foreground italic">***</span>
          ) : (
            row.getValue('value')
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'value_type',
    header: '타입',
    cell: ({ row }) => (
      <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
        {row.getValue('value_type')}
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: '카테고리',
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue('category') || '-'}</div>
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
          onClick={() => onEditSetting(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteSetting(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function SettingsPage() {
  const {
    selectedCategory,
    selectedStatus,
  } = useSettingsStore();

  // 필터링된 데이터
  const filteredSettings = useMemo(() => {
    return dummySettings.filter((setting) => {
      if (selectedCategory && setting.category !== selectedCategory) return false;
      if (
        selectedStatus &&
        (selectedStatus === 'active' ? !setting.is_active : setting.is_active)
      )
        return false;
      return true;
    });
  }, [selectedCategory, selectedStatus]);

  const handleEditSetting = (setting: Setting) => {
    const { openForm } = useSettingsStore.getState();
    openForm(setting.id);
  };

  const handleDeleteSetting = (setting: Setting) => {
    console.log('Delete setting:', setting);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useSettingsStore.getState();
    if (editingId) {
      console.log('Update setting:', editingId, formData);
    } else {
      console.log('Create setting:', formData);
    }
  };

  const columns = createColumns(handleEditSetting, handleDeleteSetting);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <SettingsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <SettingsStats settings={dummySettings} />

      {/* 필터 섹션 */}
      <SettingsFilters settings={dummySettings} />

      {/* 데이터 테이블 */}
      <SettingsList columns={columns} data={filteredSettings} />

      {/* 페이지네이션 */}
      <SettingsPaging totalItems={filteredSettings.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <SettingsEdit settings={dummySettings} onSubmit={handleFormSubmit} />
    </div>
  );
}
