CREATE TABLE IF NOT EXISTS audt.policies
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),    	-- 보안 정책 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 보안 정책 생성 일시
    created_by                  UUID,                                                              	-- 보안 정책 생성자 UUID (관리자)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 보안 정책 수정 일시
    updated_by                  UUID,                                                              	-- 보안 정책 수정자 UUID

	-- 정책 기본 정보
    policy_name                 VARCHAR(200)             NOT NULL,                                 	-- 정책 이름
    policy_type                 VARCHAR(50)              NOT NULL,                                 	-- 정책 유형 (PASSWORD/ACCESS_CONTROL/DATA_RETENTION/ENCRYPTION)
    policy_category             VARCHAR(50)              NOT NULL,                                 	-- 정책 분류 (AUTHENTICATION/AUTHORIZATION/DATA_PROTECTION/MONITORING)

	-- 정책 상세 내용
    description                 TEXT,                                                              	-- 정책 설명
    rules                       JSONB                    NOT NULL,                                 	-- 정책 규칙 (JSON 형태)

	-- 정책 적용 범위
    apply_to_all_tenants        BOOLEAN                  DEFAULT TRUE,                            	-- 전체 테넌트 적용 여부
    tenant_ids                  UUID[],                                                            	-- 특정 테넌트만 적용하는 경우 테넌트 ID 배열

	-- 정책 시행 정보
    effective_date              DATE                     NOT NULL,                                 	-- 정책 시행 시작일
    expiry_date                 DATE,                                                             	-- 정책 만료일 (NULL: 무기한)
    enforcement_level           VARCHAR(20)              NOT NULL DEFAULT 'MANDATORY',            	-- 시행 수준 (MANDATORY/RECOMMENDED/OPTIONAL)

	-- 버전 관리
    version                     VARCHAR(20)              NOT NULL,                                 	-- 정책 버전
    previous_version_id         UUID,                                                              	-- 이전 버전 참조

	-- 승인 정보
    approved_at                 TIMESTAMP WITH TIME ZONE,                                          	-- 정책 승인 일시
    approved_by                 VARCHAR(100),                                                      	-- 승인자 (보안 관리자, CISO 등)

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',                	-- 정책 상태 (DRAFT/PENDING_APPROVAL/ACTIVE/ARCHIVED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
    CONSTRAINT fk_policies__previous_version_id 		FOREIGN KEY (previous_version_id) REFERENCES audt.policies(id)	ON DELETE CASCADE,

    CONSTRAINT ck_policies__policy_type 				CHECK (policy_type IN ('PASSWORD', 'ACCESS_CONTROL', 'DATA_RETENTION', 'ENCRYPTION', 'AUTHENTICATION', 'NETWORK_SECURITY')),
    CONSTRAINT ck_policies__policy_category 			CHECK (policy_category IN ('AUTHENTICATION', 'AUTHORIZATION', 'DATA_PROTECTION', 'MONITORING', 'INCIDENT_RESPONSE', 'COMPLIANCE')),
    CONSTRAINT ck_policies__enforcement_level 			CHECK (enforcement_level IN ('MANDATORY', 'RECOMMENDED', 'OPTIONAL')),
    CONSTRAINT ck_policies__status 						CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'ARCHIVED')),
    CONSTRAINT ck_policies__effective_date 				CHECK (expiry_date IS NULL OR expiry_date >= effective_date),
    CONSTRAINT ck_policies__tenant_scope_logic 			CHECK ((apply_to_all_tenants = TRUE AND tenant_ids IS NULL) OR (apply_to_all_tenants = FALSE AND tenant_ids IS NOT NULL))
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  audt.policies							IS '보안 정책 관리 - 시스템 전반의 보안 정책 정의, 버전 관리, 승인 프로세스를 통한 일관된 보안 거버넌스';
COMMENT ON COLUMN audt.policies.id 						IS '보안 정책 고유 식별자 - UUID 형태의 기본키, 각 보안 정책을 구분하는 고유값';
COMMENT ON COLUMN audt.policies.created_at 				IS '보안 정책 생성 일시 - 정책이 시스템에 등록된 시점의 타임스탬프';
COMMENT ON COLUMN audt.policies.created_by 				IS '보안 정책 생성자 UUID - 정책을 생성한 관리자 또는 보안 담당자의 식별자';
COMMENT ON COLUMN audt.policies.updated_at 				IS '보안 정책 수정 일시 - 정책이 최종 수정된 시점의 타임스탬프';
COMMENT ON COLUMN audt.policies.updated_by 				IS '보안 정책 수정자 UUID - 정책을 최종 수정한 관리자 또는 보안 담당자의 식별자';
COMMENT ON COLUMN audt.policies.policy_name 			IS '정책 이름 - 보안 정책의 명칭 (예: 비밀번호 복잡도 정책, 접근 제어 정책)';
COMMENT ON COLUMN audt.policies.policy_type 			IS '정책 유형 - PASSWORD(비밀번호), ACCESS_CONTROL(접근제어), DATA_RETENTION(데이터보관), ENCRYPTION(암호화), AUTHENTICATION(인증), NETWORK_SECURITY(네트워크보안)';
COMMENT ON COLUMN audt.policies.policy_category 		IS '정책 분류 - AUTHENTICATION(인증), AUTHORIZATION(권한부여), DATA_PROTECTION(데이터보호), MONITORING(모니터링), INCIDENT_RESPONSE(사고대응), COMPLIANCE(컴플라이언스)';
COMMENT ON COLUMN audt.policies.description 			IS '정책 설명 - 보안 정책의 목적, 적용 범위, 주요 내용에 대한 상세 설명';
COMMENT ON COLUMN audt.policies.rules 					IS '정책 규칙 - 구체적인 보안 규칙과 설정값들을 JSON 형태로 구조화 (예: 비밀번호 최소길이, 암호화 알고리즘 등)';
COMMENT ON COLUMN audt.policies.apply_to_all_tenants 	IS '전체 테넌트 적용 여부 - TRUE(모든 테넌트에 적용), FALSE(특정 테넌트만 적용)';
COMMENT ON COLUMN audt.policies.tenant_ids 				IS '특정 테넌트만 적용하는 경우 테넌트 ID 배열 - apply_to_all_tenants가 FALSE일 때 적용 대상 테넌트들의 UUID 배열';
COMMENT ON COLUMN audt.policies.effective_date 			IS '정책 시행 시작일 - 보안 정책이 실제로 적용되기 시작하는 날짜';
COMMENT ON COLUMN audt.policies.expiry_date 			IS '정책 만료일 - 보안 정책이 만료되는 날짜 (NULL인 경우 무기한 적용)';
COMMENT ON COLUMN audt.policies.enforcement_level 		IS '시행 수준 - MANDATORY(필수, 강제적용), RECOMMENDED(권장, 가이드라인), OPTIONAL(선택, 참고사항)';
COMMENT ON COLUMN audt.policies.version 				IS '정책 버전 - 정책의 버전 정보 (예: 1.0, 2.1, 3.0) 변경 이력 추적용';
COMMENT ON COLUMN audt.policies.previous_version_id 	IS '이전 버전 참조 - 이전 버전의 보안 정책 ID (버전 체인 추적용, self-reference)';
COMMENT ON COLUMN audt.policies.approved_at 			IS '정책 승인 일시 - 보안 정책이 공식적으로 승인된 시점';
COMMENT ON COLUMN audt.policies.approved_by 			IS '승인자 - 보안 정책을 최종 승인한 보안 관리자, CISO, 또는 경영진의 이름';
COMMENT ON COLUMN audt.policies.status 					IS '정책 상태 - DRAFT(초안), PENDING_APPROVAL(승인대기), ACTIVE(활성), ARCHIVED(보관) 정책 생명주기 단계';
COMMENT ON COLUMN audt.policies.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 정책 유형별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__policy_type
    ON audt.policies (policy_type, created_at DESC)
 WHERE deleted = FALSE;

