CREATE TABLE IF NOT EXISTS mntr.incidents
(
    -- 기본 식별자 및 감사 필드
    id                          UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),		-- 인시던트 고유 식별자 (UUID)
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,                   	-- 인시던트 등록 일시
    created_by                  UUID,                                                              	-- 인시던트 등록자 UUID (시스템 또는 관리자)
    updated_at                  TIMESTAMP WITH TIME ZONE,                                          	-- 인시던트 수정 일시
    updated_by                  UUID,                                                              	-- 인시던트 수정자 UUID

	-- 인시던트 기본 정보
    incident_no                 VARCHAR(50)              NOT NULL,                          		-- 인시던트 번호 (INC-2024-001 형식)
    title                       VARCHAR(200)             NOT NULL,                                 	-- 인시던트 제목
    description                 TEXT,                                                              	-- 인시던트 상세 설명
    severity                    VARCHAR(20)              NOT NULL DEFAULT 'MEDIUM',               	-- 심각도 (CRITICAL/HIGH/MEDIUM/LOW)

	-- 영향 범위 정보
    affected_services           TEXT[],                                                            	-- 영향받은 서비스 목록 (배열)
    affected_tenants            UUID[],                                                            	-- 영향받은 테넌트 ID 목록 (배열)
    impact_scope                VARCHAR(20)              NOT NULL DEFAULT 'PARTIAL',              	-- 영향 범위 (GLOBAL/PARTIAL/SINGLE_TENANT)

	-- 인시던트 시간 정보
    incident_start_time         TIMESTAMP WITH TIME ZONE NOT NULL,                                 	-- 인시던트 시작 시간 (장애 발생 시점)
    incident_end_time           TIMESTAMP WITH TIME ZONE,                                          	-- 인시던트 종료 시간 (서비스 복구 시점)
    detection_time              TIMESTAMP WITH TIME ZONE,                                          	-- 장애 감지 시간 (모니터링 시스템 감지 시점)
    resolution_time             TIMESTAMP WITH TIME ZONE,                                          	-- 해결 완료 시간 (근본 해결 시점)

	-- 담당자 및 에스컬레이션 정보
    assigned_to                 VARCHAR(100),                                                      	-- 담당 엔지니어 또는 팀명
    escalation_level            INTEGER                  DEFAULT 1,                               	-- 에스컬레이션 단계 (1차, 2차, 3차 등)
    resolution_summary          TEXT,                                                              	-- 해결 요약 (임시 조치 및 최종 해결 방법)

	-- 사후 분석 정보
    root_cause                  TEXT,                                                              	-- 근본 원인 분석 (RCA)
    preventive_actions          TEXT,                                                              	-- 재발 방지 조치 계획
    lessons_learned             TEXT,                                                              	-- 교훈 및 개선 사항

	-- 상태 관리
    status                      VARCHAR(20)              NOT NULL DEFAULT 'OPEN',                 	-- 인시던트 상태 (OPEN/IN_PROGRESS/RESOLVED/CLOSED)
    deleted                  	BOOLEAN                  NOT NULL DEFAULT FALSE,                 	-- 논리적 삭제 플래그

	-- 제약조건
	CONSTRAINT uk_incidents__incident_no		UNIQUE (incident_no),

    CONSTRAINT ck_incidents__severity 			CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT ck_incidents__impact_scope 		CHECK (impact_scope IN ('GLOBAL', 'PARTIAL', 'SINGLE_TENANT')),
    CONSTRAINT ck_incidents__status 			CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    CONSTRAINT ck_incidents__escalation_level 	CHECK (escalation_level >= 1 AND escalation_level <= 5),
    CONSTRAINT ck_incidents__time_sequence 		CHECK (incident_end_time IS NULL OR incident_end_time >= incident_start_time),
    CONSTRAINT ck_incidents__detection_valid 	CHECK (detection_time IS NULL OR detection_time >= incident_start_time),
    CONSTRAINT ck_incidents__resolution_valid 	CHECK (resolution_time IS NULL OR resolution_time >= incident_start_time)
);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE  mntr.incidents						IS '장애 및 인시던트 관리 - 시스템 장애 발생부터 해결까지 전 과정 추적과 사후 분석을 통한 서비스 안정성 관리';
COMMENT ON COLUMN mntr.incidents.id 					IS '인시던트 고유 식별자 - UUID 형태의 기본키, 각 인시던트를 구분하는 고유값';
COMMENT ON COLUMN mntr.incidents.created_at 			IS '인시던트 등록 일시 - 인시던트가 시스템에 등록된 시점의 타임스탬프';
COMMENT ON COLUMN mntr.incidents.created_by 			IS '인시던트 등록자 UUID - 인시던트를 등록한 시스템, 모니터링 도구, 또는 관리자의 식별자';
COMMENT ON COLUMN mntr.incidents.updated_at 			IS '인시던트 수정 일시 - 인시던트 정보가 최종 변경된 시점의 타임스탬프';
COMMENT ON COLUMN mntr.incidents.updated_by 			IS '인시던트 수정자 UUID - 인시던트 정보를 최종 수정한 담당자 또는 시스템의 식별자';
COMMENT ON COLUMN mntr.incidents.incident_no 			IS '인시던트 번호 - 시스템에서 발급하는 고유한 인시던트 식별번호 (예: INC-2024-001, INCIDENT-20241201-001)';
COMMENT ON COLUMN mntr.incidents.title 					IS '인시던트 제목 - 장애 상황을 간략히 설명하는 제목 (예: API 서버 응답 지연, 데이터베이스 연결 장애)';
COMMENT ON COLUMN mntr.incidents.description 			IS '인시던트 상세 설명 - 장애 현상, 발생 경위, 영향 범위 등의 상세한 설명';
COMMENT ON COLUMN mntr.incidents.severity 				IS '심각도 - CRITICAL(서비스 완전 중단), HIGH(주요 기능 장애), MEDIUM(부분 기능 장애), LOW(경미한 문제) 중요도 구분';
COMMENT ON COLUMN mntr.incidents.affected_services 		IS '영향받은 서비스 목록 - 장애로 인해 영향을 받은 서비스들의 배열 (예: [API, DATABASE, REDIS])';
COMMENT ON COLUMN mntr.incidents.affected_tenants 		IS '영향받은 테넌트 ID 목록 - 장애 영향을 받은 특정 테넌트들의 UUID 배열 (전체 장애시 NULL)';
COMMENT ON COLUMN mntr.incidents.impact_scope 			IS '영향 범위 - GLOBAL(전체 서비스), PARTIAL(일부 서비스/지역), SINGLE_TENANT(특정 테넌트만) 장애 파급 범위';
COMMENT ON COLUMN mntr.incidents.incident_start_time 	IS '인시던트 시작 시간 - 실제 장애가 발생하기 시작한 시점 (고객 영향 시작 시점)';
COMMENT ON COLUMN mntr.incidents.incident_end_time 		IS '인시던트 종료 시간 - 서비스가 완전히 복구된 시점 (고객 영향 종료 시점, 진행중인 경우 NULL)';
COMMENT ON COLUMN mntr.incidents.detection_time 		IS '장애 감지 시간 - 모니터링 시스템이나 담당자가 장애를 최초 감지한 시점';
COMMENT ON COLUMN mntr.incidents.resolution_time 		IS '해결 완료 시간 - 근본 원인이 해결되고 모든 후속 조치가 완료된 시점';
COMMENT ON COLUMN mntr.incidents.assigned_to 			IS '담당 엔지니어 또는 팀명 - 인시던트 해결을 담당하는 엔지니어, 팀, 또는 벤더명';
COMMENT ON COLUMN mntr.incidents.escalation_level 		IS '에스컬레이션 단계 - 1차(일반), 2차(시니어), 3차(매니저), 4차(경영진), 5차(외부지원) 단계별 대응 레벨';
COMMENT ON COLUMN mntr.incidents.resolution_summary 	IS '해결 요약 - 임시 조치, 근본 해결 방법, 적용된 패치나 설정 변경 사항 등의 요약';
COMMENT ON COLUMN mntr.incidents.root_cause 			IS '근본 원인 분석 - 장애가 발생한 근본적인 원인에 대한 상세 분석 결과 (RCA: Root Cause Analysis)';
COMMENT ON COLUMN mntr.incidents.preventive_actions 	IS '재발 방지 조치 계획 - 동일한 장애의 재발을 방지하기 위한 구체적인 개선 조치 계획';
COMMENT ON COLUMN mntr.incidents.lessons_learned 		IS '교훈 및 개선 사항 - 인시던트를 통해 얻은 교훈과 프로세스, 시스템 개선 방안';
COMMENT ON COLUMN mntr.incidents.status 				IS '인시던트 상태 - OPEN(접수), IN_PROGRESS(진행중), RESOLVED(해결완료), CLOSED(종료) 처리 단계 구분';
COMMENT ON COLUMN mntr.incidents.deleted 				IS '논리적 삭제 플래그 - TRUE(삭제됨), FALSE(활성상태), 물리적 삭제 대신 사용';

