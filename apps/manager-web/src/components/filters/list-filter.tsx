"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterFieldType = "text" | "select" | "multiSelect" | "dateRange" | "date" | "number";

interface FilterField {
  name: string;
  type: FilterFieldType;
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: any;
}

interface ListFilterProps {
  fields: FilterField[];
  defaultValues?: Record<string, any>;
  onFilter: (values: Record<string, any>) => void;
  onReset: () => void;
  className?: string;
}

export function ListFilter({
  fields,
  defaultValues = {},
  onFilter,
  onReset,
  className,
}: ListFilterProps) {
  const [values, setValues] = useState<Record<string, any>>(defaultValues);

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(values);
  };

  const handleReset = () => {
    setValues(defaultValues);
    onReset();
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className="flex-1 min-w-[200px]">
            {field.label && (
              <Label htmlFor={field.name} className="text-sm font-medium mb-2 block">
                {field.label}
              </Label>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id={field.name}
                type="text"
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="flex-1 min-w-[200px]">
            {field.label && (
              <Label htmlFor={field.name} className="text-sm font-medium mb-2 block">
                {field.label}
              </Label>
            )}
            <Select
              value={values[field.name] || ""}
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder={field.placeholder || "선택"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="flex-1 min-w-[200px]">
            {field.label && (
              <Label htmlFor={field.name} className="text-sm font-medium mb-2 block">
                {field.label}
              </Label>
            )}
            <Input
              id={field.name}
              type="number"
              placeholder={field.placeholder}
              value={values[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-end gap-4">
            {fields.map((field) => renderField(field))}
            <div className="flex gap-2">
              <Button type="submit" size="default">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
              <Button type="button" variant="outline" size="default" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                초기화
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
