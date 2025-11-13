# 개발 환경 구축

## 시스템 요구사항

### 하드웨어 요구사항

- **CPU**: 4코어 이상 (권장 8코어)
- **RAM**: 16GB 이상 (권장 32GB)
- **디스크**: 50GB 이상 여유 공간 (SSD 권장)

### 운영체제

- **macOS**: Monterey (12.0) 이상
- **Windows**: Windows 10/11 + WSL2 (Ubuntu 20.04 이상)
- **Linux**: Ubuntu 20.04 LTS 이상, Debian 11 이상

## 필수 도구 설치

### 1. Git

#### macOS
```bash
# Homebrew로 설치
brew install git

# 버전 확인
git --version  # 2.30.0 이상
```

#### Windows (WSL2)
```bash
sudo apt update
sudo apt install git

git --version
```

#### Linux
```bash
sudo apt update
sudo apt install git

git --version
```

### 2. Node.js (v20.x LTS)

#### macOS
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 후
nvm install 20
nvm use 20
nvm alias default 20

# 버전 확인
node --version  # v20.x.x
npm --version   # 10.x.x
```

#### Windows (WSL2)
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# ~/.bashrc 또는 ~/.zshrc에 추가
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 터미널 재시작 후
nvm install 20
nvm use 20
nvm alias default 20
```

#### Linux
```bash
# 위 macOS와 동일
```

### 3. pnpm (v8.15.0+)

```bash
# npm으로 전역 설치
npm install -g pnpm@latest

# 버전 확인
pnpm --version  # 8.15.0 이상

# pnpm 설정
pnpm setup
```

### 4. Python (v3.11+)

#### macOS
```bash
# Homebrew로 설치
brew install python@3.11

# 버전 확인
python3 --version  # 3.11.x
pip3 --version
```

#### Windows (WSL2)
```bash
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.11 python3.11-venv python3.11-dev

# 기본 python3를 3.11로 설정
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
```

#### Linux
```bash
# Ubuntu 22.04+는 기본 제공
sudo apt update
sudo apt install python3.11 python3.11-venv python3.11-dev

# 기본 버전 설정
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
```

### 5. uv (Python 패키지 관리자)

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 버전 확인
uv --version
```

### 6. PostgreSQL (v15+)

#### macOS
```bash
# Homebrew로 설치
brew install postgresql@15

# 서비스 시작
brew services start postgresql@15

# 버전 확인
psql --version  # 15.x
```

#### Windows (WSL2)
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-client-15

# 서비스 시작
sudo service postgresql start

# 자동 시작 설정
sudo systemctl enable postgresql
```

#### Linux
```bash
# PostgreSQL 공식 저장소 추가
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo apt update
sudo apt install postgresql-15

sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Docker로 실행 (권장)

```bash
# PostgreSQL 실행
docker run -d \
  --name cxg-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v cxg-postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# 확인
docker ps
psql -h localhost -U postgres -d postgres
```

### 7. Redis (v7.0+)

#### macOS
```bash
# Homebrew로 설치
brew install redis

# 서비스 시작
brew services start redis

# 버전 확인
redis-server --version  # 7.0.x
```

#### Windows (WSL2)
```bash
sudo apt update
sudo apt install redis-server

# 서비스 시작
sudo service redis-server start
```

#### Linux
```bash
sudo apt update
sudo apt install redis-server

sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Docker로 실행 (권장)

```bash
# Redis 실행
docker run -d \
  --name cxg-redis \
  -p 6379:6379 \
  -v cxg-redis-data:/data \
  redis:7-alpine

# 확인
docker ps
redis-cli ping  # PONG
```

## IDE 설정

### VS Code

#### 설치

```bash
# macOS
brew install --cask visual-studio-code

# Windows
# https://code.visualstudio.com/ 에서 다운로드

# Linux
sudo snap install code --classic
```

#### 필수 확장 프로그램

```bash
# 명령 팔레트에서 설치 (Cmd/Ctrl + Shift + P)
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension charliermarsh.ruff
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-azuretools.vscode-docker
code --install-extension GitHub.copilot
code --install-extension eamodio.gitlens
code --install-extension streetsidesoftware.code-spell-checker
```

#### VS Code 설정 (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": true,
      "source.organizeImports": true
    }
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "python.formatting.provider": "none",
  "python.analysis.typeCheckingMode": "basic",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/__pycache__": true,
    "**/*.pyc": true,
    "**/.pytest_cache": true,
    "**/.venv": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/venv": true,
    "**/.venv": true,
    "**/dist": true,
    "**/build": true,
    "**/.next": true
  }
}
```

### PyCharm (선택)

```bash
# macOS
brew install --cask pycharm-ce  # Community Edition

