/**
 * @file billing-tab.tsx
 * @description Tab for viewing billing and invoice information
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Invoice, Transaction } from "../../types/tenant-portal.types";

interface BillingTabProps {
  invoices: Invoice[] | undefined;
  transactions: Transaction[] | undefined;
  isLoadingInvoices?: boolean;
  isLoadingTransactions?: boolean;
}

export function BillingTab({
  invoices,
  transactions,
  isLoadingInvoices,
  isLoadingTransactions,
}: BillingTabProps) {
  const getInvoiceStatusColor = (status: string | undefined) => {
    const colors: Record<string, string> = {
      PENDING:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      OVERDUE:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      CANCELED:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[status || "PENDING"] || colors.PENDING;
  };

  const getTransactionStatusColor = (status: string | undefined) => {
    const colors: Record<string, string> = {
      PENDING:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      SUCCESS:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      CANCELED:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[status || "PENDING"] || colors.PENDING;
  };

  return (
    <Tabs defaultValue="invoices" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="invoices">청구서</TabsTrigger>
        <TabsTrigger value="transactions">거래</TabsTrigger>
      </TabsList>

      {/* Invoices Tab */}
      <TabsContent value="invoices" className="space-y-4">
        {isLoadingInvoices ? (
          <Card className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          </Card>
        ) : !invoices || invoices.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              청구서가 없습니다
            </div>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">
                    {invoice.invoiceNo || "청구서"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    청구 기간:{" "}
                    {invoice.startDate || "-"} ~ {invoice.closeDate || "-"}
                  </p>
                </div>
                <Badge className={getInvoiceStatusColor(invoice.status)}>
                  {invoice.status === "PENDING"
                    ? "대기중"
                    : invoice.status === "SENT"
                      ? "발송됨"
                      : invoice.status === "PAID"
                        ? "결제됨"
                        : invoice.status === "OVERDUE"
                          ? "연체"
                          : "취소됨"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t pt-3 text-sm">
                <div>
                  <div className="text-muted-foreground">청구 금액</div>
                  <div className="font-semibold">
                    {(invoice.totalAmount || 0).toLocaleString()}{" "}
                    {invoice.currency || "KRW"}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground">기본 금액</div>
                  <div className="font-semibold">
                    {(invoice.baseAmount || 0).toLocaleString()}{" "}
                    {invoice.currency || "KRW"}
                  </div>
                </div>

                {invoice.usageAmount && invoice.usageAmount > 0 && (
                  <div>
                    <div className="text-muted-foreground">사용료</div>
                    <div className="font-semibold">
                      {invoice.usageAmount.toLocaleString()}{" "}
                      {invoice.currency || "KRW"}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-muted-foreground">발급일</div>
                  <div className="font-semibold">
                    {invoice.invoiceDate || "-"}
                  </div>
                </div>
              </div>

              {invoice.paidAt && (
                <div className="mt-3 pt-3 border-t text-sm">
                  <div className="text-muted-foreground">결제일</div>
                  <div>
                    {new Date(invoice.paidAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </TabsContent>

      {/* Transactions Tab */}
      <TabsContent value="transactions" className="space-y-4">
        {isLoadingTransactions ? (
          <Card className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          </Card>
        ) : !transactions || transactions.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              거래 기록이 없습니다
            </div>
          </Card>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">
                    {transaction.transactionNo || "거래"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {transaction.paymentGateway || "결제 게이트웨이"} -{" "}
                    {transaction.paymentMethod || "-"}
                  </p>
                </div>
                <Badge className={getTransactionStatusColor(transaction.status)}>
                  {transaction.status === "PENDING"
                    ? "대기중"
                    : transaction.status === "SUCCESS"
                      ? "성공"
                      : transaction.status === "FAILED"
                        ? "실패"
                        : "취소됨"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t pt-3 text-sm">
                <div>
                  <div className="text-muted-foreground">금액</div>
                  <div className="font-semibold">
                    {transaction.amount.toLocaleString()}{" "}
                    {transaction.currency || "KRW"}
                  </div>
                </div>

                {transaction.cardDigits && (
                  <div>
                    <div className="text-muted-foreground">카드</div>
                    <div className="font-mono">****{transaction.cardDigits}</div>
                  </div>
                )}

                <div>
                  <div className="text-muted-foreground">처리일</div>
                  <div>
                    {transaction.processedAt
                      ? new Date(
                          transaction.processedAt
                        ).toLocaleDateString("ko-KR")
                      : "-"}
                  </div>
                </div>
              </div>

              {transaction.failureReason && (
                <div className="mt-3 pt-3 border-t text-sm text-red-600">
                  <div className="font-medium">실패 사유</div>
                  <div>{transaction.failureReason}</div>
                </div>
              )}
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
