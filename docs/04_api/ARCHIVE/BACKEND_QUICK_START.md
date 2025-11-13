# Backend API 빠른 시작 가이드

## 🚀 빠른 시작

### 1. 개발 환경 설정

```bash
# 저장소 클론
cd apps/backend-api

# 가상환경 생성
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 개발 의존성 설치
make dev
# 또는: pip install -e ".[dev]"

# Pre-commit hooks 설치 (권장)
pip install pre-commit
pre-commit install
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 필수 환경 변수 설정
DATABASE_URL=postgresql://user:pass@localhost:5432/cxg_db
MGMT_DATABASE_URL=postgresql://user:pass@localhost:5432/mgmt_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
```

### 3. 데이터베이스 마이그레이션

```bash
# 마이그레이션 실행
make migrate
# 또는: alembic upgrade head
```

### 4. 개발 서버 실행

```bash
# 서버 시작
make run
# 또는: uvicorn src.main:app --reload

# API 문서 확인
# http://localhost:8000/docs
```

## 🔧 개발 워크플로우

### 코드 작성

```bash
# 1. 코드 작성
vim src/models/user.py

# 2. 자동 포매팅 + 수정
make format

# 3. 린팅 체크
make lint

# 4. 타입 체크 (선택)
make typecheck
```

### Git Commit

```bash
# Pre-commit이 자동으로 실행됨
git add .
git commit -m "Add user model"

# CI/CD 전 전체 검사
make check
```

## 📋 주요 명령어

### Make 명령어 (권장)

| 명령어 | 설명 |
|--------|------|
| `make help` | 사용 가능한 명령어 목록 |
| `make dev` | 개발 의존성 설치 |
| `make run` | 개발 서버 실행 |
| `make format` | 코드 포매팅 + 자동 수정 |
| `make lint` | 린팅 체크 |
| `make typecheck` | 타입 체크 |
| `make check` | 전체 코드 품질 검사 |
| `make test` | 테스트 실행 |
| `make migrate` | DB 마이그레이션 |
| `make clean` | 캐시 파일 정리 |

### Ruff 명령어

```bash
# 린팅
ruff check .

# 자동 수정
ruff check --fix .

# 포매팅
ruff format .

# 특정 파일만
ruff check src/models/user.py
```

### mypy 명령어

```bash
# 타입 체크
mypy src/

# 특정 파일만
mypy src/models/user.py
```

## 🧪 테스트

```bash
# 모든 테스트 실행
make test
# 또는: pytest

# 커버리지 포함
pytest --cov=src

# 특정 테스트만
pytest tests/unit/test_user.py
```

## 📁 프로젝트 구조

```
apps/backend-api/
├── src/                    # 소스 코드
│   ├── main.py            # FastAPI 앱
│   ├── core/              # 인프라
│   ├── models/            # ORM 모델
│   ├── modules/           # 비즈니스 로직
│   └── routers/           # API 라우터
├── tests/                 # 테스트
├── alembic/               # 마이그레이션
├── scripts/               # 유틸리티 스크립트
├── .vscode/               # VS Code 설정
├── .github/               # GitHub Actions
├── pyproject.toml         # 프로젝트 설정
├── Makefile               # Make 명령어
└── README.md
```

## 🔍 문제 해결

### 린팅 오류

```bash
# 자동 수정 시도
make format

# 수동 확인
ruff check . --diff
```

### 타입 오류

```python
# 특정 줄 무시
result = function()  # type: ignore
```

### Import 오류

```bash
# Import 정렬
ruff check --select I --fix .
```

## 📚 추가 문서

- `LINTING_SETUP.md` - 코드 품질 도구 상세 가이드
- `FINAL_STRUCTURE.md` - 프로젝트 구조 설명
- `MODELS_COMPLETE.md` - ORM 모델 문서
- `docs/06-BACKEND-GUIDE.md` - 백엔드 개발 가이드

## 🎯 VS Code 설정

### 권장 익스텐션

1. **Ruff** (`charliermarsh.ruff`) - 필수
2. **Python** (`ms-python.python`) - 필수
3. **Mypy** (`ms-python.mypy-type-checker`) - 권장

### 자동 설정

`.vscode/settings.json`에 이미 설정되어 있음:
- 저장 시 자동 포매팅
- 저장 시 자동 import 정렬
- 실시간 린팅

## ⚡ 성능 팁

### Ruff는 매우 빠름

```bash
# 전체 프로젝트 (~0.1초)
ruff check .

# 전체 포매팅 (~0.1초)
ruff format .
```

### CI/CD 최적화

```yaml
# .github/workflows/ci.yml
- run: ruff check .      # ~1초
- run: ruff format --check .  # ~1초
- run: mypy src/        # ~5초
```

## 🎉 완료!

이제 개발을 시작할 준비가 되었습니다!

```bash
# 개발 서버 실행
make run

# 브라우저에서 확인
# http://localhost:8000/docs
```
