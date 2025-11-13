"use client";

import { useState, useMemo } from "react";
import { ListPageContainer } from "@/components/layouts/list-page-container";
import { CategoriesStats } from "@/features/pim/categories/components/categories-stats";
import { CategoriesFilter } from "@/features/pim/categories/components/categories-filter";
import {
  CategoriesTable,
  type Category,
} from "@/features/pim/categories/components/categories-table";

// 임시 모의 데이터
const mockCategories: Category[] = [
  {
    id: "1",
    code: "ELEC",
    name: "전자기기",
    description: "컴퓨터 및 전자 제품",
    display_order: 1,
    is_active: true,
    product_count: 45,
  },
  {
    id: "2",
    code: "ACC",
    name: "액세서리",
    parent_category: "전자기기",
    description: "컴퓨터 액세서리",
    display_order: 2,
    is_active: true,
    product_count: 128,
  },
  {
    id: "3",
    code: "SOFT",
    name: "소프트웨어",
    description: "응용 소프트웨어",
    display_order: 3,
    is_active: true,
    product_count: 23,
  },
  {
    id: "4",
    code: "SVC",
    name: "서비스",
    description: "기술 지원 및 컨설팅 서비스",
    display_order: 4,
    is_active: true,
    product_count: 8,
  },
  {
    id: "5",
    code: "PRPH",
    name: "주변기기",
    parent_category: "액세서리",
    description: "컴퓨터 주변 기기",
    display_order: 5,
    is_active: false,
    product_count: 0,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 필터링된 데이터
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      if (
        selectedStatus &&
        (selectedStatus === "active" ? !category.is_active : category.is_active)
      )
        return false;
      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          category.code.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [categories, selectedStatus, globalFilter]);

  const handleRefresh = () => {
    setCategories([...mockCategories]);
  };

  const handleAdd = () => {
    console.log("Add category");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleEdit = (category: Category) => {
    console.log("Edit category:", category);
  };

  const handleDelete = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
  };

  return (
    <ListPageContainer
      title="카테고리 관리"
      description="제품 카테고리를 관리합니다"
      onRefresh={handleRefresh}
      onAdd={handleAdd}
      showExport={true}
      onExport={handleExport}
    >
      {/* 통계 섹션 */}
      <CategoriesStats categories={filteredCategories} />

      {/* 필터 섹션 */}
      <CategoriesFilter
        globalFilter={globalFilter}
        selectedStatus={selectedStatus}
        onGlobalFilterChange={setGlobalFilter}
        onStatusChange={setSelectedStatus}
      />

      {/* 데이터 테이블 */}
      <CategoriesTable
        data={filteredCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSize={10}
      />
    </ListPageContainer>
  );
}
