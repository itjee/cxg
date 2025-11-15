"use client";

/**
 * @file tasks-table.tsx
 * @description 스케줄된 작업 데이터 테이블
 */

import { DataTable } from "@/components/data-table";
import { useTasksStore } from "../stores";
import { getTasksColumns } from "./tasks-columns";
import type { Task } from "../types";

interface TasksTableProps {
  data: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onToggle?: (task: Task) => void;
  onRunNow?: (task: Task) => void;
}

export function TasksTable({
  data,
  onEdit,
  onDelete,
  onToggle,
  onRunNow,
}: TasksTableProps) {
  const { sorting, setSorting } = useTasksStore();
  const columns = getTasksColumns({ onEdit, onDelete, onToggle, onRunNow });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="task_name"
      searchPlaceholder="작업명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
