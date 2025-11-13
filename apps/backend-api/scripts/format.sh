#!/bin/bash
# 코드 포매팅 스크립트

set -e

echo "✨ Ruff 포매팅 실행..."
ruff format .

echo ""
echo "🔧 Ruff 자동 수정 실행..."
ruff check --fix .

echo ""
echo "✅ 코드 포매팅 완료!"