# Windows / Linux
# https://www.jetbrains.com/pycharm/ 에서 다운로드
```

## 프로젝트 클론

### 저장소 클론

```bash
# SSH (권장)
git clone git@github.com:your-org/cxg-platform.git

# HTTPS
git clone https://github.com/your-org/cxg-platform.git

cd cxg-platform
```

### Git 설정

```bash
# 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 기본 브랜치 설정
git config init.defaultBranch main

# 줄 끝 처리 (Windows)
git config core.autocrlf true

# 줄 끝 처리 (macOS/Linux)
git config core.autocrlf input
```

## 데이터베이스 설정

### PostgreSQL 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE mgmt_db;
CREATE DATABASE tnnt_db;

# 사용자 생성 (선택)
CREATE USER cxg_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mgmt_db TO cxg_user;
GRANT ALL PRIVILEGES ON DATABASE tnnt_db TO cxg_user;

# 종료
\q
```

### Docker Compose로 전체 환경 구성 (권장)

```bash
# Docker Compose 파일이 있는 프로젝트 루트에서
docker-compose up -d

# 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

#### docker-compose.yml 예시

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cxg-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: cxg-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  postgres-data:
  redis-data:
```

## 백엔드 설정

### 1. 가상환경 생성 및 활성화

```bash
cd apps/backend-api

# uv로 가상환경 생성
uv venv

# 가상환경 활성화
# macOS/Linux
source .venv/bin/activate

# Windows (WSL2)
source .venv/bin/activate

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

### 2. 의존성 설치

```bash
# 기본 의존성 설치
uv pip install -e ".[dev]"

# AI 기능 포함 설치
uv pip install -e ".[dev,ai]"

# 설치 확인
uv pip list
```

### 3. 환경 변수 설정

```bash
# .env.example을 복사
cp .env.example .env

# .env 파일 편집
nano .env  # 또는 code .env
```

#### .env 파일 내용

```bash
# 환경
ENVIRONMENT=development
DEBUG=true

# 데이터베이스
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tnnt_db
MGMT_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mgmt_db

# Redis
REDIS_URL=redis://localhost:6379/0

# 보안
SECRET_KEY=your-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["http://localhost:8200","http://localhost:8300"]

# API 설정
API_V1_PREFIX=/api/v1
API_TITLE=CXG Platform API
API_VERSION=1.0.0

# AI (선택)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...

# 로깅
LOG_LEVEL=INFO
LOG_FORMAT=json

# 파일 업로드
MAX_UPLOAD_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=["pdf","jpg","jpeg","png","doc","docx","xls","xlsx"]

# 이메일 (선택)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@cxg-platform.com
```

### 4. 데이터베이스 마이그레이션

```bash
# Alembic 초기화 (최초 1회만)
alembic init alembic

# 마이그레이션 파일 생성
alembic revision --autogenerate -m "Initial migration"

# 마이그레이션 실행
alembic upgrade head

# 마이그레이션 이력 확인
alembic history

# 특정 버전으로 이동
alembic upgrade <revision>

# 롤백
alembic downgrade -1
```

### 5. 테스트 데이터 생성

```bash
# 시드 데이터 스크립트 실행
python scripts/seed_data.py

# 또는 커스텀 스크립트
python scripts/create_test_users.py
```

### 6. 백엔드 서버 실행

```bash
# 개발 서버 실행 (자동 재시작)
uvicorn src.main:app --reload --host 0.0.0.0 --port 8100

# 특정 포트로 실행
uvicorn src.main:app --reload --port 8100

# 워커 수 지정 (프로덕션)
uvicorn src.main:app --workers 4 --host 0.0.0.0 --port 8100

# 로그 레벨 지정
uvicorn src.main:app --reload --log-level debug
```

### 7. API 문서 확인

브라우저에서 다음 URL 접속:
- Swagger UI: http://localhost:8100/docs
- ReDoc: http://localhost:8100/redoc
- OpenAPI JSON: http://localhost:8100/openapi.json

## 프론트엔드 설정

### 1. 루트에서 의존성 설치

```bash
# 프로젝트 루트로 이동
cd ../..  # apps/backend-api에서 루트로

# pnpm 워크스페이스 의존성 설치
pnpm install

# 설치 확인
pnpm list
```

### 2. 환경 변수 설정

#### 관리자 웹 (apps/web-mgmt)

```bash
cd apps/web-mgmt

# .env.local 파일 생성
cp .env.example .env.local

# 편집
nano .env.local
```

```bash
# API 엔드포인트
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1

# 환경
NEXT_PUBLIC_ENVIRONMENT=development

