'use client';

import { useState, useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageContainer } from '@/components/layouts/list-page-container';
import { FilterSection, FilterConfig } from '@/components/layouts/filter-section';
import { DataTableWithPagination } from '@/components/data-table/data-table-with-pagination';
import { StatsCards } from '@/components/stats/stats-cards';
import type { StatCardData } from '@/components/stats/stats-cards';
import { ColumnDef } from '@tanstack/react-table';
import { downloadCSV } from '@/lib/export-utils';

interface Appointment {
  id: string;
  employee_id: string;
  employee_name?: string;
  appointment_type: string;
  appointment_date: string;
  effective_date: string;
  old_position?: string;
  new_position?: string;
  old_department?: string;
  new_department?: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  created_at: string;
}

// 발령 유형 맵
const appointmentTypeMap: Record<string, string> = {
  PROMOTION: '승진',
  TRANSFER: '전보',
  POSITION_CHANGE: '직책변경',
  DEPARTMENT_CHANGE: '부서이동',
  LOCATION_CHANGE: '근무지변경',
  HIRE: '입사',
  RETIRE: '퇴직',
};

// 더미 데이터
const mockAppointments: Appointment[] = [
  {
    id: '1',
    employee_id: 'EMP001',
    employee_name: '홍길동',
    appointment_type: 'PROMOTION',
    appointment_date: '2025-11-01',
    effective_date: '2025-11-01',
    old_position: '주임',
    new_position: '대리',
    reason: '능력 평가 우수',
    status: 'APPROVED',
    created_at: '2025-10-28T09:00:00Z',
  },
  {
    id: '2',
    employee_id: 'EMP002',
    employee_name: '김영희',
    appointment_type: 'TRANSFER',
    appointment_date: '2025-10-25',
    effective_date: '2025-10-25',
    old_department: '개발팀',
    new_department: '영업팀',
    reason: '부서 재배치',
    status: 'APPROVED',
    created_at: '2025-10-25T10:30:00Z',
  },
  {
    id: '3',
    employee_id: 'EMP003',
    employee_name: '이순신',
    appointment_type: 'POSITION_CHANGE',
    appointment_date: '2025-10-20',
    effective_date: '2025-10-20',
    old_position: '대리',
    new_position: '과장',
    reason: '팀장 임명',
    status: 'PENDING',
    created_at: '2025-10-20T14:15:00Z',
  },
  {
    id: '4',
    employee_id: 'EMP004',
    employee_name: '박지성',
    appointment_type: 'DEPARTMENT_CHANGE',
    appointment_date: '2025-10-15',
    effective_date: '2025-10-15',
    old_department: '관리팀',
    new_department: '인사팀',
    reason: '조직 개편',
    status: 'APPROVED',
    created_at: '2025-10-15T11:00:00Z',
  },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // 테이블 컬럼 정의
  const columns: ColumnDef<Appointment>[] = [
    {
      id: 'rowNumber',
      header: 'NO',
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: 'appointment_date',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          발령일
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('appointment_date')}</div>
      ),
    },
    {
      accessorKey: 'employee_name',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          사원명
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('employee_name')}</div>
          <div className="text-xs text-muted-foreground">{row.original.employee_id}</div>
        </div>
      ),
    },
    {
      accessorKey: 'appointment_type',
      header: '발령 유형',
      cell: ({ row }) => {
        const type = row.getValue('appointment_type') as string;
        return (
          <div className="inline-block px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
            {appointmentTypeMap[type] || type}
          </div>
        );
      },
    },
    {
      accessorKey: 'effective_date',
      header: '시행일',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('effective_date')}</div>
      ),
    },
    {
      id: 'changes',
      header: '변경 사항',
      cell: ({ row }) => {
        const appointment = row.original;
        const changes = [];

        if (appointment.old_department && appointment.new_department) {
          changes.push(`${appointment.old_department} → ${appointment.new_department}`);
        }
        if (appointment.old_position && appointment.new_position) {
          changes.push(`${appointment.old_position} → ${appointment.new_position}`);
        }

        return (
          <div className="text-sm text-muted-foreground">
            {changes.length > 0 ? changes.join(', ') : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <div className="flex items-center gap-2">
            {status === 'APPROVED' ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">승인</span>
              </>
            ) : status === 'PENDING' ? (
              <>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm">대기</span>
              </>
            ) : status === 'REJECTED' ? (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm">반려</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                <span className="text-sm">취소</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '작업',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8" title="편집">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              setAppointments(appointments.filter((a) => a.id !== row.original.id));
            }}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // 필터 설정
  const filters: FilterConfig[] = [
    {
      key: 'employee',
      label: '사원명',
      type: 'search',
      placeholder: '사원명, 사번으로 검색...',
    },
    {
      key: 'appointmentType',
      label: '발령 유형',
      type: 'select',
      options: Object.entries(appointmentTypeMap).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    },
    {
      key: 'status',
      label: '상태',
      type: 'select',
      options: [
        { label: '대기', value: 'PENDING' },
        { label: '승인', value: 'APPROVED' },
        { label: '반려', value: 'REJECTED' },
        { label: '취소', value: 'CANCELLED' },
      ],
    },
  ];

  // 필터링된 데이터
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (selectedType && appointment.appointment_type !== selectedType) return false;
      if (selectedStatus && appointment.status !== selectedStatus) return false;

      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          appointment.employee_name?.toLowerCase().includes(query) ||
          appointment.employee_id?.toLowerCase().includes(query) ||
          appointmentTypeMap[appointment.appointment_type]?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [appointments, selectedType, selectedStatus, globalFilter]);

  // 통계 카드
  const stats: StatCardData[] = useMemo(() => {
    const total = appointments.length;
    const approved = appointments.filter((a) => a.status === 'APPROVED').length;
    const pending = appointments.filter((a) => a.status === 'PENDING').length;
    const rejected = appointments.filter((a) => a.status === 'REJECTED').length;

    return [
      {
        title: '전체 발령',
        value: total,
        description: '총 발령 건수',
        icon: <FileText className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '승인된 발령',
        value: approved,
        description: '승인된 발령',
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '대기 중인 발령',
        value: pending,
        description: '승인 대기 중',
        icon: <Clock className="h-5 w-5" />,
        color: 'warning' as const,
      },
      {
        title: '반려된 발령',
        value: rejected,
        description: '반려된 발령',
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'default' as const,
      },
    ];
  }, [appointments]);

  // 내보내기 핸들러
  const handleExport = () => {
    const exportData = filteredAppointments.map((appointment) => {
      const changes = [];
      if (appointment.old_department && appointment.new_department) {
        changes.push(`${appointment.old_department} → ${appointment.new_department}`);
      }
      if (appointment.old_position && appointment.new_position) {
        changes.push(`${appointment.old_position} → ${appointment.new_position}`);
      }

      return {
        발령일: appointment.appointment_date,
        사원명: appointment.employee_name || '',
        사번: appointment.employee_id || '',
        발령유형: appointmentTypeMap[appointment.appointment_type] || appointment.appointment_type,
        시행일: appointment.effective_date,
        변경사항: changes.length > 0 ? changes.join(', ') : '',
        발령사유: appointment.reason || '',
        상태:
          appointment.status === 'APPROVED'
            ? '승인'
            : appointment.status === 'PENDING'
            ? '대기'
            : appointment.status === 'REJECTED'
            ? '반려'
            : '취소',
      };
    });
    downloadCSV(
      exportData,
      `appointments_${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  const filterValues = {
    employee: globalFilter,
    appointmentType: selectedType,
    status: selectedStatus,
  };

  return (
    <ListPageContainer
      title="인사발령"
      description="사원의 인사 발령 정보를 관리합니다"
      onRefresh={() => setAppointments([...mockAppointments])}
      onAdd={() => {
        console.log('Add appointment');
      }}
      onExport={handleExport}
      showExport={true}
    >
      {/* 통계 섹션 */}
      <StatsCards cards={stats} columns={4} />

      {/* 필터 섹션 */}
      <FilterSection
        filters={filters}
        values={filterValues}
        onFilterChange={(key, value) => {
          if (key === 'employee') {
            setGlobalFilter(typeof value === 'string' ? value : '');
          } else if (key === 'appointmentType') {
            setSelectedType(typeof value === 'string' ? value : '');
          } else if (key === 'status') {
            setSelectedStatus(typeof value === 'string' ? value : '');
          }
        }}
      />

      {/* 데이터 테이블 */}
      <DataTableWithPagination
        columns={columns}
        data={filteredAppointments}
        pageSize={10}
        emptyMessage="데이터가 없습니다."
      />
    </ListPageContainer>
  );
}