-- 정책 분류별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__policy_category
    ON audt.policies (policy_category, created_at DESC)
 WHERE deleted = FALSE;

-- 상태별 정책 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__status
    ON audt.policies (status, created_at DESC)
 WHERE deleted = FALSE;

-- 활성 정책 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__active_policies
    ON audt.policies (status, effective_date, expiry_date)
 WHERE status = 'ACTIVE' AND deleted = FALSE;

-- 시행 수준별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__enforcement_level
    ON audt.policies (enforcement_level, created_at DESC)
 WHERE deleted = FALSE;

-- 시행일 기준 정책 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__effective_date
    ON audt.policies (effective_date DESC);

-- 만료 예정 정책 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__expiry_date
    ON audt.policies (expiry_date)
 WHERE expiry_date IS NOT NULL AND deleted = FALSE;

-- 버전 체인 추적 최적화
CREATE INDEX IF NOT EXISTS ix_policies__version_chain
    ON audt.policies (previous_version_id, version)
 WHERE previous_version_id IS NOT NULL AND deleted = FALSE;

-- 승인 대기 정책 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__pending_approval
    ON audt.policies (status, created_at DESC)
 WHERE status = 'PENDING_APPROVAL' AND deleted = FALSE;

-- 승인된 정책 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__approved_policies
    ON audt.policies (approved_at DESC, approved_by)
 WHERE approved_at IS NOT NULL AND deleted = FALSE;

-- 특정 테넌트 정책 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_policies__tenant_specific
    ON audt.policies USING GIN (tenant_ids)
 WHERE apply_to_all_tenants = FALSE AND deleted = FALSE;

-- 정책 규칙 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_policies__rules
    ON audt.policies USING GIN (rules)
 WHERE deleted = FALSE;

-- 정책 이름으로 검색 최적화
CREATE INDEX IF NOT EXISTS ix_policies__policy_name
    ON audt.policies (policy_name)
 WHERE deleted = FALSE;

-- 생성 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_policies__created_at
    ON audt.policies (created_at DESC);
