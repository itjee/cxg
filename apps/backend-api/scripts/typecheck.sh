#!/bin/bash
# 타입 체크 스크립트

set -e

echo "🔎 mypy 타입 체크 실행..."
mypy src/

echo ""
echo "✅ 타입 체크 완료!"
