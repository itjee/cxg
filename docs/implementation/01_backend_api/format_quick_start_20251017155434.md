# 🚀 자동 포매팅 빠른 시작

## ⚡ 5분 설정

### 1️⃣ VSCode 확장 프로그램 설치

**필수**: Ruff 확장 프로그램
```
Extensions 패널 (Ctrl+Shift+X)
→ "Ruff" 검색
→ "Ruff" (by Astral Software) 설치
```

### 2️⃣ Python 가상 환경 설치

```bash
cd apps/backend-api
uv venv
source .venv/bin/activate  # Mac/Linux
uv pip install -e ".[dev]"
```

### 3️⃣ VSCode 재시작

완료! 이제 파일 저장 시 자동으로 포매팅됩니다.

---

## 💡 사용법

### 자동 (저장 시)
```
Ctrl+S (Cmd+S) → 자동 정렬 + 포매팅 + 린트
```

### 수동 실행
```bash
make format  # 전체 프로젝트 포매팅
```

---

## 🔍 동작 확인

1. Python 파일 열기
2. Import 순서를 뒤섞기
3. 저장 (Ctrl+S)
4. ✨ 자동으로 정렬됨!

---

## 📋 포함 기능

✅ Import 자동 정렬 (isort)  
✅ 코드 포매팅 (Black 스타일)  
✅ 린트 자동 수정  
✅ 미사용 import 제거  

---

## 🆘 문제 해결

**포매팅이 안되나요?**
1. Ruff 확장 프로그램 설치 확인
2. VSCode 재시작
3. Python 인터프리터 선택: `.venv/bin/python`

**상세 가이드**: `docs/AUTO_FORMAT_SETUP.md`

---

## 🎯 주요 명령어

```bash
make format      # 포매팅 + 자동 수정
make lint        # 린트 체크만
make check       # 전체 품질 검사
```

---

**설정 완료!** 이제 저장만 하면 됩니다! 🎉