# 기타 설정
NEXT_PUBLIC_APP_NAME=CXG Manager
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### 테넌트 웹 (apps/web-tnnt)

```bash
cd apps/web-tnnt

# .env.local 파일 생성
cp .env.example .env.local
```

```bash
# API 엔드포인트
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1

# 환경
NEXT_PUBLIC_ENVIRONMENT=development

# 기타 설정
NEXT_PUBLIC_APP_NAME=CXG Tenant
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. 프론트엔드 서버 실행

```bash
# 프로젝트 루트에서 모든 앱 실행
pnpm dev

# 또는 개별 실행
cd apps/web-mgmt
pnpm dev  # 포트 8200

# 다른 터미널에서
cd apps/web-tnnt
pnpm dev  # 포트 8300
```

### 4. 프론트엔드 접속

브라우저에서 다음 URL 접속:
- 관리자 웹: http://localhost:8200
- 테넌트 웹: http://localhost:8300

## 코드 품질 도구 설정

### 백엔드 (Python)

#### Ruff 설정 (pyproject.toml)

```toml
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "B", "Q"]
ignore = ["E501"]

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

#### Pyright 설정 (pyproject.toml)

```toml
[tool.pyright]
pythonVersion = "3.11"
typeCheckingMode = "basic"
reportMissingImports = true
reportMissingTypeStubs = false
```

#### Black 설정 (pyproject.toml)

```toml
[tool.black]
line-length = 100
target-version = ['py311']
include = '\.pyi?$'
```

### 프론트엔드 (TypeScript)

#### ESLint 설정 (.eslintrc.json)

```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

#### Prettier 설정 (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### TypeScript 설정 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 테스트 실행

### 백엔드 테스트

```bash
cd apps/backend-api

# 모든 테스트 실행
pytest

# 특정 테스트 파일
pytest tests/test_user.py

# 특정 테스트 함수
pytest tests/test_user.py::test_create_user

# 커버리지 포함
pytest --cov=src --cov-report=html

# 커버리지 리포트 확인
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux

# 마커별 실행
pytest -m unit  # 단위 테스트만
pytest -m integration  # 통합 테스트만

# 병렬 실행
pytest -n auto  # CPU 코어 수만큼
```

### 프론트엔드 테스트

```bash
cd apps/web-mgmt

# 단위 테스트
pnpm test

# Watch 모드
pnpm test:watch

# 커버리지
pnpm test:coverage

# E2E 테스트 (Playwright)
pnpm test:e2e

# E2E 테스트 UI 모드
pnpm test:e2e:ui
```

## 빌드

### 백엔드 빌드

```bash
cd apps/backend-api

# 타입 체크
pyright src/

# 린트
ruff check src/

# 포맷 체크
ruff format --check src/

# 자동 수정
ruff check --fix src/
ruff format src/
```

### 프론트엔드 빌드

```bash
# 프로젝트 루트에서
pnpm build

# 또는 개별 빌드
cd apps/web-mgmt
pnpm build

cd apps/web-tnnt
pnpm build

# 빌드 결과 확인
pnpm start  # 프로덕션 모드로 실행
```

## 문제 해결

### 일반적인 문제

#### 1. Port already in use

```bash
# 포트 사용 중인 프로세스 확인
# macOS/Linux
lsof -i :8100
lsof -i :8200
lsof -i :8300

# 프로세스 종료
kill -9 <PID>

# Windows
netstat -ano | findstr :8100
taskkill /PID <PID> /F
```

#### 2. PostgreSQL 연결 실패

```bash
# PostgreSQL 실행 확인
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# 연결 테스트
psql -h localhost -U postgres -d postgres

# 로그 확인
tail -f /usr/local/var/log/postgres.log  # macOS
sudo tail -f /var/log/postgresql/postgresql-15-main.log  # Linux
```

#### 3. Redis 연결 실패

```bash
# Redis 실행 확인
# macOS
brew services list | grep redis

# Linux
sudo systemctl status redis-server

# 연결 테스트
redis-cli ping  # PONG 응답 확인
```

#### 4. Python 패키지 설치 오류

```bash
# pip 업그레이드
pip install --upgrade pip

# 캐시 삭제
pip cache purge

# uv 캐시 삭제
uv cache clean

# 가상환경 재생성
rm -rf .venv
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"
```

#### 5. Node.js 패키지 설치 오류

```bash
# pnpm 캐시 삭제
pnpm store prune

# node_modules 삭제 후 재설치
rm -rf node_modules
pnpm install

# lock 파일 재생성
rm pnpm-lock.yaml
pnpm install
```

#### 6. Docker 문제

```bash
# Docker 재시작
# macOS
osascript -e 'quit app "Docker"'
open -a Docker

# Linux
sudo systemctl restart docker

