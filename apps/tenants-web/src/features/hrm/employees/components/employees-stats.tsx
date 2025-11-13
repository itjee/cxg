'use client';

import { useMemo } from 'react';
import { Users, UserCheck, UserX, Briefcase } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { StatCardData } from '@/components/stats/stats-cards';

interface EmployeesStatsProps {
  employees: any[];
  departmentCount: number;
}

export function EmployeesStats({ employees, departmentCount }: EmployeesStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'active').length;
    const onLeave = employees.filter((e) => e.status === 'leave').length;

    return [
      {
        title: '전체 사원',
        value: total,
        description: '총 등록된 사원',
        icon: <Users className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '재직 중',
        value: active,
        description: '현재 근무 중인 사원',
        icon: <UserCheck className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '휴직 중',
        value: onLeave,
        description: '휴직 중인 사원',
        icon: <UserX className="h-5 w-5" />,
        color: 'warning' as const,
      },
      {
        title: '부서 수',
        value: departmentCount,
        description: '등록된 부서 수',
        icon: <Briefcase className="h-5 w-5" />,
        color: 'default' as const,
      },
    ];
  }, [employees, departmentCount]);

  return <StatsCards cards={stats} columns={4} />;
}
