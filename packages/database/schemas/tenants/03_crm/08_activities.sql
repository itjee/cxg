-- =====================================================================================
-- 테이블: crm.activities
-- 설명: 영업 활동 관리 테이블 (고객 접촉 이력)
-- 작성일: 2025-10-24
-- 수정일: 2025-10-24 - 초기 생성
-- =====================================================================================

CREATE TABLE IF NOT EXISTS crm.activities 
(
    -- 기본 식별자 및 감사 필드
    id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 활동 고유 식별자
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시
    created_by              UUID,                                                            -- 등록자 UUID
    updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시
    updated_by              UUID,                                                            -- 수정자 UUID
    
    -- 활동 기본 정보
    activity_type           VARCHAR(20)              NOT NULL,                               -- 활동 유형
    subject                 VARCHAR(200)             NOT NULL,                               -- 제목
    description             TEXT,                                                            -- 내용
    
    -- 관련 대상 (Polymorphic Relation)
    related_to_type         VARCHAR(20),                                                     -- 관련 대상 타입
    partner_id              UUID,                                                            -- 거래처 ID
    lead_id                 UUID,                                                            -- 리드 ID
    opportunity_id          UUID,                                                            -- 영업 기회 ID
    contact_id              UUID,                                                            -- 담당자 ID
    
    -- 활동 일정
    activity_date           DATE                     NOT NULL,                               -- 활동 일자
    start_time              TIME,                                                            -- 시작 시간
    end_time                TIME,                                                            -- 종료 시간
    duration_minutes        INTEGER,                                                         -- 소요 시간 (분)
    
    -- 장소 정보
    location                VARCHAR(200),                                                    -- 장소
    is_online               BOOLEAN                  DEFAULT false,                          -- 온라인 여부
    meeting_url             VARCHAR(500),                                                    -- 회의 URL (화상회의)
    
    -- 담당자 정보
    owner_id                UUID                     NOT NULL,                               -- 담당자 (활동 수행자)
    participants            TEXT,                                                            -- 참석자 (JSON 배열)
    
    -- 활동 상태
    status                  VARCHAR(20)              DEFAULT 'PLANNED',                      -- 상태
    priority                VARCHAR(20)              DEFAULT 'NORMAL',                       -- 우선순위
    
    -- 완료 정보
    is_completed            BOOLEAN                  DEFAULT false,                          -- 완료 여부
    completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료 일시
    completed_by            UUID,                                                            -- 완료 처리자
    
    -- 결과 정보
    outcome                 VARCHAR(50),                                                     -- 결과
    outcome_notes           TEXT,                                                            -- 결과 메모
    
    -- 후속 활동
    is_follow_up_required   BOOLEAN                  DEFAULT false,                          -- 후속 활동 필요 여부
    follow_up_date          DATE,                                                            -- 후속 활동 예정일
    follow_up_activity_id   UUID,                                                            -- 후속 활동 ID

    -- 알림 설정
    is_reminder_enabled     BOOLEAN                  DEFAULT false,                          -- 알림 사용 여부
    reminder_minutes        INTEGER,                                                         -- 알림 시간 (분 전)
    
    -- 논리 삭제
    is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그
    
    -- 비고
    notes                   TEXT,                                                            -- 비고
    
    -- 활동 유형 체크 (CALL: 전화, EMAIL: 이메일, MEETING: 미팅, DEMO: 데모, VISIT: 방문, TASK: 업무)
    CONSTRAINT ck_activities__activity_type         CHECK (activity_type IN ('CALL', 'EMAIL', 'MEETING', 'DEMO', 'VISIT', 'TASK', 'FOLLOW_UP', 'OTHER')),
    
    -- 관련 대상 타입 체크
    CONSTRAINT ck_activities__related_to_type       CHECK (related_to_type IS NULL OR related_to_type IN ('PARTNER', 'LEAD', 'OPPORTUNITY', 'CONTACT')),
    
    -- 상태 체크 (PLANNED: 예정, IN_PROGRESS: 진행중, COMPLETED: 완료, CANCELLED: 취소)
    CONSTRAINT ck_activities__status                CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    
    -- 우선순위 체크 (URGENT: 긴급, HIGH: 높음, NORMAL: 보통, LOW: 낮음)
    CONSTRAINT ck_activities__priority              CHECK (priority IN ('URGENT', 'HIGH', 'NORMAL', 'LOW')),
    
    -- 소요 시간 양수 체크
    CONSTRAINT ck_activities__duration_minutes      CHECK (duration_minutes IS NULL OR duration_minutes > 0),
    
    -- 알림 시간 양수 체크
    CONSTRAINT ck_activities__reminder_minutes      CHECK (reminder_minutes IS NULL OR reminder_minutes > 0)
);

