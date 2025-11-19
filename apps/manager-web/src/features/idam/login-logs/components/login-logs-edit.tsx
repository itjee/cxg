"use client";

/**
 * Login Logs Edit Dialog
 *
 * 로그인 이력 상세 조회 Dialog 컴포넌트
 * Apollo GraphQL Hooks를 사용합니다.
 *
 * 로그인 이력은 읽기 전용입니다 (감사 데이터).
 */

import { EntityDrawer } from "@/components/features";
import { useLoginLogsStore } from "../stores/login-logs.store";
import { useLoginLog } from "../hooks";

export function LoginLogsEdit() {
  const { formOpen, selectedId, closeForm } = useLoginLogsStore();

  // 상세 조회 (단수)
  const { data: loginLogResponse, loading } = useLoginLog(selectedId || "");
  const loginLog = loginLogResponse?.loginLog;

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title="로그인 이력 상세"
      description="로그인 이력은 읽기 전용 감사 데이터입니다."
      width="md"
    >
      {loading ? (
        <div className="p-4 text-center">로드 중...</div>
      ) : loginLog ? (
        <div className="space-y-6">
          {/* 알림 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-base text-blue-800">
              ℹ️ 로그인 이력은 보안 감사 목적의 데이터로 편집할 수 없습니다.
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">
                사용자명
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {loginLog.username || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">
                사용자 유형
              </label>
              <p className="mt-1 text-base font-medium text-gray-900">
                {loginLog.userType || "-"}
              </p>
            </div>
          </div>

          {/* 시도 정보 */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-base font-semibold text-gray-900">시도 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  시도 유형
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {loginLog.attemptType}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  결과
                </label>
                <p
                  className={`mt-1 text-base font-medium ${
                    loginLog.success
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {loginLog.success ? "성공" : "실패"}
                </p>
              </div>
            </div>

            {loginLog.failureReason && (
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  실패 사유
                </label>
                <p className="mt-1 text-base text-red-600">
                  {loginLog.failureReason}
                </p>
              </div>
            )}
          </div>

          {/* 세션 정보 */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-base font-semibold text-gray-900">세션 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  IP 주소
                </label>
                <p className="mt-1 text-base font-mono text-gray-900">
                  {loginLog.ipAddress}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  위치
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {loginLog.city || "-"} ({loginLog.countryCode || "N/A"})
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase">
                  MFA 사용
                </label>
                <p className="mt-1 text-base text-gray-900">
                  {loginLog.mfaUsed ? "예" : "아니오"}
                </p>
              </div>
              {loginLog.mfaMethod && (
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase">
                    MFA 방식
                  </label>
                  <p className="mt-1 text-base text-gray-900">
                    {loginLog.mfaMethod}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 타임스탬프 */}
          <div className="space-y-4 pt-4 border-t text-sm text-gray-500">
            <div className="flex justify-between">
              <span>생성 일시:</span>
              <span>{loginLog.createdAt}</span>
            </div>
            {loginLog.updatedAt && (
              <div className="flex justify-between">
                <span>수정 일시:</span>
                <span>{loginLog.updatedAt}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          데이터를 찾을 수 없습니다.
        </div>
      )}
    </EntityDrawer>
  );
}
