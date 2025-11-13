'use client';

import { useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  EmailTemplatesHeader,
  EmailTemplatesStats,
  EmailTemplatesFilters,
  EmailTemplatesTable,
  EmailTemplatesPaging,
  EmailTemplatesEdit,
} from '@/features/crm/email-templates';
import { useEmailTemplatesStore } from '@/features/crm/email-templates/stores';

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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'MARKETING' | 'NOTIFICATION' | 'TRANSACTIONAL' | 'NEWSLETTER' | 'OTHER';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  usage_count: number;
  created_at: string;
  updated_at: string;
}

const dummyTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: '신규 가입 환영 이메일',
    subject: '{{name}}님 환영합니다!',
    category: 'TRANSACTIONAL',
    status: 'ACTIVE',
    usage_count: 1523,
    created_at: '2024-05-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    name: '주간 뉴스레터',
    subject: '이번 주의 놓친 소식들',
    category: 'NEWSLETTER',
    status: 'ACTIVE',
    usage_count: 456,
    created_at: '2024-07-15T14:00:00Z',
    updated_at: '2024-10-28T14:00:00Z',
  },
  {
    id: '3',
    name: '비밀번호 재설정',
    subject: '비밀번호 재설정 요청',
    category: 'TRANSACTIONAL',
    status: 'ACTIVE',
    usage_count: 892,
    created_at: '2024-06-01T09:30:00Z',
    updated_at: '2024-11-01T09:30:00Z',
  },
];

const createColumns = (
  onEditTemplate: (template: EmailTemplate) => void,
  onDeleteTemplate: (template: EmailTemplate) => void
): ColumnDef<EmailTemplate>[] => [
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
        템플릿명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue('name')}</div>
        <div className="text-xs text-muted-foreground">{row.original.subject}</div>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: '분류',
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      const categoryMap: Record<string, string> = { MARKETING: '마케팅', NOTIFICATION: '알림', TRANSACTIONAL: '거래', NEWSLETTER: '뉴스레터', OTHER: '기타' };
      return <div className="text-sm">{categoryMap[category] || category}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = { ACTIVE: '활성', INACTIVE: '비활성', DRAFT: '초안' };
      const statusColors: Record<string, string> = { ACTIVE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', INACTIVE: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400', DRAFT: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400' };
      return (
        <div className={`text-sm px-2.5 py-1 rounded-md inline-block ${statusColors[status] || 'bg-gray-50'}`}>
          {statusMap[status] || status}
        </div>
      );
    },
  },
  {
    accessorKey: 'usage_count',
    header: '사용횟수',
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('usage_count')} 회</div>,
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
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEditTemplate(row.original)} title="편집">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDeleteTemplate(row.original)} title="삭제">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function EmailTemplatesPage() {
  const store = useEmailTemplatesStore();
  const filteredTemplates = useMemo(() => dummyTemplates.filter(() => true), []);
  const columns = createColumns((t) => store.openForm(t.id), () => {});

  return (
    <div className="space-y-6">
      <EmailTemplatesHeader onRefresh={() => {}} onExport={() => {}} />
      <EmailTemplatesStats templates={dummyTemplates} />
      <EmailTemplatesFilters templates={dummyTemplates} />
      <EmailTemplatesTable columns={columns} data={filteredTemplates} />
      <EmailTemplatesPaging totalItems={filteredTemplates.length} itemsPerPage={10} />
      <EmailTemplatesEdit templates={dummyTemplates} onSubmit={() => {}} />
    </div>
  );
}
