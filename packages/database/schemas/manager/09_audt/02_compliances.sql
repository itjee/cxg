CREATE TABLE IF NOT EXISTS audt.compliances
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 컴플라이언스 보고서 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 보고서 생성 일시
    created_by                  UUID,                                                              	-- 보고서 생성자 UUID (시스템 또는 관리자)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 보고서 수정 일시
    updated_by                  UUID,                                                              	-- 보고서 수정자 UUID
    -- 보고서 기본 정보
    report_type                 VARCHAR(50)              NOT NULL,                                 	-- 보고서 유형 (GDPR/SOX/HIPAA/ISO27001/CUSTOM)
    report_name                 VARCHAR(200)             NOT NULL,                                 	-- 보고서 이름
    start_date                  DATE                     NOT NULL,                                 	-- 보고서 대상 기간 시작일
    close_date                  DATE                     NOT NULL,                                 	-- 보고서 대상 기간 종료일
    -- 보고서 생성 정보
    generated_at                TIMESTAMP WITH TIME ZONE NOT NULL,                                 	-- 보고서 실제 생성 일시
    generated_by                UUID,                                                              	-- 보고서 생성 담당자 UUID
    -- 보고서 범위 정보
    scope                       VARCHAR(50)              NOT NULL DEFAULT 'ALL_TENANTS',          	-- 보고서 적용 범위 (ALL_TENANTS/SPECIFIC_TENANT/SYSTEM_WIDE)
    tenant_ids                  UUID[],                                                            	-- 특정 테넌트 대상인 경우 테넌트 ID 배열
    -- 컴플라이언스 결과 정보
    compliance_status           VARCHAR(20)              NOT NULL,                                 	-- 컴플라이언스 상태 (COMPLIANT/NON_COMPLIANT/PARTIAL/PENDING)
    findings_count              INTEGER                  DEFAULT 0,                               	-- 발견된 총 이슈 수
    critical_count     			INTEGER                  DEFAULT 0,                               	-- 심각한 이슈 수
    -- 보고서 파일 정보
    file_path                   VARCHAR(500),                                                      	-- 보고서 파일 저장 경로
    file_size                   INTEGER,                                                           	-- 파일 크기 (bytes)
    file_type                   VARCHAR(20)              DEFAULT 'PDF',                           	-- 파일 형식 (PDF/EXCEL/JSON/HTML)
    -- 승인 정보
    approved_at                 TIMESTAMP WITH TIME ZONE,                                          	-- 보고서 승인 일시
    approved_by                 VARCHAR(100),                                                      	-- 승인자 (관리자 또는 감사관)
    -- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',                	-- 보고서 상태 (DRAFT/PENDING_REVIEW/APPROVED/PUBLISHED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_compliances__generated_by 			FOREIGN KEY (generated_by) REFERENCES tnnt.users(id)	ON DELETE CASCADE,

    CONSTRAINT ck_compliances__report_type 				CHECK (report_type IN ('GDPR', 'SOX', 'HIPAA', 'ISO27001', 'PCI_DSS', 'CCPA', 'CUSTOM')),
    CONSTRAINT ck_compliances__compliance_status 		CHECK (compliance_status IN ('COMPLIANT', 'NON_COMPLIANT', 'PARTIAL', 'PENDING')),
    CONSTRAINT ck_compliances__scope 					CHECK (scope IN ('ALL_TENANTS', 'SPECIFIC_TENANT', 'SYSTEM_WIDE')),
    CONSTRAINT ck_compliances__file_type 				CHECK (file_type IN ('PDF', 'EXCEL', 'JSON', 'HTML', 'CSV')),
    CONSTRAINT ck_compliances__status 					CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED')),
    CONSTRAINT ck_compliances__findings_count 			CHECK (findings_count >= 0),
    CONSTRAINT ck_compliances__critical_count 			CHECK (critical_count >= 0),
    CONSTRAINT ck_compliances__critical_vs_total 		CHECK (critical_count <= findings_count),
    CONSTRAINT ck_compliances__date_range 				CHECK (close_date >= start_date),
    CONSTRAINT ck_compliances__file_size 				CHECK (file_size IS NULL OR file_size > 0)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  audt.compliances						IS '컴플라이언스 보고서 - GDPR, SOX, HIPAA 등 각종 규정 준수 보고서의 생성, 승인, 관리를 통한 법적 요구사항 충족';