-- 테이블 및 컬럼 주석
COMMENT ON TABLE  crm.activities                         IS '영업 활동 관리 테이블 (고객 접촉 이력)';
COMMENT ON COLUMN crm.activities.id                      IS '활동 고유 식별자 (UUID)';
COMMENT ON COLUMN crm.activities.created_at              IS '등록 일시';
COMMENT ON COLUMN crm.activities.created_by              IS '등록자 UUID';
COMMENT ON COLUMN crm.activities.updated_at              IS '수정 일시';
COMMENT ON COLUMN crm.activities.updated_by              IS '수정자 UUID';
COMMENT ON COLUMN crm.activities.activity_type           IS '활동 유형 (CALL/EMAIL/MEETING/DEMO/VISIT/TASK/FOLLOW_UP/OTHER)';
COMMENT ON COLUMN crm.activities.subject                 IS '제목';
COMMENT ON COLUMN crm.activities.description             IS '내용';
COMMENT ON COLUMN crm.activities.related_to_type         IS '관련 대상 타입 (PARTNER/LEAD/OPPORTUNITY/CONTACT)';
COMMENT ON COLUMN crm.activities.partner_id              IS '거래처 ID';
COMMENT ON COLUMN crm.activities.lead_id                 IS '리드 ID';
COMMENT ON COLUMN crm.activities.opportunity_id          IS '영업 기회 ID';
COMMENT ON COLUMN crm.activities.contact_id              IS '담당자 ID (partner_contacts)';
COMMENT ON COLUMN crm.activities.activity_date           IS '활동 일자';
COMMENT ON COLUMN crm.activities.start_time              IS '시작 시간';
COMMENT ON COLUMN crm.activities.end_time                IS '종료 시간';
COMMENT ON COLUMN crm.activities.duration_minutes        IS '소요 시간 (분)';
COMMENT ON COLUMN crm.activities.location                IS '장소';
COMMENT ON COLUMN crm.activities.is_online               IS '온라인 여부 (화상회의 등)';
COMMENT ON COLUMN crm.activities.meeting_url             IS '회의 URL (Zoom, Teams 등)';
COMMENT ON COLUMN crm.activities.owner_id                IS '담당자 UUID (활동 수행자)';
COMMENT ON COLUMN crm.activities.participants            IS '참석자 목록 (JSON 배열)';
COMMENT ON COLUMN crm.activities.status                  IS '상태 (PLANNED/IN_PROGRESS/COMPLETED/CANCELLED)';
COMMENT ON COLUMN crm.activities.priority                IS '우선순위 (URGENT/HIGH/NORMAL/LOW)';
COMMENT ON COLUMN crm.activities.is_completed            IS '완료 여부';
COMMENT ON COLUMN crm.activities.completed_at            IS '완료 일시';
COMMENT ON COLUMN crm.activities.completed_by            IS '완료 처리자 UUID';
COMMENT ON COLUMN crm.activities.outcome                 IS '결과 (SUCCESSFUL/UNSUCCESSFUL/NO_ANSWER/RESCHEDULED 등)';
COMMENT ON COLUMN crm.activities.outcome_notes           IS '결과 메모';
COMMENT ON COLUMN crm.activities.is_follow_up_required   IS '후속 활동 필요 여부';
COMMENT ON COLUMN crm.activities.follow_up_date          IS '후속 활동 예정일';
COMMENT ON COLUMN crm.activities.follow_up_activity_id   IS '생성된 후속 활동 ID';
COMMENT ON COLUMN crm.activities.is_reminder_enabled     IS '알림 사용 여부';
COMMENT ON COLUMN crm.activities.reminder_minutes        IS '알림 시간 (활동 시작 n분 전)';
COMMENT ON COLUMN crm.activities.is_deleted              IS '논리 삭제 플래그';
COMMENT ON COLUMN crm.activities.notes                   IS '비고';

-- 일반 인덱스
CREATE INDEX ix_activities__activity_type 
    ON crm.activities (activity_type)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_activities__activity_type IS '활동 유형별 조회 인덱스';

CREATE INDEX ix_activities__partner_id 
    ON crm.activities (partner_id)
 WHERE partner_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_activities__partner_id IS '거래처별 조회 인덱스';

