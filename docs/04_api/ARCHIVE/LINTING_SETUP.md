# 코드 품질 도구 설정 (Ruff + mypy)

## ✅ 적용 완료

**2025년 표준 조합: Ruff + mypy**

- ✅ Ruff: 린팅 + 포매팅 + import 정렬 (올인원)
- ✅ mypy: 타입 체크
- ❌ Black: 제거 (Ruff로 대체)
- ❌ Flake8: 제거 (Ruff로 대체)
- ❌ isort: 제거 (Ruff로 대체)

## 📦 설치

```bash
# 개발 의존성 설치
pip install -e ".[dev]"

# 또는
make dev
```

설치되는 도구:
- `ruff>=0.3.0` - 린팅, 포매팅, import 정렬
- `mypy>=1.8.0` - 타입 체크

## 🚀 사용법

### 1. 기본 명령어

```bash
# 린팅 체크
ruff check .

# 자동 수정
ruff check --fix .

# 포매팅
ruff format .

# 타입 체크
mypy src/

# 전체 검사 (CI/CD)
ruff check . && ruff format --check . && mypy src/
```

### 2. Make 명령어 (권장)

```bash
# 린팅
make lint

# 포매팅 + 자동 수정
make format

# 타입 체크
make typecheck

# 전체 검사 (CI/CD용)
make check
```

### 3. Scripts 사용

```bash
# 린팅
./scripts/lint.sh

# 포매팅
./scripts/format.sh

# 타입 체크
./scripts/typecheck.sh

# 전체 검사
./scripts/check.sh
```

## ⚙️ 설정

### pyproject.toml

```toml
[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = [
    "E", "W",    # pycodestyle
    "F",         # pyflakes
    "I",         # isort
    "B",         # flake8-bugbear
    "C4",        # comprehensions
    "UP",        # pyupgrade
    "ARG",       # unused arguments
    "SIM",       # simplify
    "TCH",       # type checking
    "N",         # naming
    "ASYNC",     # async
]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"

[tool.mypy]
python_version = "3.11"
warn_return_any = true
check_untyped_defs = true
plugins = ["pydantic.mypy"]
```

## 🔧 VS Code 설정

### 익스텐션 설치

필수:
- `charliermarsh.ruff` - Ruff 공식 익스텐션
- `ms-python.python` - Python 지원
- `ms-python.mypy-type-checker` - mypy 지원

### 자동 설정

`.vscode/settings.json`에 이미 설정됨:
- 저장 시 자동 포매팅
- 저장 시 자동 import 정렬
- 저장 시 자동 린팅 수정

## 🔄 Pre-commit Hooks

### 설치

```bash
# pre-commit 설치
pip install pre-commit

# hooks 설치
pre-commit install
```

### 동작

Git commit 시 자동으로:
1. Ruff 린팅 + 자동 수정
2. Ruff 포매팅
3. mypy 타입 체크
4. 기본 파일 체크

### 수동 실행

```bash
# 모든 파일에 대해 실행
pre-commit run --all-files

# 특정 hook만 실행
pre-commit run ruff --all-files
```

## 🚦 CI/CD

GitHub Actions에 자동 설정됨 (`.github/workflows/ci.yml`):

```yaml
- name: Run Ruff lint
  run: ruff check .

- name: Run Ruff format check
  run: ruff format --check .

- name: Run mypy
  run: mypy src/
```

## 📋 규칙 설명

### Ruff 주요 규칙

| 코드 | 설명 | 예시 |
|------|------|------|
| E, W | pycodestyle | PEP 8 스타일 가이드 |
| F | pyflakes | 미사용 import, 변수 |
| I | isort | import 정렬 |
| B | bugbear | 버그 가능성 있는 코드 |
| C4 | comprehensions | list/dict comprehension 개선 |
| UP | pyupgrade | 최신 Python 문법 사용 |
| ARG | unused-arguments | 미사용 함수 인자 |
| SIM | simplify | 코드 단순화 |
| N | naming | 네이밍 컨벤션 |

### 무시된 규칙

```python
# E501: 줄 길이 (formatter가 처리)
# B008: FastAPI Depends() 사용 허용
# ARG001: FastAPI 의존성 인자 허용
```

## 🎯 워크플로우

### 일반 개발

```bash
# 1. 코드 작성
vim src/models/user.py

# 2. 포매팅 + 수정
make format

# 3. 타입 체크 (선택)
make typecheck

# 4. Git commit (pre-commit 자동 실행)
git add .
git commit -m "Add user model"
```

### CI/CD 전 확인

```bash
# 전체 검사 (CI/CD와 동일)
make check
```

## 🔍 문제 해결

### Ruff 오류 무시

```python
# 특정 줄 무시
result = some_function()  # noqa: ARG001

# 파일 전체 무시 (pyproject.toml)
[tool.ruff.lint.per-file-ignores]
"tests/*" = ["ARG"]
```

### mypy 오류 무시

```python
# 특정 줄 무시
x = complex_function()  # type: ignore

# 모듈 무시 (pyproject.toml)
[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false
```

## 📚 추가 리소스

- [Ruff 공식 문서](https://docs.astral.sh/ruff/)
- [Ruff 규칙 목록](https://docs.astral.sh/ruff/rules/)
- [mypy 공식 문서](https://mypy.readthedocs.io/)

## 🎉 장점

### Ruff

- ⚡ **10-100배 빠름** (0.1초 vs 10초)
- 🎯 **올인원** (5개 도구 → 1개)
- 🔧 **자동 수정** (대부분의 문제)
- 📦 **설정 간단** (pyproject.toml 하나)
- 🚀 **대규모 채택** (FastAPI, Pandas 등)

### mypy

- 🔍 **타입 안전성**
- 🐛 **버그 사전 발견**
- 📖 **코드 문서화**
- 🤝 **IDE 지원**

## ✅ 체크리스트

- [x] Ruff 설치 및 설정
- [x] mypy 설치 및 설정
- [x] Black 제거
- [x] VS Code 설정
- [x] Make 명령어
- [x] Scripts 생성
- [x] Pre-commit hooks
- [x] GitHub Actions CI
- [x] 문서 작성

## 🚀 다음 단계

1. 개발자들에게 VS Code 익스텐션 설치 안내
2. Pre-commit hooks 설치 권장
3. CI/CD 파이프라인 테스트
4. 팀 코딩 컨벤션 문서화
