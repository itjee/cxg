/**
 * Code Help Columns
 *
 * 코드 헬프 DataTable 컬럼 정의
 */

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { codeHelpService } from "@/shared/services/code-help.service";
import type {
  CodeHelpResult,
  CodeHelpType,
} from "@/shared/types/code-help.types";

interface GetCodeHelpColumnsProps {
  searchType: CodeHelpType;
  showMetadata?: boolean;
}

export function getCodeHelpColumns(
  props: GetCodeHelpColumnsProps
): ColumnDef<CodeHelpResult>[] {
  const { searchType, showMetadata = true } = props;

  // 기본 컬럼 (코드, 이름)
  const baseColumns: ColumnDef<CodeHelpResult>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="코드" />
      ),
      cell: ({ row }) => (
        <div className="font-light">{row.getValue("code")}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="이름" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      size: 200,
    },
  ];

  // 타입별 추가 컬럼
  const typeSpecificColumns: ColumnDef<CodeHelpResult>[] = (() => {
    if (!showMetadata) {
      return [];
    }

    switch (searchType) {
      case "customer":
        return [
          {
            accessorKey: "metadata",
            header: "전화",
            cell: ({ row }) => (
              <div className="text-muted-foreground">
                {codeHelpService.getMetadataField(row.original, "phone") || "-"}
              </div>
            ),
            size: 150,
          },
          {
            accessorKey: "metadata",
            header: "주소",
            cell: ({ row }) => (
              <div className="text-muted-foreground truncate max-w-xs">
                {codeHelpService.getMetadataField(row.original, "address") ||
                  "-"}
              </div>
            ),
            size: 200,
          },
        ];

      case "employee":
        return [
          {
            accessorKey: "metadata",
            header: "부서",
            cell: ({ row }) => (
              <div>
                {codeHelpService.getMetadataField(row.original, "department") ||
                  "-"}
              </div>
            ),
            size: 150,
          },
          {
            accessorKey: "metadata",
            header: "직급",
            cell: ({ row }) => (
              <div>
                {codeHelpService.getMetadataField(row.original, "position") ||
                  "-"}
              </div>
            ),
            size: 150,
          },
        ];

      case "user":
        return [
          {
            accessorKey: "metadata",
            header: "이메일",
            cell: ({ row }) => (
              <div className="text-muted-foreground">
                {codeHelpService.getMetadataField(row.original, "email") || "-"}
              </div>
            ),
            size: 200,
          },
          {
            accessorKey: "metadata",
            header: "사용자 유형",
            cell: ({ row }) => {
              const userType = codeHelpService.getMetadataField(
                row.original,
                "user_type"
              );
              return (
                <Badge variant="outline" className="text-base">
                  {userType || "-"}
                </Badge>
              );
            },
            size: 120,
          },
        ];

      case "product":
        return [
          {
            accessorKey: "metadata",
            header: "카테고리",
            cell: ({ row }) => (
              <div>
                {codeHelpService.getMetadataField(row.original, "category") ||
                  "-"}
              </div>
            ),
            size: 150,
          },
          {
            accessorKey: "metadata",
            header: "가격",
            cell: ({ row }) => (
              <div className="font-light text-right">
                {(() => {
                  const price = codeHelpService.getMetadataField(
                    row.original,
                    "price"
                  );
                  return price
                    ? `₩${Number(price).toLocaleString("ko-KR")}`
                    : "-";
                })()}
              </div>
            ),
            size: 120,
          },
        ];

      case "common_code":
      case "parent_code":
        return [
          {
            accessorKey: "description",
            header: "설명",
            cell: ({ row }) => (
              <div className="text-muted-foreground truncate max-w-xs">
                {row.getValue("description") || "-"}
              </div>
            ),
            size: 250,
          },
        ];

      default:
        return [];
    }
  })();

  // 상태 컬럼 (모든 타입 공통)
  const statusColumn: ColumnDef<CodeHelpResult>[] = [
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={codeHelpService.getStatusVariant(status)}
            className="text-base"
          >
            {codeHelpService.getStatusLabel(status)}
          </Badge>
        );
      },
      size: 80,
    },
  ];

  return [...baseColumns, ...typeSpecificColumns, ...statusColumn];
}
