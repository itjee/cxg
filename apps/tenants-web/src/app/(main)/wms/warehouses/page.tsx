'use client';

import { useState, useMemo } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableAdvanced } from '@/components/data-table';
import { WarehouseForm } from '@/features/wms/warehouses/components/warehouse-form';
import { ListPageLayout } from '@/components/layouts/list-page-layout';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

interface Warehouse {
  id: string;
  code: string;
  name: string;
  location?: string;
  manager?: string;
  managerEmail?: string;
  capacity?: number;
  currentUsage?: number;
  status: 'active' | 'inactive';
}

// 임시 모의 데이터
const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    code: 'WH001',
    name: '본사 창고',
    location: '서울 강남구',
    manager: '홍길동',
    managerEmail: 'hong@conexgrow.com',
    capacity: 10000,
    currentUsage: 6500,
    status: 'active' as const,
  },
  {
    id: '2',
    code: 'WH002',
    name: '부산 물류센터',
    location: '부산 강서구',
    manager: '김영희',
    managerEmail: 'kim@conexgrow.com',
    capacity: 15000,
    currentUsage: 8200,
    status: 'active' as const,
  },
  {
    id: '3',
    code: 'WH003',
    name: '대구 분사',
    location: '대구 동구',
    manager: '이순신',
    managerEmail: 'lee@conexgrow.com',
    capacity: 8000,
    currentUsage: 4500,
    status: 'active' as const,
  },
  {
    id: '4',
    code: 'WH004',
    name: '인천 보관소',
    location: '인천 남동구',
    manager: '박지성',
    managerEmail: 'park@conexgrow.com',
    capacity: 5000,
    currentUsage: 2800,
    status: 'inactive' as const,
  },
];

export default function WarehousesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);

  // 컬럼 정의
  const columns: ColumnDef<Warehouse>[] = [
    {
      accessorKey: 'code',
      header: '창고 코드',
      cell: ({ row }) => <span className="font-medium">{row.getValue('code')}</span>,
    },
    {
      accessorKey: 'name',
      header: '창고명',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'location',
      header: '위치',
      cell: ({ row }) => <span className="text-sm text-gray-600">{row.getValue('location')}</span>,
    },
    {
      accessorKey: 'manager',
      header: '담당자',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.getValue('manager')}</span>
          <span className="text-xs text-gray-500">{row.original.managerEmail}</span>
        </div>
      ),
    },
    {
      id: 'usage',
      header: '용량 사용률',
      cell: ({ row }) => {
        const capacity = row.original.capacity || 0;
        const currentUsage = row.original.currentUsage || 0;
        const usage = capacity > 0 ? Math.round((currentUsage / capacity) * 100) : 0;
        const usageColor = usage > 80 ? 'text-red-600' : usage > 50 ? 'text-yellow-600' : 'text-green-600';
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${usage}%` }}
              />
            </div>
            <span className={`font-medium ${usageColor}`}>{usage}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusMap: Record<string, { label: string; color: string }> = {
          active: { label: '운영중', color: 'bg-green-100 text-green-800' },
          inactive: { label: '폐쇄', color: 'bg-gray-100 text-gray-800' },
        };
        const display = statusMap[status] || statusMap.active;
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${display.color}`}>
            {display.label}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '작업',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedWarehouse(row.original);
              setIsFormOpen(true);
            }}
          >
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              setWarehouses(warehouses.filter((w) => w.id !== row.original.id));
            }}
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  // 검색 필터링
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [warehouses, searchQuery]);

  // 통계 데이터
  const stats = useMemo(() => {
    const total = warehouses.length;
    const active = warehouses.filter((w) => w.status === 'active').length;
    const totalCapacity = warehouses.reduce((sum, w) => sum + (w.capacity || 0), 0);
    const totalUsage = warehouses.reduce((sum, w) => sum + (w.currentUsage || 0), 0);
    const usageRate = totalCapacity > 0 ? Math.round((totalUsage / totalCapacity) * 100) : 0;

    return [
      { label: '전체 창고', value: total },
      { label: '운영중', value: active },
      { label: '전체 용량', value: `${totalCapacity.toLocaleString()} 개` },
      { label: '평균 사용률', value: `${usageRate}%` },
    ];
  }, [warehouses]);

  // 폼 저장 핸들러
  const handleSaveWarehouse = (data: any) => {
    if (selectedWarehouse) {
      // 수정 모드
      setWarehouses(
        warehouses.map((w) =>
          w.id === selectedWarehouse.id ? { ...selectedWarehouse, ...data } : w
        )
      );
    } else {
      // 생성 모드
      const newWarehouse: Warehouse = {
        id: String(warehouses.length + 1),
        ...data,
      };
      setWarehouses([...warehouses, newWarehouse]);
    }
    setIsFormOpen(false);
    setSelectedWarehouse(null);
  };

  // 액션 버튼
  const actions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setWarehouses([...mockWarehouses]);
        }}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        새로고침
      </Button>
      <Button
        onClick={() => {
          setSelectedWarehouse(null);
          setIsFormOpen(true);
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        창고 추가
      </Button>
    </div>
  );

  return (
    <ListPageLayout
      title="창고 관리"
      description="창고 정보를 관리합니다"
      actions={actions}
    >
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <Input
          placeholder="창고명, 코드, 위치로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* 테이블 */}
      <DataTableAdvanced columns={columns} data={filteredWarehouses} />

      {/* 창고 폼 */}
      <WarehouseForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={selectedWarehouse ? 'edit' : 'create'}
        data={selectedWarehouse}
        onSave={handleSaveWarehouse}
      />
    </ListPageLayout>
  );
}
