# 자동 포매팅 및 린트 설정 가이드

## 개요

파일 저장 시 자동으로 다음 작업이 수행됩니다:
1. **Import 정렬** (isort 호환)
2. **코드 포매팅** (Black 호환)
3. **린트 자동 수정** (Ruff)

## 전제 조건

### 1. Python 가상 환경 및 의존성 설치

```bash
cd apps/backend-api

# 가상 환경 생성 (uv 사용)
uv venv

# 가상 환경 활성화
source .venv/bin/activate  # Linux/Mac
# 또는
.venv\Scripts\activate     # Windows

# 개발 의존성 설치 (ruff, mypy 포함)
uv pip install -e ".[dev]"
```

### 2. VSCode 확장 프로그램 설치

다음 확장 프로그램을 설치하세요 (`.vscode/extensions.json`에 권장 목록 포함):

1. **Ruff** (`charliermarsh.ruff`)
   - Python 린팅, 포매팅, import 정렬을 한 번에 처리
   
2. **Python** (`ms-python.python`)
   - Python 언어 지원
   
3. **Pylance** (`ms-python.vscode-pylance`)
   - Python 언어 서버 (자동 완성, 타입 체크)
   
4. **Mypy Type Checker** (`ms-python.mypy-type-checker`) - 선택사항
   - 실시간 타입 체크

#### 설치 방법

VSCode에서 자동으로 권장 확장 프로그램을 설치할 수 있습니다:
1. VSCode에서 프로젝트 열기
2. 우측 하단에 나타나는 "확장 프로그램 설치" 알림 클릭
3. 또는 Extensions 패널 (Ctrl+Shift+X)에서 수동으로 검색 후 설치

## 자동 포매팅 동작 방식

### 파일 저장 시 (Ctrl+S / Cmd+S)

```
1. Import 정렬 (Ruff의 isort)
   - 표준 라이브러리
   - 서드파티 라이브러리
   - 로컬 모듈
   순서로 자동 정렬

2. 코드 포매팅 (Ruff Format)
   - 줄 길이: 100자
   - Black 스타일 호환
   - 문자열 따옴표: 쌍따옴표(")

3. 린트 자동 수정 (Ruff)
   - 미사용 import 제거
   - 코드 스타일 수정
   - 간단한 버그 수정
```

### 설정 위치

- **VSCode 설정**: `.vscode/settings.json`
- **Ruff 설정**: `pyproject.toml` 의 `[tool.ruff]` 섹션
- **Pre-commit**: `.pre-commit-config.yaml`

## 수동 실행 방법

### 1. VSCode 명령어

```
Ctrl+Shift+P (Cmd+Shift+P on Mac)
↓
"Format Document" 입력
또는
"Organize Imports" 입력
```

### 2. Makefile 명령어

```bash
# 포매팅 + import 정렬 + 자동 수정
make format

# 린트만 체크 (수정 안함)
make lint

# 타입 체크
make typecheck

# 전체 검사 (CI/CD용)
make check
```

### 3. 직접 명령어

```bash
# Ruff 포매팅
ruff format .

# Ruff 린트 + 자동 수정
ruff check --fix .

# Import 정렬만
ruff check --select I --fix .

# mypy 타입 체크
mypy src/
```

## Ruff 설정 상세

### pyproject.toml 주요 설정

```toml
[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = [
    "E",      # pycodestyle errors
    "W",      # pycodestyle warnings
    "F",      # pyflakes
    "I",      # isort (import 정렬) ⭐
    "B",      # flake8-bugbear
    "C4",     # flake8-comprehensions
    "UP",     # pyupgrade
    "ARG",    # flake8-unused-arguments
    "SIM",    # flake8-simplify
    "N",      # pep8-naming
]

[tool.ruff.lint.isort]
known-first-party = ["src"]
lines-after-imports = 2

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

## Pre-commit Hooks (선택사항)

커밋 전에 자동으로 코드 품질 검사:

```bash
# Pre-commit 설치
pip install pre-commit

