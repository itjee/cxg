"""GraphQL 메인 스키마 - DEPRECATED

이 파일은 더 이상 사용되지 않습니다.

시스템별 분리된 스키마를 사용하십시오:
- Manager 시스템: src/graphql/manager/root_schema.py (엔드포인트: /graphql/manager)
- Tenants 시스템: src/graphql/tenants/root_schema.py (엔드포인트: /graphql/tenants)

이 파일은 레거시 코드 참조 목적으로만 유지됩니다.
"""

# 통합 스키마는 더 이상 사용되지 않습니다.
# main.py에서 시스템별 스키마를 직접 import하여 사용합니다.
