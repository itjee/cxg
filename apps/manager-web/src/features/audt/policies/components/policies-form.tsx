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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Policy, CreatePolicyRequest } from "../types/policies.types";

const policySchema = z.object({
  policy_name: z.string().min(1, "정책명을 입력하세요"),
  policy_type: z.enum(["PASSWORD", "ACCESS_CONTROL", "DATA_RETENTION", "ENCRYPTION", "AUTHENTICATION", "NETWORK_SECURITY"]),
  policy_category: z.enum(["AUTHENTICATION", "AUTHORIZATION", "DATA_PROTECTION", "MONITORING", "INCIDENT_RESPONSE", "COMPLIANCE"]),
  description: z.string().optional(),
  rules: z.string().min(1, "정책 규칙을 입력하세요"),
  apply_to_all_tenants: z.boolean(),
  effective_date: z.string().min(1, "시행일을 선택하세요"),
  expiry_date: z.string().optional(),
  enforcement_level: z.enum(["MANDATORY", "RECOMMENDED", "OPTIONAL"]),
  version: z.string().min(1, "버전을 입력하세요"),
});

type FormData = z.infer<typeof policySchema>;

interface PoliciesFormProps {
  initialData?: Policy;
  onSubmit: (data: CreatePolicyRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PoliciesForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: PoliciesFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(policySchema),
    defaultValues: initialData ? {
      ...initialData,
      rules: JSON.stringify(initialData.rules, null, 2),
    } : {
      policy_name: "",
      policy_type: "PASSWORD",
      policy_category: "AUTHENTICATION",
      description: "",
      rules: "{}",
      apply_to_all_tenants: true,
      effective_date: "",
      expiry_date: "",
      enforcement_level: "MANDATORY",
      version: "1.0",
    },
  });

  const handleSubmit = (data: FormData) => {
    try {
      const rules = JSON.parse(data.rules);
      onSubmit({
        ...data,
        rules,
        expiry_date: data.expiry_date || undefined,
      });
    } catch (error) {
      form.setError("rules", { message: "유효하지 않은 JSON 형식입니다" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="policy_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>정책명</FormLabel>
              <FormControl>
                <Input {...field} placeholder="비밀번호 복잡도 정책" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="policy_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>정책 유형</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PASSWORD">비밀번호</SelectItem>
                    <SelectItem value="ACCESS_CONTROL">접근제어</SelectItem>
                    <SelectItem value="DATA_RETENTION">데이터보관</SelectItem>
                    <SelectItem value="ENCRYPTION">암호화</SelectItem>
                    <SelectItem value="AUTHENTICATION">인증</SelectItem>
                    <SelectItem value="NETWORK_SECURITY">네트워크보안</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="policy_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>정책 분류</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="분류 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AUTHENTICATION">인증</SelectItem>
                    <SelectItem value="AUTHORIZATION">권한부여</SelectItem>
                    <SelectItem value="DATA_PROTECTION">데이터보호</SelectItem>
                    <SelectItem value="MONITORING">모니터링</SelectItem>
                    <SelectItem value="INCIDENT_RESPONSE">사고대응</SelectItem>
                    <SelectItem value="COMPLIANCE">컴플라이언스</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="정책 설명..." rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>정책 규칙 (JSON)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder='{"minLength": 8, "requireSpecialChar": true}' rows={6} className="font-mono text-xs" />
              </FormControl>
              <FormDescription>
                JSON 형식으로 정책 규칙을 입력하세요
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="enforcement_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>시행수준</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="수준 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MANDATORY">필수</SelectItem>
                    <SelectItem value="RECOMMENDED">권장</SelectItem>
                    <SelectItem value="OPTIONAL">선택</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>버전</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="1.0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apply_to_all_tenants"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">전체 테넌트</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="effective_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>시행일</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>만료일 (선택)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