# Hooks 활성화
pre-commit install

# 수동 실행 (모든 파일)
pre-commit run --all-files
```

설정 파일: `.pre-commit-config.yaml`

## 문제 해결

### 1. Ruff가 동작하지 않음

**원인**: Ruff 확장 프로그램이 설치되지 않았거나 비활성화됨

**해결**:
```bash
# VSCode에서 Ruff 확장 프로그램 설치 확인
# Extensions 패널 (Ctrl+Shift+X) → "Ruff" 검색 → 설치

# 또는 가상 환경에 ruff 재설치
pip install --upgrade ruff
```

### 2. Import 정렬이 안됨

**원인**: `source.organizeImports` 설정이 누락되었거나 비활성화됨

**해결**:
`.vscode/settings.json` 확인:
```json
{
  "[python]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  }
}
```

### 3. 포매팅이 저장 시 적용되지 않음

**원인**: `formatOnSave`가 비활성화되었거나 다른 포매터가 설정됨

**해결**:
```json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  }
}
```

### 4. 설정이 적용되지 않음

**해결**:
1. VSCode 재시작
2. Python 인터프리터 선택 확인 (Ctrl+Shift+P → "Python: Select Interpreter")
3. `.venv/bin/python` 선택되었는지 확인

### 5. 너무 많은 경고

**해결**:
`pyproject.toml`에서 특정 규칙 무시:
```toml
[tool.ruff.lint]
ignore = [
    "E501",   # line too long
    "ARG001", # unused function argument
]
```

## 베스트 프랙티스

### 1. 저장 전에 확인

파일 저장 시 자동으로 처리되므로, 저장만 하면 됩니다!

```python
# 저장 전
from fastapi import FastAPI,HTTPException
import os
from typing import Optional
import sys

def my_function(  x  ,  y  ):
    return x+y

# 저장 후 (자동 정렬 + 포매팅)
import os
import sys
from typing import Optional

from fastapi import FastAPI, HTTPException


def my_function(x, y):
    return x + y
```

### 2. 팀 협업

모든 팀원이 동일한 설정을 사용하도록:
- `.vscode/settings.json` 파일을 Git에 포함
- `pyproject.toml` Ruff 설정 공유
- `.pre-commit-config.yaml` 사용

### 3. CI/CD 통합

```yaml
# GitHub Actions 예시
- name: Check code quality
  run: |
    pip install ruff mypy
    ruff check .
    ruff format --check .
    mypy src/
```

## 추가 도구

### 1. EditorConfig (선택사항)

일관된 에디터 설정을 위해 `.editorconfig` 파일 추가 가능:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.py]
indent_style = space
indent_size = 4
max_line_length = 100
```

### 2. 다른 에디터 설정

#### PyCharm / IntelliJ

Settings → Tools → File Watchers:
- Ruff 설정 추가
- 저장 시 자동 실행 설정

#### Vim / Neovim

```vim
" .vimrc or init.vim
autocmd BufWritePre *.py execute ':!ruff check --fix %' | execute ':!ruff format %'
```

## 참고 자료

- [Ruff 공식 문서](https://docs.astral.sh/ruff/)
- [VSCode Python 설정](https://code.visualstudio.com/docs/python/settings-reference)
- [Pre-commit 가이드](https://pre-commit.com/)

## 요약

✅ **저장 시 자동 실행**:
- Import 정렬 (isort)
- 코드 포매팅 (Black 스타일)
- 린트 자동 수정

✅ **필수 설정**:
1. Ruff VSCode 확장 프로그램 설치
2. 가상 환경에 `ruff` 설치
3. `.vscode/settings.json` 설정 확인

✅ **수동 실행**:
```bash
make format  # 한 번에 모두 처리
```

이제 파일을 저장할 때마다 자동으로 코드가 정리됩니다! 🎉
