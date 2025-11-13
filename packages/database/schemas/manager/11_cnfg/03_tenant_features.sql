CREATE TABLE IF NOT EXISTS cnfg.tenant_features
(
    -- 기본 식별자 및 감사 필드
    id                  	UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 오버라이드 레코드 고유 식별자
    created_at          	TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 레코드 생성 일시
    created_by          	UUID,                                                               -- 레코드 생성자 UUID
    updated_at          	TIMESTAMP WITH TIME ZONE,                                           -- 레코드 최종 수정 일시
    updated_by          	UUID,                                                               -- 레코드 최종 수정자 UUID

    -- 관계 참조 필드
    tenant_id           	UUID                     NOT NULL,                                  -- 대상 테넌트 ID
    feature_flag_id     	UUID                     NOT NULL,                                  -- 대상 기능 플래그 ID

    -- 오버라이드 설정
    enabled    				BOOLEAN                  NOT NULL,                                  -- 테넌트별 기능 활성화 여부
    reason     				VARCHAR(500),                                                       -- 오버라이드 사유 설명

    -- 유효 기간 설정
    start_time          	TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,        -- 오버라이드 유효 시작 일시
    close_time          	TIMESTAMP WITH TIME ZONE,                                           -- 오버라이드 유효 종료 일시

    -- 승인 관리
    approved_by         	UUID,                                                               -- 승인자 UUID
    approved_at         	TIMESTAMP WITH TIME ZONE,                                           -- 승인 일시
    approval_reason     	TEXT,                                                               -- 승인 사유 메모

    -- 논리적 삭제 플래그
    deleted             	BOOLEAN                  NOT NULL DEFAULT FALSE,                    -- 논리적 삭제 플래그

    -- 제약조건
    CONSTRAINT fk_tenant_features__tenant_id		FOREIGN KEY (tenant_id) 		REFERENCES tnnt.tenants(id)			ON DELETE CASCADE,
    CONSTRAINT fk_tenant_features__feature_flag_id	FOREIGN KEY (feature_flag_id) 	REFERENCES cnfg.feature_flags(id)	ON DELETE CASCADE,

    CONSTRAINT uk_tenant_features__tenant_feature	UNIQUE (tenant_id, feature_flag_id),
    CONSTRAINT ck_tenant_features__validity_period	CHECK (close_time IS NULL OR close_time > start_time)
);

-- 컬럼별 코멘트 추가
COMMENT ON TABLE  cnfg.tenant_features 					IS '테넌트별 기능 오버라이드 - 특정 테넌트에 대한 기능 플래그 개별 설정 관리';
COMMENT ON COLUMN cnfg.tenant_features.id 				IS '오버라이드 레코드 고유 식별자 (UUID)';
COMMENT ON COLUMN cnfg.tenant_features.created_at 		IS '레코드 생성 일시';
COMMENT ON COLUMN cnfg.tenant_features.created_by 		IS '레코드 생성자 UUID (관리자 또는 시스템)';
COMMENT ON COLUMN cnfg.tenant_features.updated_at 		IS '레코드 최종 수정 일시';
COMMENT ON COLUMN cnfg.tenant_features.updated_by 		IS '레코드 최종 수정자 UUID';
COMMENT ON COLUMN cnfg.tenant_features.tenant_id 		IS '대상 테넌트 ID - 기능 오버라이드가 적용될 테넌트';
COMMENT ON COLUMN cnfg.tenant_features.feature_flag_id 	IS '대상 기능 플래그 ID - 오버라이드할 기능 플래그';
COMMENT ON COLUMN cnfg.tenant_features.enabled 			IS '테넌트별 기능 활성화 여부 - 전역 설정 대신 사용할 개별 설정';
COMMENT ON COLUMN cnfg.tenant_features.reason 			IS '오버라이드 사유 설명 - 왜 개별 설정이 필요한지에 대한 설명';
COMMENT ON COLUMN cnfg.tenant_features.start_time 		IS '오버라이드 유효 시작 일시 - 개별 설정이 적용되기 시작하는 시간';
COMMENT ON COLUMN cnfg.tenant_features.close_time 		IS '오버라이드 유효 종료 일시 - 개별 설정이 만료되는 시간 (NULL이면 무기한)';
COMMENT ON COLUMN cnfg.tenant_features.approved_by 		IS '승인자 UUID - 오버라이드를 승인한 관리자';
COMMENT ON COLUMN cnfg.tenant_features.approved_at 		IS '승인 일시 - 오버라이드가 승인된 시간';
COMMENT ON COLUMN cnfg.tenant_features.approval_reason 	IS '승인 사유 메모 - 승인자가 남긴 승인 이유';
COMMENT ON COLUMN cnfg.tenant_features.deleted 			IS '논리적 삭제 플래그 - 실제 삭제 대신 사용하는 소프트 딜리트';

-- 인덱스 생성
-- 테넌트별 기능 조회용 인덱스 (가장 빈번한 조회 패턴)
CREATE INDEX IF NOT EXISTS ix_tenant_features__tenant_lookup
	ON cnfg.tenant_features (tenant_id, enabled)
 WHERE deleted = FALSE;  -- 논리적 삭제되지 않은 활성 오버라이드만 대상

-- 기능별 테넌트 조회용 인덱스 (특정 기능을 사용하는 테넌트 조회)
CREATE INDEX IF NOT EXISTS ix_tenant_features__feature_lookup
	ON cnfg.tenant_features (feature_flag_id, enabled)
 WHERE deleted = FALSE;  -- 논리적 삭제되지 않은 활성 오버라이드만 대상

-- 유효 기간 관리용 인덱스 (만료된 오버라이드 정리 작업용)
CREATE INDEX IF NOT EXISTS ix_tenant_features__validity_management
	ON cnfg.tenant_features (close_time, start_time)
 WHERE deleted = FALSE
   AND close_time IS NOT NULL;  -- 종료 시간이 설정된 활성 오버라이드만 대상

-- 승인 관리용 인덱스 (승인 대기 중인 오버라이드 조회)
CREATE INDEX IF NOT EXISTS ix_tenant_features__approval_pending
	ON cnfg.tenant_features (approved_at, created_at DESC)
 WHERE deleted = FALSE;  -- 논리적 삭제되지 않은 레코드만 대상

-- 승인자별 관리용 인덱스 (승인자가 처리한 오버라이드 이력 조회)
CREATE INDEX IF NOT EXISTS ix_tenant_features__approver_history
	ON cnfg.tenant_features (approved_by, approved_at DESC)
 WHERE deleted = FALSE
   AND approved_by IS NOT NULL;  -- 승인 완료된 레코드만 대상

-- 생성일자 기준 조회용 인덱스 (최근 생성된 오버라이드들)
CREATE INDEX IF NOT EXISTS ix_tenant_features__created_at
	ON cnfg.tenant_features (created_at DESC)
 WHERE deleted = FALSE;  -- 논리적 삭제되지 않은 레코드만 대상