CREATE INDEX ix_activities__lead_id 
    ON crm.activities (lead_id)
 WHERE lead_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_activities__lead_id IS '리드별 조회 인덱스';

CREATE INDEX ix_activities__opportunity_id 
    ON crm.activities (opportunity_id)
 WHERE opportunity_id IS NOT NULL
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_activities__opportunity_id IS '영업 기회별 조회 인덱스';

CREATE INDEX ix_activities__owner_id 
    ON crm.activities (owner_id)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_activities__owner_id IS '담당자별 조회 인덱스';

CREATE INDEX ix_activities__activity_date 
    ON crm.activities (activity_date DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_activities__activity_date IS '활동 일자별 조회 인덱스';

CREATE INDEX ix_activities__status 
    ON crm.activities (status)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_activities__status IS '상태별 조회 인덱스';

CREATE INDEX ix_activities__priority 
    ON crm.activities (priority)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_activities__priority IS '우선순위별 조회 인덱스';

CREATE INDEX ix_activities__is_completed 
    ON crm.activities (is_completed, activity_date)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_activities__is_completed IS '완료 여부별 조회 인덱스';

CREATE INDEX ix_activities__is_follow_up_required 
    ON crm.activities (is_follow_up_required, follow_up_date)
 WHERE is_follow_up_required = true
   AND is_deleted = false;
COMMENT ON INDEX crm.ix_activities__is_follow_up_required IS '후속 활동 필요 조회 인덱스';

CREATE INDEX ix_activities__created_at 
    ON crm.activities (created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX crm.ix_activities__created_at IS '등록일시별 조회 인덱스';

-- 외래키 제약조건
-- 거래처 참조 (SET NULL 삭제)
ALTER TABLE crm.activities 
  ADD CONSTRAINT fk_activities__partner_id
    FOREIGN KEY (partner_id) 
    REFERENCES crm.partners(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_activities__partner_id ON crm.activities IS '거래처 참조 외래키 (SET NULL 삭제)';

-- 리드 참조 (SET NULL 삭제)
ALTER TABLE crm.activities 
  ADD CONSTRAINT fk_activities__lead_id
    FOREIGN KEY (lead_id) 
    REFERENCES crm.leads(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_activities__lead_id ON crm.activities IS '리드 참조 외래키 (SET NULL 삭제)';

-- 영업 기회 참조 (SET NULL 삭제)
ALTER TABLE crm.activities 
  ADD CONSTRAINT fk_activities__opportunity_id
    FOREIGN KEY (opportunity_id) 
    REFERENCES crm.opportunities(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_activities__opportunity_id ON crm.activities IS '영업 기회 참조 외래키 (SET NULL 삭제)';

-- 담당자 참조 (SET NULL 삭제)
ALTER TABLE crm.activities 
  ADD CONSTRAINT fk_activities__contact_id
    FOREIGN KEY (contact_id) 
    REFERENCES crm.partner_contacts(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_activities__contact_id ON crm.activities IS '담당자 참조 외래키 (SET NULL 삭제)';

-- 활동 담당자 참조 (RESTRICT 삭제)
ALTER TABLE crm.activities 
  ADD CONSTRAINT fk_activities__owner_id
    FOREIGN KEY (owner_id) 
    REFERENCES hrm.employees(id) 
    ON DELETE RESTRICT;
COMMENT ON CONSTRAINT fk_activities__owner_id ON crm.activities IS '활동 담당자 참조 외래키 (RESTRICT 삭제)';

-- 완료 처리자 참조 (SET NULL 삭제)
ALTER TABLE crm.activities 
  ADD CONSTRAINT fk_activities__completed_by
    FOREIGN KEY (completed_by) 
    REFERENCES hrm.employees(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_activities__completed_by ON crm.activities IS '완료 처리자 참조 외래키 (SET NULL 삭제)';

-- 후속 활동 참조 (SET NULL 삭제)
ALTER TABLE crm.activities 
  ADD CONSTRAINT fk_activities__follow_up_activity_id
    FOREIGN KEY (follow_up_activity_id) 
    REFERENCES crm.activities(id) 
    ON DELETE SET NULL;
COMMENT ON CONSTRAINT fk_activities__follow_up_activity_id ON crm.activities IS '후속 활동 참조 외래키 (SET NULL 삭제)';

-- =====================================================================================
-- 완료: crm.activities 테이블 정의
-- =====================================================================================
