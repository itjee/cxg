# Ruff 자동 저장 설정 가이드

**목표**: VS Code에서 `Ctrl+S` 저장 시 자동으로 Ruff로 import 정렬 및 코드 정리

## 📋 현재 상태

- ✅ `pyproject.toml`: Ruff 설정 완료
- ✅ `.vscode/settings.json`: 저장 시 자동 실행 설정 완료
- ⚠️ Ruff 확장: 설치 필요

## 🚀 설정 단계

### 1단계: Ruff 확장 설치 (필수)

VS Code에서:
1. `Ctrl+Shift+X` (확장 탭 열기)
2. "ruff" 검색
3. **Ruff** (charliermarsh.ruff) 설치

```
설치해야 할 확장:
- Ruff (charliermarsh.ruff) - 메인 Ruff 확장
- Python (ms-python.python) - Python 지원
- Pylance (ms-python.vscode-pylance) - 타입 체크
```

### 2단계: Virtual Environment 생성 및 Ruff 설치

```bash
cd apps/backend-api

# 방법 A: uv 사용 (권장)
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv pip install -e ".[dev]"

# 방법 B: 직접 pip 사용
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

### 3단계: VS Code 재로드

1. `Ctrl+Shift+P` (명령 팔레트)
2. "Reload Window" 입력 및 실행
3. 또는 VS Code 재시작

## ✅ 검증

저장 시 다음이 자동으로 실행됩니다:

```python
# 저장 전
from sqlalchemy import String,Integer,Text,  Boolean, DateTime
from sqlalchemy.orm import Mapped,mapped_column
from ..base import TenantBaseModel

# 저장 후 (자동 정렬)
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from ..base import TenantBaseModel
```

## 🔧 설정 파일 위치

### Root 프로젝트 (.vscode/settings.json)
```json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": "explicit",
      "source.organizeImports": "explicit"
    }
  },
  "ruff.enable": true,
  "ruff.organizeImports": true,
  "ruff.fixAll": true
}
```

### Backend API (.vscode/settings.json)
```json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports": "explicit"
    }
  },
  "ruff.lint.args": ["--fix"]
}
```

### pyproject.toml의 Ruff 설정
```toml
[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = [
    "E", "W", "F", "I", "B", "C4", "UP", "ARG", "SIM", "TCH", "N", "ASYNC"
]

[tool.ruff.lint.isort]
known-first-party = ["src"]
section-order = ["future", "standard-library", "third-party", "first-party", "local-folder"]
lines-after-imports = 2
```

## 🎯 자동 적용되는 규칙

### Import 정렬 (I - isort)
```
순서:
1. __future__ imports
2. Standard library imports
3. Third-party imports
4. First-party (src) imports
5. Local imports

각 섹션 사이: 2줄 공백
```

### Code Formatting
- **Line Length**: 100자
- **Quotes**: Double quotes (")
- **Indent**: 4 spaces
- **Import Lines After**: 2줄

### 자동 수정 규칙 (--fix)
- ✅ E: pycodestyle errors
- ✅ W: pycodestyle warnings
- ✅ F: pyflakes (미사용 import 제거)
- ✅ I: import 정렬
- ✅ UP: 최신 Python 문법
- ✅ SIM: 코드 단순화

## 🔍 문제 해결

### 1. 저장해도 정렬되지 않음

**확인할 사항**:
```bash
# Ruff 설치 확인
ruff --version

# Virtual environment 활성화 확인
which ruff  # 또는 where ruff (Windows)

# 설정 파일 확인
cat apps/backend-api/.vscode/settings.json
```

**해결 방법**:
1. VS Code 재로드 (`Ctrl+Shift+P` → "Reload Window")
2. Ruff 확장 재설치
3. Virtual environment 재생성

### 2. Ruff 명령이 없음

```bash
# 수동으로 설치
pip install ruff

# 또는 pyproject.toml의 dev 의존성 설치
pip install -e ".[dev]"
```

### 3. 특정 파일에서만 작동 안 함

**원인**: 파일이 .git 제외 목록이나 pyproject.toml의 exclude에 포함됨

**확인**:
```bash
# 해당 파일에 대해 Ruff 직접 실행
ruff check --fix src/models/tenants/crm/contracts.py
```

### 4. Import 정렬이 다르게 됨

**원인**: 여러 formatter가 충돌 중

**해결**:
1. Black 확장 비활성화
2. Pylint 비활성화
3. Ruff만 활성화

```json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff"
  },
  "python.linting.pylintEnabled": false,
  "python.formatting.provider": "none"
}
```

## 📊 자동 정렬 예시

### Before (저장 전)
```python
from typing import Optional,Dict,List
from sqlalchemy import String,Integer,Text,Boolean
import os
import sys
from ..base import TenantBaseModel
from src.core.database import get_session

class User(TenantBaseModel):
    pass
```

### After (저장 후)
```python
import os
import sys
from typing import Dict, List, Optional

from sqlalchemy import Boolean, Integer, String, Text

from src.core.database import get_session

from ..base import TenantBaseModel


class User(TenantBaseModel):
    pass
```

## 🎨 매뉴얼 실행

원할 때 언제든 수동으로 실행:

```bash
# 전체 프로젝트 정렬
cd apps/backend-api
ruff check --fix src/

# 특정 파일 정렬
ruff check --fix src/models/tenants/crm/contracts.py

# 포매팅만 (linting 제외)
ruff format src/

# Linting만 (포매팅 제외, 자동 수정)
ruff check --fix src/

# 자동 수정 없이 문제만 확인
ruff check src/
```

## 📝 Ruff vs Black vs isort

| 기능 | Ruff | Black | isort |
|------|------|-------|-------|
| Import 정렬 | ✅ | ❌ | ✅ |
| Code 포매팅 | ✅ | ✅ | ❌ |
| Linting | ✅ | ❌ | ❌ |
| 속도 | 매우 빠름 | 느림 | 중간 |
| Python 지원 | ✅ | ✅ | ✅ |
| **All-in-One** | ✅ | ❌ | ❌ |

## ⚙️ 추가 설정

### 파일 저장 시 추가 동작

```json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      // Ruff로 자동 수정
      "source.fixAll.ruff": "explicit",
      // Import 정렬
      "source.organizeImports": "explicit",
      // 사용되지 않은 import 제거
      "source.unusedImports": "explicit"
    }
  }
}
```

### 터미널에서 사전 커밋 hook 설정

`.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

설치:
```bash
pip install pre-commit
pre-commit install
```

## 📚 참고 자료

- [Ruff 공식 문서](https://docs.astral.sh/ruff/)
- [pyproject.toml 설정](https://docs.astral.sh/ruff/configuration/)
- [VS Code Ruff 확장](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff)
- [isort 호환성](https://docs.astral.sh/ruff/settings/#isort)

---

**상태**: ✅ 설정 완료, 환경 준비 필요
**최종 단계**: Ruff 확장 설치 → Virtual Environment 생성 → Ruff 설치 → VS Code 재로드
