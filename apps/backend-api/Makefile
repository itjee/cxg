.PHONY: help install dev test lint format typecheck check clean run migrate

# 기본 타겟
help:
	@echo "CXG Backend API - 사용 가능한 명령어:"
	@echo ""
	@echo "  make install     - 프로덕션 의존성 설치"
	@echo "  make dev         - 개발 의존성 설치"
	@echo "  make run         - 개발 서버 실행"
	@echo ""
	@echo "  make lint        - Ruff 린팅 실행"
	@echo "  make format      - Ruff 포매팅 및 자동 수정"
	@echo "  make typecheck   - mypy 타입 체크"
	@echo "  make check       - 전체 코드 품질 검사 (CI/CD)"
	@echo ""
	@echo "  make test        - pytest 테스트 실행"
	@echo "  make migrate     - 데이터베이스 마이그레이션"
	@echo "  make clean       - 캐시 및 임시 파일 삭제"

# 의존성 설치
install:
	pip install -e .

dev:
	pip install -e ".[dev]"

# 서버 실행
run:
	uvicorn src.main:app --reload --host 0.0.0.0 --port 8100

# 코드 품질
lint:
	@echo "🔍 Ruff 린팅..."
	ruff check .

format:
	@echo "✨ Ruff 포매팅..."
	ruff format .
	@echo "🔧 Ruff 자동 수정..."
	ruff check --fix .

typecheck:
	@echo "🔎 mypy 타입 체크..."
	mypy src/

check:
	@echo "==================================="
	@echo "🚀 전체 코드 품질 검사"
	@echo "==================================="
	@echo ""
	@echo "📋 1. Ruff 린팅..."
	ruff check .
	@echo ""
	@echo "📋 2. Ruff 포맷 체크..."
	ruff format --check .
	@echo ""
	@echo "📋 3. mypy 타입 체크..."
	mypy src/
	@echo ""
	@echo "==================================="
	@echo "✅ 모든 검사 통과!"
	@echo "==================================="

# 테스트
test:
	pytest

test-cov:
	pytest --cov=src --cov-report=html --cov-report=term

# 데이터베이스
migrate:
	alembic upgrade head

migrate-create:
	@read -p "마이그레이션 메시지: " msg; \
	alembic revision --autogenerate -m "$$msg"

migrate-down:
	alembic downgrade -1

# 정리
clean:
	@echo "🧹 캐시 파일 정리..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf build/ dist/ htmlcov/ .coverage
	@echo "✅ 정리 완료"

# 전체 초기화
reset: clean
	rm -rf .venv/
	@echo "✅ 전체 초기화 완료"