COMMENT ON COLUMN audt.compliances.id 					IS '컴플라이언스 보고서 고유 식별자 - UUID 형태의 기본키, 각 보고서를 구분하는 고유값';
COMMENT ON COLUMN audt.compliances.created_at 			IS '보고서 생성 일시 - 보고서 레코드가 시스템에 생성된 시점의 타임스탬프';
COMMENT ON COLUMN audt.compliances.created_by 			IS '보고서 생성자 UUID - 보고서를 생성한 시스템 또는 관리자의 식별자';
COMMENT ON COLUMN audt.compliances.updated_at 			IS '보고서 수정 일시 - 보고서 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN audt.compliances.updated_by 			IS '보고서 수정자 UUID - 보고서를 최종 수정한 관리자 또는 시스템의 식별자';
COMMENT ON COLUMN audt.compliances.report_type 			IS '보고서 유형 - GDPR(개인정보보호), SOX(재무투명성), HIPAA(의료정보), ISO27001(정보보안), PCI_DSS(결제정보), CCPA(캘리포니아개인정보), CUSTOM(맞춤형)';
COMMENT ON COLUMN audt.compliances.report_name 			IS '보고서 이름 - 보고서의 제목 또는 설명적 이름 (예: 2024년 Q4 GDPR 준수 보고서)';
COMMENT ON COLUMN audt.compliances.start_date 			IS '보고서 대상 기간 시작일 - 컴플라이언스 검토 대상 기간의 시작 날짜';
COMMENT ON COLUMN audt.compliances.close_date 			IS '보고서 대상 기간 종료일 - 컴플라이언스 검토 대상 기간의 종료 날짜';
COMMENT ON COLUMN audt.compliances.generated_at 		IS '보고서 실제 생성 일시 - 보고서가 실제로 생성되고 완료된 시점';
COMMENT ON COLUMN audt.compliances.generated_by 		IS '보고서 생성 담당자 UUID - 보고서 생성을 담당한 사용자의 식별자 (users 테이블 참조)';
COMMENT ON COLUMN audt.compliances.scope 				IS '보고서 적용 범위 - ALL_TENANTS(전체 테넌트), SPECIFIC_TENANT(특정 테넌트), SYSTEM_WIDE(시스템 전체) 보고 범위 구분';
COMMENT ON COLUMN audt.compliances.tenant_ids 			IS '특정 테넌트 대상인 경우 테넌트 ID 배열 - scope가 SPECIFIC_TENANT일 때 대상 테넌트들의 UUID 배열';
COMMENT ON COLUMN audt.compliances.compliance_status 	IS '컴플라이언스 상태 - COMPLIANT(준수), NON_COMPLIANT(미준수), PARTIAL(부분준수), PENDING(검토중) 규정 준수 결과';
COMMENT ON COLUMN audt.compliances.findings_count 		IS '발견된 총 이슈 수 - 컴플라이언스 검토 과정에서 발견된 모든 문제점의 개수';
COMMENT ON COLUMN audt.compliances.critical_count 		IS '심각한 이슈 수 - 즉시 조치가 필요한 중대한 컴플라이언스 위반 사항의 개수';
COMMENT ON COLUMN audt.compliances.file_path 			IS '보고서 파일 저장 경로 - 생성된 보고서 파일의 서버 또는 클라우드 스토리지 경로';
COMMENT ON COLUMN audt.compliances.file_size 			IS '파일 크기 - 보고서 파일의 크기 (바이트 단위)';
COMMENT ON COLUMN audt.compliances.file_type 			IS '파일 형식 - PDF(일반문서), EXCEL(스프레드시트), JSON(구조화데이터), HTML(웹문서), CSV(데이터파일) 보고서 형식';
COMMENT ON COLUMN audt.compliances.approved_at 			IS '보고서 승인 일시 - 관리자나 감사관이 보고서를 최종 승인한 시점';
COMMENT ON COLUMN audt.compliances.approved_by 			IS '승인자 - 보고서를 최종 승인한 관리자, 감사관, 또는 외부 기관의 이름';
COMMENT ON COLUMN audt.compliances.status 				IS '보고서 상태 - DRAFT(초안), PENDING_REVIEW(검토대기), APPROVED(승인완료), PUBLISHED(공개/제출완료) 처리 단계';
COMMENT ON COLUMN audt.compliances.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 보고서 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__report_type
    ON audt.compliances (report_type, created_at DESC)
 WHERE deleted = FALSE;

-- 상태별 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__status
    ON audt.compliances (status, created_at DESC)
 WHERE deleted = FALSE;

-- 컴플라이언스 상태별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__compliance_status
    ON audt.compliances (compliance_status, created_at DESC)
 WHERE deleted = FALSE;

-- 생성일 기준 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__generated_at
    ON audt.compliances (generated_at DESC);

-- 보고 기간별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__report_period
    ON audt.compliances (start_date, close_date, created_at DESC)
 WHERE deleted = FALSE;

-- 생성자별 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__generated_by
    ON audt.compliances (generated_by, created_at DESC)
 WHERE generated_by IS NOT NULL AND deleted = FALSE;

-- 범위별 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__scope
    ON audt.compliances (scope, created_at DESC)
 WHERE deleted = FALSE;

-- 미준수 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__non_compliant
    ON audt.compliances (compliance_status, findings_count DESC, created_at DESC)
 WHERE compliance_status = 'NON_COMPLIANT' AND deleted = FALSE;

-- 심각한 이슈 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__critical_findings
    ON audt.compliances (critical_count DESC, created_at DESC)
 WHERE critical_count > 0 AND deleted = FALSE;

-- 승인 대기 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__pending_approval
    ON audt.compliances (status, generated_at DESC)
 WHERE status = 'PENDING_REVIEW' AND deleted = FALSE;

-- 승인된 보고서 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__approved_reports
    ON audt.compliances (approved_at DESC, approved_by)
 WHERE approved_at IS NOT NULL AND deleted = FALSE;

-- 특정 테넌트 보고서 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_compliances__tenant_scope
    ON audt.compliances USING GIN (tenant_ids)
 WHERE scope = 'SPECIFIC_TENANT' AND deleted = FALSE;

-- 파일 정보별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__file_info
    ON audt.compliances (file_type, file_size DESC)
 WHERE file_path IS NOT NULL AND deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_compliances__created_at
    ON audt.compliances (created_at DESC);
