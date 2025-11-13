import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Compliance, CreateComplianceRequest } from "../types/compliances.types";

const complianceSchema = z.object({
  report_type: z.enum(["GDPR", "SOX", "HIPAA", "ISO27001", "PCI_DSS", "CCPA", "CUSTOM"]),
  report_name: z.string().min(1, "보고서명을 입력하세요"),
  start_date: z.string().min(1, "시작일을 선택하세요"),
  close_date: z.string().min(1, "종료일을 선택하세요"),
  scope: z.enum(["ALL_TENANTS", "SPECIFIC_TENANT", "SYSTEM_WIDE"]),
  file_type: z.enum(["PDF", "EXCEL", "JSON", "HTML", "CSV"]).optional(),
});

type FormData = z.infer<typeof complianceSchema>;

interface CompliancesFormProps {
  initialData?: Compliance;
  onSubmit: (data: CreateComplianceRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CompliancesForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CompliancesFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(complianceSchema),
    defaultValues: initialData || {
      report_type: "GDPR",
      report_name: "",
      start_date: "",
      close_date: "",
      scope: "ALL_TENANTS",
      file_type: "PDF",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="report_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>보고서 유형</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GDPR">GDPR</SelectItem>
                  <SelectItem value="SOX">SOX</SelectItem>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                  <SelectItem value="ISO27001">ISO27001</SelectItem>
                  <SelectItem value="PCI_DSS">PCI-DSS</SelectItem>
                  <SelectItem value="CCPA">CCPA</SelectItem>
                  <SelectItem value="CUSTOM">맞춤형</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="report_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>보고서명</FormLabel>
              <FormControl>
                <Input {...field} placeholder="2024년 Q4 GDPR 준수 보고서" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>시작일</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="close_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>종료일</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>적용 범위</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="범위 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ALL_TENANTS">전체 테넌트</SelectItem>
                  <SelectItem value="SPECIFIC_TENANT">특정 테넌트</SelectItem>
                  <SelectItem value="SYSTEM_WIDE">시스템 전체</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>파일 형식</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="형식 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="EXCEL">Excel</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "생성 중..." : "생성"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
