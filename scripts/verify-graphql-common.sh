#!/bin/bash

# GraphQL 공통 모듈 검증 스크립트

set -e

echo "🔍 GraphQL 공통 모듈 검증 시작..."
echo ""

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 스크립트 디렉토리 찾기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "📁 현재 디렉토리: $(pwd)"
echo ""

# 1. 공통 모듈 파일 존재 확인
echo "1️⃣  공통 모듈 파일 존재 확인..."
COMMON_DIR="apps/backend-api/src/graphql/common"

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (없음)"
        return 1
    fi
}

FILES=(
    "$COMMON_DIR/base_loader.py"
    "$COMMON_DIR/base_queries.py"
    "$COMMON_DIR/base_mutations.py"
    "$COMMON_DIR/base_permissions.py"
    "$COMMON_DIR/converters.py"
    "$COMMON_DIR/README.md"
    "$COMMON_DIR/MIGRATION_GUIDE.md"
    "$COMMON_DIR/USAGE_EXAMPLE.py"
)

ALL_EXIST=true
for file in "${FILES[@]}"; do
    if ! check_file "$file"; then
        ALL_EXIST=false
    fi
done

echo ""

# 2. Python 구문 검사
echo "2️⃣  Python 구문 검사..."

check_syntax() {
    if python3 -m py_compile "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 구문 정상"
        return 0
    else
        echo -e "${RED}✗${NC} $1 구문 오류"
        python3 -m py_compile "$1"
        return 1
    fi
}

SYNTAX_OK=true
for file in "${FILES[@]}"; do
    if [[ "$file" == *.py ]]; then
        if ! check_syntax "$file"; then
            SYNTAX_OK=false
        fi
    fi
done

echo ""

# 3. Import 테스트 (실제 환경에서만 가능)
echo "3️⃣  Import 테스트..."

if [ -f "apps/backend-api/.venv/bin/python" ]; then
    apps/backend-api/.venv/bin/python << EOF
import sys
sys.path.insert(0, 'apps/backend-api')

try:
    from src.graphql.common import (
        BaseDataLoader,
        BaseFieldLoader,
        get_by_id,
        get_list,
        get_count,
        create_entity,
        update_entity,
        delete_entity,
        BaseResourcePermission,
        CanView,
        CanCreate,
        CanUpdate,
        CanDelete,
        CanManage,
        IsAuthenticated,
        IsMaster,
        create_permission_class,
        model_to_graphql_converter,
        safe_uuid_to_id,
        safe_id_to_uuid,
    )
    print("\033[0;32m✓\033[0m 모든 모듈 import 성공")
    exit(0)
except ImportError as e:
    print("\033[0;31m✗\033[0m Import 실패:", str(e))
    exit(1)
EOF
    IMPORT_OK=$?
else
    echo -e "${YELLOW}⚠${NC} Python 가상환경 없음 - import 테스트 생략"
    IMPORT_OK=0
fi
echo ""

# 4. 코드 라인 수 분석
echo "4️⃣  코드 라인 수 분석..."

count_lines() {
    if [ -f "$1" ]; then
        wc -l < "$1" | tr -d ' '
    else
        echo "0"
    fi
}

TOTAL_LINES=0
for file in "${FILES[@]}"; do
    if [[ "$file" == *.py ]] && [[ "$file" != *"EXAMPLE"* ]]; then
        lines=$(count_lines "$file")
        TOTAL_LINES=$((TOTAL_LINES + lines))
        echo "  $(basename $file): $lines 줄"
    fi
done

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  총 공통 모듈 코드: ${GREEN}$TOTAL_LINES${NC} 줄"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 5. 기존 GraphQL 엔티티 분석
echo "5️⃣  기존 GraphQL 엔티티 분석..."

GRAPHQL_ROOT="apps/backend-api/src/graphql"
ENTITY_COUNT=0
TOTAL_OLD_LINES=0

