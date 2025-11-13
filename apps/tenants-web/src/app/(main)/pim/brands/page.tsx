"use client";

import { useState, useMemo } from "react";
import { ListPageContainer } from "@/components/layouts/list-page-container";
import { BrandsStats } from "@/features/pim/brands/components/brands-stats";
import { BrandsFilter } from "@/features/pim/brands/components/brands-filter";
import {
  BrandsTable,
  type Brand,
} from "@/features/pim/brands/components/brands-table";

// 임시 모의 데이터
const mockBrands: Brand[] = [
  {
    id: "1",
    code: "APPLE",
    name: "Apple",
    country: "미국",
    description: "프리미엄 전자 제품 브랜드",
    is_active: true,
    product_count: 35,
  },
  {
    id: "2",
    code: "SAMSUNG",
    name: "Samsung",
    country: "한국",
    description: "다양한 전자 제품 제조업체",
    is_active: true,
    product_count: 48,
  },
  {
    id: "3",
    code: "DELL",
    name: "Dell",
    country: "미국",
    description: "컴퓨터 및 주변기기 제조업체",
    is_active: true,
    product_count: 42,
  },
  {
    id: "4",
    code: "LOGITECH",
    name: "Logitech",
    country: "스위스",
    description: "컴퓨터 주변기기 전문 브랜드",
    is_active: true,
    product_count: 56,
  },
  {
    id: "5",
    code: "RAZER",
    name: "Razer",
    country: "싱가포르",
    description: "게이밍 하드웨어 전문 브랜드",
    is_active: true,
    product_count: 28,
  },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 필터링된 데이터
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      if (
        selectedStatus &&
        (selectedStatus === "active" ? !brand.is_active : brand.is_active)
      )
        return false;
      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          brand.name.toLowerCase().includes(query) ||
          brand.code.toLowerCase().includes(query) ||
          brand.country?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [brands, selectedStatus, globalFilter]);

  const handleRefresh = () => {
    setBrands([...mockBrands]);
  };

  const handleAdd = () => {
    console.log("Add brand");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleEdit = (brand: Brand) => {
    console.log("Edit brand:", brand);
  };

  const handleDelete = (brandId: string) => {
    setBrands(brands.filter((b) => b.id !== brandId));
  };

  return (
    <ListPageContainer
      title="브랜드 관리"
      description="제품 브랜드를 관리합니다"
      onRefresh={handleRefresh}
      onAdd={handleAdd}
      showExport={true}
      onExport={handleExport}
    >
      {/* 통계 섹션 */}
      <BrandsStats brands={filteredBrands} />

      {/* 필터 섹션 */}
      <BrandsFilter
        globalFilter={globalFilter}
        selectedStatus={selectedStatus}
        onGlobalFilterChange={setGlobalFilter}
        onStatusChange={setSelectedStatus}
      />

      {/* 데이터 테이블 */}
      <BrandsTable
        data={filteredBrands}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSize={10}
      />
    </ListPageContainer>
  );
}