# 컨테이너 전체 재시작
docker-compose down
docker-compose up -d

# 볼륨 포함 전체 삭제
docker-compose down -v

# 로그 확인
docker-compose logs -f postgres
docker-compose logs -f redis
```

## 유용한 스크립트

### package.json 스크립트 (루트)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:migrate": "cd apps/backend-api && alembic upgrade head",
    "db:rollback": "cd apps/backend-api && alembic downgrade -1",
    "db:seed": "cd apps/backend-api && python scripts/seed_data.py",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f"
  }
}
```

### Makefile (선택)

```makefile
.PHONY: help install dev build test clean docker-up docker-down

help:
	@echo "사용 가능한 명령어:"
	@echo "  make install     - 모든 의존성 설치"
	@echo "  make dev         - 개발 서버 실행"
	@echo "  make build       - 프로덕션 빌드"
	@echo "  make test        - 테스트 실행"
	@echo "  make clean       - 빌드 파일 삭제"
	@echo "  make docker-up   - Docker 컨테이너 시작"
	@echo "  make docker-down - Docker 컨테이너 중지"

install:
	pnpm install
	cd apps/backend-api && uv pip install -e ".[dev]"

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

clean:
	pnpm clean
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".next" -exec rm -rf {} +

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
```

## 개발 워크플로우

### 일일 개발 시작

```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 새 기능 브랜치 생성
git checkout -b feature/user-management

# 3. Docker 서비스 시작
docker-compose up -d

# 4. 백엔드 서버 시작
cd apps/backend-api
source .venv/bin/activate
uvicorn src.main:app --reload

# 5. 프론트엔드 서버 시작 (새 터미널)
pnpm dev
```

### 코드 커밋 전

```bash
# 1. 코드 포맷팅
cd apps/backend-api
ruff format src/

cd ../../
pnpm format

# 2. 린트 체크
cd apps/backend-api
ruff check src/

cd ../../
pnpm lint

# 3. 타입 체크
cd apps/backend-api
pyright src/

cd apps/web-mgmt
pnpm type-check

# 4. 테스트 실행
cd apps/backend-api
pytest

cd ../../
pnpm test

# 5. 커밋
git add .
git commit -m "feat: 사용자 관리 기능 추가"
git push origin feature/user-management
```

## 참고 자료

### 공식 문서

- FastAPI: https://fastapi.tiangolo.com/
- Next.js: https://nextjs.org/docs
- PostgreSQL: https://www.postgresql.org/docs/
- Redis: https://redis.io/documentation
- Pydantic: https://docs.pydantic.dev/
- TanStack Query: https://tanstack.com/query/latest
- Tailwind CSS: https://tailwindcss.com/docs

### 내부 문서

- 프로젝트 개요: `docs/01-PROJECT-OVERVIEW.md`
- 아키텍처: `docs/02-ARCHITECTURE.md`
- 기술 스택: `docs/03-TECH-STACK.md`
- 프로젝트 구조: `docs/04-PROJECT-STRUCTURE.md`
- 네이밍 규칙: `docs/05-NAMING-CONVENTIONS.md`
- 백엔드 가이드: `docs/06-BACKEND-GUIDE.md`
- 프론트엔드 가이드: `docs/07-FRONTEND-GUIDE.md`
- 데이터베이스 가이드: `docs/08-DATABASE-GUIDE.md`
- API 규격: `docs/09-API-SPECIFICATION.md`

## 체크리스트

개발 환경 구축 완료 확인:

- [ ] Git 설치 및 설정
- [ ] Node.js 20.x 설치
- [ ] pnpm 8.15+ 설치
- [ ] Python 3.11+ 설치
- [ ] uv 설치
- [ ] PostgreSQL 15+ 설치 또는 Docker 실행
- [ ] Redis 7+ 설치 또는 Docker 실행
- [ ] VS Code 설치 및 확장 프로그램 설치
- [ ] 프로젝트 클론
- [ ] 백엔드 가상환경 생성
- [ ] 백엔드 의존성 설치
- [ ] 백엔드 .env 파일 설정
- [ ] 데이터베이스 생성
- [ ] 마이그레이션 실행
- [ ] 프론트엔드 의존성 설치
- [ ] 프론트엔드 .env.local 파일 설정
- [ ] 백엔드 서버 실행 확인
- [ ] 프론트엔드 서버 실행 확인
- [ ] API 문서 접속 확인 (http://localhost:8100/docs)
- [ ] 웹 애플리케이션 접속 확인

환경 구축이 완료되면 `docs/06-BACKEND-GUIDE.md`와 `docs/07-FRONTEND-GUIDE.md`를 참고하여 개발을 시작하세요!