# manager 엔티티
for schema_dir in "$GRAPHQL_ROOT"/manager/*/; do
    if [ -d "$schema_dir" ]; then
        for entity_dir in "$schema_dir"*/; do
            if [ -d "$entity_dir" ]; then
                ENTITY_COUNT=$((ENTITY_COUNT + 1))
                entity_name=$(basename "$entity_dir")
                
                # 각 파일 라인 수 계산
                loaders=$(count_lines "${entity_dir}loaders.py")
                queries=$(count_lines "${entity_dir}queries.py")
                mutations=$(count_lines "${entity_dir}mutations.py")
                permissions=$(count_lines "${entity_dir}permissions.py")
                
                entity_total=$((loaders + queries + mutations + permissions))
                TOTAL_OLD_LINES=$((TOTAL_OLD_LINES + entity_total))
                
                echo "  manager/$(basename $schema_dir)/$entity_name: $entity_total 줄"
            fi
        done
    fi
done

# tenants 엔티티
for schema_dir in "$GRAPHQL_ROOT"/tenants/*/; do
    if [ -d "$schema_dir" ]; then
        for entity_dir in "$schema_dir"*/; do
            if [ -d "$entity_dir" ]; then
                ENTITY_COUNT=$((ENTITY_COUNT + 1))
                entity_name=$(basename "$entity_dir")
                
                loaders=$(count_lines "${entity_dir}loaders.py")
                queries=$(count_lines "${entity_dir}queries.py")
                mutations=$(count_lines "${entity_dir}mutations.py")
                permissions=$(count_lines "${entity_dir}permissions.py")
                
                entity_total=$((loaders + queries + mutations + permissions))
                TOTAL_OLD_LINES=$((TOTAL_OLD_LINES + entity_total))
                
                echo "  tenants/$(basename $schema_dir)/$entity_name: $entity_total 줄"
            fi
        done
    fi
done

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  엔티티 개수: ${GREEN}$ENTITY_COUNT${NC}개"
echo -e "  기존 총 코드: ${RED}$TOTAL_OLD_LINES${NC} 줄"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 6. 예상 절감 효과 계산
echo "6️⃣  공통 모듈 적용 시 예상 효과..."

# 기존 평균: 엔티티당 약 300줄
# 공통 모듈 사용: 엔티티당 약 100줄
AVG_OLD=300
AVG_NEW=100

if [ $ENTITY_COUNT -gt 0 ]; then
    AVG_OLD=$((TOTAL_OLD_LINES / ENTITY_COUNT))
fi

EXPECTED_NEW=$((ENTITY_COUNT * AVG_NEW))
REDUCTION=$((TOTAL_OLD_LINES - EXPECTED_NEW))
REDUCTION_PERCENT=$((REDUCTION * 100 / TOTAL_OLD_LINES))

echo -e "  현재 평균: ${RED}$AVG_OLD${NC} 줄/엔티티"
echo -e "  적용 후 평균: ${GREEN}$AVG_NEW${NC} 줄/엔티티 (예상)"
echo ""
echo -e "  ${GREEN}예상 절감: $REDUCTION 줄 ($REDUCTION_PERCENT%)${NC}"
echo ""

# 7. 최종 결과
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 검증 결과 요약"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if $ALL_EXIST && $SYNTAX_OK && [ $IMPORT_OK -eq 0 ]; then
    echo -e "${GREEN}✓ 모든 검증 통과${NC}"
    echo ""
    echo "다음 단계:"
    echo "  1. 공통 모듈 문서 읽기: cat $COMMON_DIR/README.md"
    echo "  2. 마이그레이션 가이드 확인: cat $COMMON_DIR/MIGRATION_GUIDE.md"
    echo "  3. 예제 코드 참고: cat $COMMON_DIR/USAGE_EXAMPLE.py"
    echo "  4. 파일럿 마이그레이션 시작 (manager/idam/roles)"
    echo ""
    exit 0
else
    echo -e "${RED}✗ 일부 검증 실패${NC}"
    echo ""
    if ! $ALL_EXIST; then
        echo "  - 일부 파일이 누락되었습니다"
    fi
    if ! $SYNTAX_OK; then
        echo "  - Python 구문 오류가 있습니다"
    fi
    if [ $IMPORT_OK -ne 0 ]; then
        echo "  - Import 오류가 있습니다"
    fi
    echo ""
    exit 1
fi
