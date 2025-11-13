#!/bin/bash
set -e

echo "🚀 CXG Platform 개발 환경 시작"
echo "======================================"

# Docker 서비스 시작
echo "📦 Docker 서비스 시작 중..."
docker compose -f docker-compose.dev.yml up -d

# 서비스 준비 대기
echo "⏳ 서비스 준비 중..."
sleep 5

# 헬스체크
echo "🏥 헬스체크..."
docker exec cxg-postgres pg_isready -U cxgadmin && echo "✅ PostgreSQL 준비 완료"
docker exec cxg-redis redis-cli ping && echo "✅ Redis 준비 완료"

echo ""
echo "======================================"
echo "✅ 개발 환경 준비 완료!"
echo ""
echo "서비스 URL:"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"
echo "  Adminer: http://localhost:8080"
echo ""
echo "다음 단계:"
echo "  1. 백엔드: cd apps/backend-api && source .venv/bin/activate && uvicorn api.main:app --reload"
echo "  2. 관리자 웹: cd apps/manager-web && pnpm dev"
echo "  3. 사용자 웹: cd apps/tenants-web && pnpm dev"
echo ""
echo "중지: docker compose -f docker-compose.dev.yml down"
echo "======================================"