-- 인덱스 생성
-- 인시던트 번호 고유성 보장
CREATE UNIQUE INDEX IF NOT EXISTS ux_incidents__incident_no
    ON mntr.incidents (incident_no)
 WHERE deleted = FALSE;

-- 심각도별 인시던트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__severity
    ON mntr.incidents (severity, created_at DESC)
 WHERE deleted = FALSE;

-- 상태별 인시던트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__status
    ON mntr.incidents (status, created_at DESC)
 WHERE deleted = FALSE;

-- 장애 발생 시간 기준 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__incident_start_time
    ON mntr.incidents (incident_start_time DESC);

-- 진행중인 인시던트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__open_incidents
    ON mntr.incidents (status, severity, created_at DESC)
 WHERE status IN ('OPEN', 'IN_PROGRESS')
   AND deleted = FALSE;

-- 크리티컬 인시던트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__critical_incidents
    ON mntr.incidents (severity, incident_start_time DESC)
 WHERE severity = 'CRITICAL'
   AND deleted = FALSE;

-- 영향 범위별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__impact_scope
    ON mntr.incidents (impact_scope, created_at DESC)
 WHERE deleted = FALSE;

-- 담당자별 인시던트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__assigned_to
    ON mntr.incidents (assigned_to, status, created_at DESC)
 WHERE assigned_to IS NOT NULL
   AND deleted = FALSE;

-- 에스컬레이션 단계별 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__escalation_level
    ON mntr.incidents (escalation_level, severity, created_at DESC)
 WHERE deleted = FALSE;

-- 해결된 인시던트 분석 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__resolution_analysis
    ON mntr.incidents (status, resolution_time DESC NULLS LAST)
 WHERE status IN ('RESOLVED', 'CLOSED')
   AND deleted = FALSE;

-- 영향받은 서비스 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_incidents__affected_services
    ON mntr.incidents USING GIN (affected_services)
 WHERE deleted = FALSE;

-- 영향받은 테넌트 검색을 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS ix_incidents__affected_tenants
    ON mntr.incidents USING GIN (affected_tenants)
 WHERE deleted = FALSE;

-- 시간 분석을 위한 복합 인덱스
CREATE INDEX IF NOT EXISTS ix_incidents__time_analysis
    ON mntr.incidents (incident_start_time, incident_end_time, detection_time, resolution_time)
 WHERE deleted = FALSE;

-- 최신 등록 인시던트 조회 최적화
CREATE INDEX IF NOT EXISTS ix_incidents__created_at
    ON mntr.incidents (created_at DESC);
