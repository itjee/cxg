"use client";

import { useState, useMemo } from "react";
import { ListPageContainer } from "@/components/layouts/list-page-container";
import { MakersStats } from "@/features/pim/makers/components/makers-stats";
import { MakersFilter } from "@/features/pim/makers/components/makers-filter";
import {
  MakersTable,
  type Maker,
} from "@/features/pim/makers/components/makers-table";

// 임시 모의 데이터
const mockMakers: Maker[] = [
  {
    id: "1",
    code: "MKR001",
    name: "Foxconn Technology Group",
    country: "대만",
    region: "아시아",
    contact_person: "John Smith",
    email: "contact@foxconn.com",
    is_active: true,
    product_count: 125,
  },
  {
    id: "2",
    code: "MKR002",
    name: "Samsung Electronics",
    country: "한국",
    region: "아시아",
    contact_person: "Kim Min-jae",
    email: "supply@samsung.com",
    is_active: true,
    product_count: 89,
  },
  {
    id: "3",
    code: "MKR003",
    name: "LG Electronics",
    country: "한국",
    region: "아시아",
    contact_person: "Lee Joon-hee",
    email: "partner@lg.com",
    is_active: true,
    product_count: 72,
  },
  {
    id: "4",
    code: "MKR004",
    name: "Compal Electronics",
    country: "대만",
    region: "아시아",
    contact_person: "Chen Wei",
    email: "supply@compal.com",
    is_active: true,
    product_count: 43,
  },
  {
    id: "5",
    code: "MKR005",
    name: "Pegatron",
    country: "대만",
    region: "아시아",
    contact_person: "Wu Ming-feng",
    email: "contact@pegatron.com",
    is_active: false,
    product_count: 0,
  },
];

export default function MakersPage() {
  const [makers, setMakers] = useState<Maker[]>(mockMakers);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 필터링된 데이터
  const filteredMakers = useMemo(() => {
    return makers.filter((maker) => {
      if (
        selectedStatus &&
        (selectedStatus === "active" ? !maker.is_active : maker.is_active)
      )
        return false;
      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          maker.name.toLowerCase().includes(query) ||
          maker.code.toLowerCase().includes(query) ||
          maker.country?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [makers, selectedStatus, globalFilter]);

  const handleRefresh = () => {
    setMakers([...mockMakers]);
  };

  const handleAdd = () => {
    console.log("Add maker");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleEdit = (maker: Maker) => {
    console.log("Edit maker:", maker);
  };

  const handleDelete = (makerId: string) => {
    setMakers(makers.filter((m) => m.id !== makerId));
  };

  return (
    <ListPageContainer
      title="제조사 관리"
      description="제품 제조사를 관리합니다"
      onRefresh={handleRefresh}
      onAdd={handleAdd}
      showExport={true}
      onExport={handleExport}
    >
      {/* 통계 섹션 */}
      <MakersStats makers={filteredMakers} />

      {/* 필터 섹션 */}
      <MakersFilter
        globalFilter={globalFilter}
        selectedStatus={selectedStatus}
        onGlobalFilterChange={setGlobalFilter}
        onStatusChange={setSelectedStatus}
      />

      {/* 데이터 테이블 */}
      <MakersTable
        data={filteredMakers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSize={10}
      />
    </ListPageContainer>
  );
}
