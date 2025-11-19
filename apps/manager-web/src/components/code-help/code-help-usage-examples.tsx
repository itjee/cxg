/**
 * Code Help Usage Examples
 *
 * CodeHelpModal 사용 예시 모음
 */

"use client";

import { useState } from "react";
import { CodeHelpModal } from "./code-help-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CodeHelpResult, CodeHelpFilters } from "@/shared/types/code-help.types";
import { codeHelpService } from "@/shared/services/code-help.service";

/**
 * 예시 1: 거래처 검색 (단일 선택)
 */
export function CustomerSearchExample() {
  const [selectedCustomer, setSelectedCustomer] = useState<CodeHelpResult | null>(null);
  const [openCodeHelp, setOpenCodeHelp] = useState(false);

  const handleSelectCustomer = (item: CodeHelpResult) => {
    setSelectedCustomer(item);
    console.log("선택된 거래처:", item);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          readOnly
          placeholder="거래처를 선택하세요"
          value={
            selectedCustomer
              ? codeHelpService.formatSelectedItem(selectedCustomer)
              : ""
          }
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setOpenCodeHelp(true)}>
          검색
        </Button>
      </div>

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="customer"
        width="700px"
        height="600px"
        onSelect={handleSelectCustomer}
        showMetadata
      />
    </div>
  );
}

/**
 * 예시 2: 사원 검색 (부서 필터 적용)
 */
export function EmployeeSearchWithFilterExample() {
  const [selectedEmployee, setSelectedEmployee] = useState<CodeHelpResult | null>(null);
  const [openCodeHelp, setOpenCodeHelp] = useState(false);

  const filters: CodeHelpFilters = {
    department: "IT",
    status: "ACTIVE",
  };

  const handleSelectEmployee = (item: CodeHelpResult) => {
    setSelectedEmployee(item);
    console.log("선택된 사원:", item);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          readOnly
          placeholder="사원을 선택하세요"
          value={
            selectedEmployee
              ? codeHelpService.formatSelectedItem(selectedEmployee)
              : ""
          }
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setOpenCodeHelp(true)}>
          검색
        </Button>
      </div>

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="employee"
        title="IT 부서 사원 검색"
        width="700px"
        height="600px"
        onSelect={handleSelectEmployee}
        filters={filters}
        showMetadata
      />
    </div>
  );
}

/**
 * 예시 3: 공통코드 검색 (부모코드 필터)
 */
export function CommonCodeSearchExample() {
  const [selectedCode, setSelectedCode] = useState<CodeHelpResult | null>(null);
  const [openCodeHelp, setOpenCodeHelp] = useState(false);

  // 예: 부서유형 코드만 검색
  const parentCode = "DEPT_TYPE";

  const filters: CodeHelpFilters = {
    parentCode,
  };

  const handleSelectCode = (item: CodeHelpResult) => {
    setSelectedCode(item);
    console.log("선택된 공통코드:", item);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          readOnly
          placeholder="부서유형을 선택하세요"
          value={
            selectedCode
              ? codeHelpService.formatSelectedItem(selectedCode)
              : ""
          }
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setOpenCodeHelp(true)}>
          검색
        </Button>
      </div>

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="common_code"
        title={`${parentCode} 선택`}
        width="600px"
        height="600px"
        onSelect={handleSelectCode}
        filters={filters}
      />
    </div>
  );
}

/**
 * 예시 4: 사용자 검색 (다중 선택)
 */
export function UserMultiSelectExample() {
  const [selectedUsers, setSelectedUsers] = useState<CodeHelpResult[]>([]);
  const [openCodeHelp, setOpenCodeHelp] = useState(false);

  const handleSelectUsers = (item: CodeHelpResult) => {
    // 다중 선택 콜백
    console.log("선택된 사용자:", item);
  };

  const handleMultiSelect = (items: CodeHelpResult[]) => {
    setSelectedUsers(items);
    console.log("선택된 사용자 목록:", items);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          readOnly
          placeholder="사용자를 선택하세요"
          value={
            selectedUsers.length > 0
              ? codeHelpService.formatMultipleSelection(selectedUsers)
              : ""
          }
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setOpenCodeHelp(true)}>
          검색
        </Button>
      </div>

      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">선택된 사용자:</p>
          <div className="space-y-1">
            {selectedUsers.map((user) => (
              <div key={user.id} className="text-muted-foreground">
                {codeHelpService.formatSelectedItem(user)}
              </div>
            ))}
          </div>
        </div>
      )}

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="user"
        width="700px"
        height="600px"
        multiSelect
        onSelect={handleSelectUsers}
        onMultiSelect={handleMultiSelect}
        showMetadata
      />
    </div>
  );
}

/**
 * 예시 5: 기존 폼에 통합 (React Hook Form)
 */
import { useForm } from "react-hook-form";

interface FormData {
  customerId: string;
  customerCode: string;
  customerName: string;
}

export function CodeHelpIntegrationFormExample() {
  const { register, setValue, watch } = useForm<FormData>({
    defaultValues: {
      customerId: "",
      customerCode: "",
      customerName: "",
    },
  });

  const [openCodeHelp, setOpenCodeHelp] = useState(false);
  const customerId = watch("customerId");

  const handleSelectCustomer = (item: CodeHelpResult) => {
    // 폼 값 설정
    setValue("customerId", item.id);
    setValue("customerCode", item.code);
    setValue("customerName", item.name);
    setOpenCodeHelp(false);
  };

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="font-medium">거래처코드</label>
          <Input
            readOnly
            {...register("customerCode")}
            className="mt-1"
          />
        </div>
        <div>
          <label className="font-medium">거래처명</label>
          <Input
            readOnly
            {...register("customerName")}
            className="mt-1"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenCodeHelp(true)}
            className="w-full"
          >
            검색
          </Button>
        </div>
      </div>

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="customer"
        onSelect={handleSelectCustomer}
        showMetadata
      />
    </form>
  );
}

/**
 * 예시 6: 상위코드 선택 (부모코드 검색)
 */
export function ParentCodeSearchExample() {
  const [selectedParentCode, setSelectedParentCode] = useState<CodeHelpResult | null>(null);
  const [openCodeHelp, setOpenCodeHelp] = useState(false);

  const handleSelectParentCode = (item: CodeHelpResult) => {
    setSelectedParentCode(item);
    console.log("선택된 상위코드:", item);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          readOnly
          placeholder="상위코드를 선택하세요"
          value={
            selectedParentCode
              ? codeHelpService.formatSelectedItem(selectedParentCode)
              : ""
          }
          className="flex-1"
        />
        <Button variant="outline" onClick={() => setOpenCodeHelp(true)}>
          검색
        </Button>
      </div>

      <CodeHelpModal
        open={openCodeHelp}
        onOpenChange={setOpenCodeHelp}
        searchType="parent_code"
        title="상위코드 선택"
        width="600px"
        height="600px"
        onSelect={handleSelectParentCode}
      />
    </div>
  );
}
