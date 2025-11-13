'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  LeadsHeader,
  LeadsStats,
  LeadsFilters,
  LeadsTable,
  LeadsPaging,
  LeadsEdit,
} from '@/features/crm/leads';
import { useLeadsStore } from '@/features/crm/leads/stores';

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

// 리드 타입 정의
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'CONVERTED';
  source: string;
  created_at: string;
  updated_at: string;
}

// 더미 데이터
const dummyLeads: Lead[] = [
  {
    id: '1',
    name: '김영수',
    email: 'kim@company.com',
    phone: '010-1234-5678',
    company: '(주)ABC',
    status: 'NEW',
    source: 'WEB',
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    name: '이순신',
    email: 'lee@company.com',
    phone: '010-2345-6789',
    company: '(주)XYZ',
    status: 'CONTACTED',
    source: 'EMAIL',
    created_at: '2024-10-28T14:30:00Z',
    updated_at: '2024-10-28T14:30:00Z',
  },
  {
    id: '3',
    name: '박지성',
    email: 'park@company.com',
    phone: '010-3456-7890',
    company: '(주)DEF',
    status: 'QUALIFIED',
    source: 'REFERRAL',
    created_at: '2024-10-25T09:15:00Z',
    updated_at: '2024-10-25T09:15:00Z',
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditLead: (lead: Lead) => void,
  onDeleteLead: (lead: Lead) => void
): ColumnDef<Lead>[] => [
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
        이름
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.email}</div>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: '이메일',
    cell: ({ row }) => <div className="text-sm">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'company',
    header: '회사',
    cell: ({ row }) => <div className="text-sm">{row.getValue('company') || '-'}</div>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        NEW: '신규',
        CONTACTED: '연락됨',
        QUALIFIED: '적격',
        LOST: '손실',
        CONVERTED: '전환됨',
      };
      const statusColors: Record<string, string> = {
        NEW: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
        CONTACTED: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
        QUALIFIED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
        LOST: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
        CONVERTED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
      };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'source',
    header: '출처',
    cell: ({ row }) => <div className="text-sm">{row.getValue('source')}</div>,
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
          onClick={() => onEditLead(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteLead(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function LeadsPage() {
  const leadsStore = useLeadsStore();

  // 필터링된 데이터
  const filteredLeads = useMemo(() => {
    return dummyLeads.filter((lead) => {
      return true;
    });
  }, []);

  const handleEditLead = (lead: Lead) => {
    leadsStore.openForm(lead.id);
  };

  const handleDeleteLead = (lead: Lead) => {
    console.log('Delete lead:', lead);
  };

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    if (leadsStore.editingId) {
      console.log('Update lead:', leadsStore.editingId, formData);
    } else {
      console.log('Create lead:', formData);
    }
  };

  const columns = createColumns(handleEditLead, handleDeleteLead);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <LeadsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <LeadsStats leads={dummyLeads} />

      {/* 필터 섹션 */}
      <LeadsFilters leads={dummyLeads} />

      {/* 데이터 테이블 */}
      <LeadsTable columns={columns} data={filteredLeads} />

      {/* 페이지네이션 */}
      <LeadsPaging totalItems={filteredLeads.length} itemsPerPage={10} />

      {/* 입력 폼 모달 */}
      <LeadsEdit leads={dummyLeads} onSubmit={handleFormSubmit} />
    </div>
  );
}
