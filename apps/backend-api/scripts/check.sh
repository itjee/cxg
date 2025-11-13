#!/bin/bash
# 전체 코드 품질 검사 (CI/CD용)

set -e

echo "==================================="
echo "🚀 코드 품질 검사 시작"
echo "==================================="

echo ""
echo "📋 1. Ruff 린팅..."
ruff check .

echo ""
echo "📋 2. Ruff 포맷 체크..."
ruff format --check .

echo ""
echo "📋 3. mypy 타입 체크..."
mypy src/

echo ""
echo "==================================="
echo "✅ 모든 검사 통과!"
echo "==================================="
