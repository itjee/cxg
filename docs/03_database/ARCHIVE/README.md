# 데이터베이스 설계 (Database)

ConexGrow의 데이터베이스 스키마, DDL 개선사항, 마이그레이션 가이드입니다.

## 📚 주요 문서

### DDL 및 스키마

#### 1. **DDL_INDEX.md**
전체 DDL 파일의 인덱스 및 검색 가이드

#### 2. **DDL_SUMMARY.md**
DDL 개선사항의 요약 및 주요 변경사항

#### 3. **DDL_FINAL_REPORT.md**
DDL 최종 보고서 (상세 분석)

#### 4. **DDL_애플리케이션코드_마이그레이션_20251027.md**
DDL 변경에 따른 애플리케이션 코드 마이그레이션 가이드

### 컬럼명 표준화

#### 5. **컬럼명표준화_추가변경_20251027.md**
컬럼명 표준화 추가 변경사항 (table_column → column)

#### 6. **COLUMN_REFERENCES_AUDIT.md**
컬럼 참조 감시 및 검증 보고서

### 마이그레이션

#### 7. **MIGRATION_EXECUTION_GUIDE.md**
데이터베이스 마이그레이션 실행 가이드

## 🗂️ 폴더 구조

```
docs/03_database/
├── README.md (이 파일)
├── DDL_*.md (DDL 관련 문서)
├── *표준화*.md (표준화 관련 문서)
├── database/ (기존 문서들)
└── implementation/ (구현 관련 문서들)
```

## 🔑 주요 개선사항

### 1. 컬럼명 표준화
```
변경 전: table_column, plan_code, plan_name
변경 후: column, code, name
```

### 2. 역할 계층 명확화
```
변경 전: type (모호함)
변경 후: category + level (명확함)
  - category: MANAGER_ADMIN, PLATFORM_SUPPORT, TENANT_ADMIN, TENANT_USER
  - level: 1-200 (낮을수록 높은 권한)
```

### 3. 권한 충돌 해결 메커니즘
새로운 `sys.permission_conflict_resolution` 테이블 추가
- DENY_OVERRIDE: AND 연산
- ALLOW_UNION: OR 연산
- PRIORITY_BASED: 우선순위 기반
- MOST_RESTRICTIVE: 최소 권한

## 📊 데이터베이스 구조

### Manager Database (mgmt_db)
- **idam**: 인증 및 권한 관리
- **tnnt**: 테넌트 관리
- **bill**: 청구 관리
- **mntr**: 모니터링
- **ifra**: 인프라 관리
- **audt**: 감사 로그

### Tenant Database (tnnt_db) - 테넌트별 격리
- **sys**: 사용자, 역할, 권한 관리
- **adm**: 기본 정보 관리
- **hrm**: 인사 관리
- **crm**: 고객 관리
- **fim**: 재무 관리
- **wms**: 창고 관리
- 등등...

## 🚀 마이그레이션 프로세스

1. **개발 환경에서 테스트**
   - DDL 마이그레이션 적용
   - 데이터 마이그레이션 검증
   - 애플리케이션 코드 테스트

2. **스테이징 환경 배포**
   - 전체 마이그레이션 시뮬레이션
   - 성능 검증

3. **프로덕션 배포**
   - 백업 완료
   - 무중단 배포
   - 롤백 계획 준비

## 📖 관련 문서

- [아키텍처](../02_architecture/)
- [API 설계](../04_api/)
- [구현 세부사항](../implementation/03_database_schema/)

## 🔍 참고 자료

- [기존 데이터베이스 문서](./database/)
- [스키마 세부사항](./database/schemas/)
- [마이그레이션 가이드](./database/migrations/)
