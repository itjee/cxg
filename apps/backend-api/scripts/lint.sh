#!/bin/bash
# 코드 품질 검사 스크립트

set -e

echo "🔍 Ruff 린팅 실행..."
ruff check .

echo ""
echo "✅ Ruff 린팅 완료!"
