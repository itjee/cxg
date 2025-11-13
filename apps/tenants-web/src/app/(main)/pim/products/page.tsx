"use client";

import { useState, useMemo } from "react";
import { ListPageContainer } from "@/components/layouts/list-page-container";
import { ProductsStats } from "@/features/pim/products/components/products-stats";
import { ProductsFilter } from "@/features/pim/products/components/products-filter";
import {
  ProductsTable,
  type Product,
} from "@/features/pim/products/components/products-table";

// 임시 모의 데이터
const mockProducts: Product[] = [
  {
    id: "1",
    code: "PROD001",
    name: "노트북",
    category: "ELECTRONICS",
    brand: "TechBrand",
    price: 1500000,
    stock: 50,
    status: "active" as const,
  },
  {
    id: "2",
    code: "PROD002",
    name: "마우스",
    category: "ACCESSORIES",
    brand: "TechBrand",
    price: 35000,
    stock: 200,
    status: "active" as const,
  },
  {
    id: "3",
    code: "PROD003",
    name: "키보드",
    category: "ACCESSORIES",
    brand: "MechanicalBrand",
    price: 120000,
    stock: 100,
    status: "active" as const,
  },
  {
    id: "4",
    code: "PROD004",
    name: "모니터",
    category: "ELECTRONICS",
    brand: "DisplayBrand",
    price: 350000,
    stock: 25,
    status: "active" as const,
  },
  {
    id: "5",
    code: "PROD005",
    name: "웹캠",
    category: "ACCESSORIES",
    brand: "CameraBrand",
    price: 65000,
    stock: 0,
    status: "inactive" as const,
  },
];

// 카테고리 맵
const categoryMap: Record<string, string> = {
  ELECTRONICS: "전자기기",
  ACCESSORIES: "액세서리",
  SOFTWARE: "소프트웨어",
  SERVICE: "서비스",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 필터링된 데이터
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory)
        return false;
      if (
        selectedStatus &&
        (selectedStatus === "active"
          ? product.status !== "active"
          : product.status === "active")
      )
        return false;
      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [products, selectedCategory, selectedStatus, globalFilter]);

  const handleRefresh = () => {
    setProducts([...mockProducts]);
  };

  const handleAdd = () => {
    console.log("Add product");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  return (
    <ListPageContainer
      title="제품 관리"
      description="제품 정보를 관리합니다"
      onRefresh={handleRefresh}
      onAdd={handleAdd}
      showExport={true}
      onExport={handleExport}
    >
      {/* 통계 섹션 */}
      <ProductsStats products={filteredProducts} />

      {/* 필터 섹션 */}
      <ProductsFilter
        globalFilter={globalFilter}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        categories={Array.from(new Set(products.map((p) => p.category || "")))}
        onGlobalFilterChange={setGlobalFilter}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
      />

      {/* 데이터 테이블 */}
      <ProductsTable
        data={filteredProducts}
        categoryMap={categoryMap}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageSize={10}
      />
    </ListPageContainer>
  );
}
