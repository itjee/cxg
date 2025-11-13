"use client";

import React, { useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  ExchangeRatesHeader,
  ExchangeRatesStats,
  ExchangeRatesFilters,
  ExchangeRatesPaging,
  ExchangeRatesEdit,
  ExchangeRatesList,
} from "@/features/adm/exchange-rates";
import { useExchangeRatesStore } from "@/features/adm/exchange-rates/stores/exchange-rates.store";
import type { ExchangeRate } from "@/features/adm/exchange-rates/types/exchange-rates.types";

// 더미 데이터
const dummyExchangeRates: ExchangeRate[] = [
  {
    id: "1",
    from_currency: "USD",
    to_currency: "KRW",
    rate: 1200.5,
    effective_date: "2025-10-28",
    description: "달러 원 환율",
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-10-28T10:30:00Z",
  },
  {
    id: "2",
    from_currency: "EUR",
    to_currency: "KRW",
    rate: 1350.75,
    effective_date: "2025-10-28",
    description: "유로 원 환율",
    is_active: true,
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-10-27T15:20:00Z",
  },
  {
    id: "3",
    from_currency: "JPY",
    to_currency: "KRW",
    rate: 8.45,
    effective_date: "2025-10-28",
    description: "엔 원 환율",
    is_active: true,
    created_at: "2025-02-01T00:00:00Z",
    updated_at: "2025-10-25T09:15:00Z",
  },
  {
    id: "4",
    from_currency: "GBP",
    to_currency: "KRW",
    rate: 1500.25,
    effective_date: "2025-10-27",
    description: "파운드 원 환율",
    is_active: true,
    created_at: "2025-02-10T00:00:00Z",
    updated_at: "2025-10-24T12:00:00Z",
  },
  {
    id: "5",
    from_currency: "CNY",
    to_currency: "KRW",
    rate: 170.5,
    effective_date: "2025-10-26",
    description: "위안 원 환율",
    is_active: false,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-10-20T08:00:00Z",
  },
];

export default function ExchangeRatesPage() {
  const {
    searchQuery,
    statusFilter,
    openSidebar,
  } = useExchangeRatesStore();

  const [exchangeRates, setExchangeRates] = React.useState<ExchangeRate[]>(
    dummyExchangeRates
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // 환율 데이터 로드 (더미 데이터 사용)
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsLoading(true);
        // API 호출 대신 더미 데이터 사용
        await new Promise((resolve) => setTimeout(resolve, 100));
        setExchangeRates(dummyExchangeRates);
      } catch (err) {
        console.error("Failed to load exchange rates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExchangeRates();
  }, []);

  // 필터링된 데이터
  const filteredRates = useMemo(() => {
    const isActiveFilter =
      statusFilter === "active"
        ? true
        : statusFilter === "inactive"
        ? false
        : undefined;

    return exchangeRates.filter((rate) => {
      if (isActiveFilter !== undefined) {
        if (rate.is_active !== isActiveFilter) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          rate.from_currency.toLowerCase().includes(query) ||
          rate.to_currency.toLowerCase().includes(query) ||
          rate.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [exchangeRates, statusFilter, searchQuery]);

  // 테이블 컬럼 정의
  const columns: ColumnDef<ExchangeRate>[] = useMemo(
    () => [
      {
        accessorKey: "from_currency",
        header: "기준 통화",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {row.original.from_currency}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              →
            </span>
          </div>
        ),
        size: 100,
      },
      {
        accessorKey: "to_currency",
        header: "대상 통화",
        cell: ({ row }) => (
          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
            {row.original.to_currency}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "rate",
        header: "환율",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            {(row.original.rate as number).toFixed(4)}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "effective_date",
        header: "적용일",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row.original.effective_date}
          </span>
        ),
        size: 110,
      },
      {
        accessorKey: "description",
        header: "설명",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row.original.description || "-"}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "is_active",
        header: "상태",
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? "default" : "secondary"}>
            {row.original.is_active ? "활성" : "비활성"}
          </Badge>
        ),
        size: 80,
      },
      {
        accessorKey: "created_at",
        header: "생성일시",
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          return (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
        size: 150,
      },
      {
        accessorKey: "updated_at",
        header: "수정일시",
        cell: ({ row }) => {
          if (!row.original.updated_at) {
            return (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                -
              </span>
            );
          }
          const date = new Date(row.original.updated_at);
          return (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
        size: 150,
      },
      {
        id: "actions",
        header: "작업",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                openSidebar(true, row.original);
              }}
              title="수정"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => {
                if (
                  confirm(
                    `'${row.original.from_currency}/${row.original.to_currency}' 환율을 삭제하시겠습니까?`
                  )
                ) {
                  handleDeleteExchangeRate(row.original);
                }
              }}
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        size: 100,
        enableSorting: false,
      },
    ],
    [openSidebar]
  );

  const handleRefresh = async () => {
    try {
      setExchangeRates(dummyExchangeRates);
    } catch (err) {
      console.error("Failed to refresh exchange rates:", err);
      alert("새로고침 중 오류가 발생했습니다.");
    }
  };

  const handleExport = () => {
    // Export 로직 구현
    console.log("Export clicked");
  };

  const handleDeleteExchangeRate = (rate: ExchangeRate) => {
    try {
      setExchangeRates(exchangeRates.filter((e) => e.id !== rate.id));
    } catch (err) {
      console.error("Failed to delete exchange rate:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <ExchangeRatesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <ExchangeRatesStats exchangeRates={exchangeRates} />

      {/* 필터 섹션 */}
      <ExchangeRatesFilters exchangeRates={exchangeRates} />

      {/* 데이터 테이블 */}
      <ExchangeRatesList columns={columns} data={filteredRates} />

      {/* 페이지네이션 */}
      <ExchangeRatesPaging
        totalItems={filteredRates.length}
        itemsPerPage={10}
      />

      {/* 환율 수정/생성 폼 */}
      <ExchangeRatesEdit />
    </div>
  );
}
