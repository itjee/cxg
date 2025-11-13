# 포트 설정 가이드

## 기본 포트 구성

CXG 플랫폼의 각 서비스는 다음과 같은 포트 구성을 사용합니다:

### 개발 환경

| 서비스 | 컨테이너 포트 | 호스트 포트 | 공유기 외부 포트 | 용도 |
|--------|--------------|------------|----------------|------|
| backend-api | 8100 | 8100 | 18100 | 백엔드 API 서버 |
| manager-web | 8200 | 8200 | 18200 | 관리자 웹 애플리케이션 |
| tenants-web | 8300 | 8300 | 18300 | 테넌트 웹 애플리케이션 |
| PostgreSQL | 5432 | 5432 | - | 데이터베이스 |
| Redis | 6379 | 6379 | - | 캐시 서버 |

### 프로덕션 환경

프로덕션 환경에서는 다음과 같은 추가 구성이 필요합니다:

| 서비스 | 포트 | 용도 |
|--------|------|------|
| Nginx/Reverse Proxy | 80, 443 | HTTPS 리버스 프록시 |
| backend-api | 8100 | 내부 API 서버 (프록시를 통해 접근) |
| manager-web | 8200 | 내부 관리자 웹 (프록시를 통해 접근) |
| tenants-web | 8300 | 내부 테넌트 웹 (프록시를 통해 접근) |

## 서비스별 포트 설정

### Backend API (Port 8100)

#### 설정 파일: `.env`

```bash
API_PORT=8100
ALLOWED_ORIGINS=["http://localhost:8200","http://localhost:8300"]
```

#### 실행 명령

```bash
# 기본 실행
uvicorn src.main:app --reload --host 0.0.0.0 --port 8100

# 프로덕션
uvicorn src.main:app --workers 4 --host 0.0.0.0 --port 8100
```

#### API 문서 접근

- Swagger UI: http://localhost:8100/docs
- ReDoc: http://localhost:8100/redoc
- OpenAPI JSON: http://localhost:8100/openapi.json

### Manager Web (Port 8200)

#### 설정 파일: `.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1
```

#### package.json 스크립트

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 8200",
    "start": "next start -p 8200"
  }
}
```

#### 접근 URL

- 개발: http://localhost:8200
- 프로덕션: https://manager.yourdomain.com

### Tenants Web (Port 8300)

#### 설정 파일: `.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1
```

#### package.json 스크립트

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 8300",
    "start": "next start -p 8300"
  }
}
```

#### 접근 URL

- 개발: http://localhost:8300
- 프로덕션: https://tenant.yourdomain.com

## 포트 충돌 해결

### 포트 사용 중 확인

#### Linux/macOS

```bash
# 특정 포트 확인
lsof -i :8100
lsof -i :8200
lsof -i :8300

# 프로세스 종료
kill -9 <PID>
```

#### Windows

```bash
# 특정 포트 확인
netstat -ano | findstr :8100
netstat -ano | findstr :8200
netstat -ano | findstr :8300

# 프로세스 종료
taskkill /PID <PID> /F
```

### 대체 포트 사용

임시로 다른 포트를 사용해야 할 경우:

#### Backend API

```bash
# 일시적으로 다른 포트 사용
uvicorn src.main:app --reload --port 8101
```

#### Manager Web

```bash
# package.json을 수정하지 않고 실행
next dev --turbopack -p 8201
```

#### Tenants Web

```bash
# package.json을 수정하지 않고 실행
next dev --turbopack -p 8301
```

## 방화벽 설정

### 개발 환경

개발 환경에서는 로컬호스트만 허용:

```bash
# Linux (ufw)
sudo ufw allow from 127.0.0.1 to any port 8100
sudo ufw allow from 127.0.0.1 to any port 8200
sudo ufw allow from 127.0.0.1 to any port 8300
```

### 프로덕션 환경

프로덕션에서는 리버스 프록시를 통해서만 접근:

```bash
# 외부 접근 차단, 리버스 프록시만 허용
sudo ufw deny 8100
sudo ufw deny 8200
sudo ufw deny 8300

# HTTPS만 허용
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Docker 컨테이너 포트 매핑

Docker를 사용할 경우의 포트 매핑 예시:

### docker-compose.yml

```yaml
services:
  backend-api:
    ports:
      - "8100:8100"
    environment:
      - API_PORT=8100
  
  manager-web:
    ports:
      - "8200:8200"
    environment:
      - PORT=8200
  
  tenants-web:
    ports:
      - "8300:8300"
    environment:
      - PORT=8300
  
  postgres:
    ports:
      - "5432:5432"
  
  redis:
    ports:
      - "6379:6379"
```

## 공유기 포트 포워딩

외부에서 접근해야 할 경우 공유기 포트 포워딩 설정:

| 외부 포트 | 내부 IP | 내부 포트 | 서비스 |
|----------|---------|----------|--------|
| 18100 | 192.168.x.x | 8100 | Backend API |
| 18200 | 192.168.x.x | 8200 | Manager Web |
| 18300 | 192.168.x.x | 8300 | Tenants Web |

**주의사항:**
- 프로덕션 환경에서는 직접 포트 포워딩 대신 리버스 프록시와 HTTPS를 사용하세요.
- 보안을 위해 데이터베이스와 Redis 포트는 외부에 노출하지 마세요.
- 공유기 설정 시 IP 고정(DHCP 예약) 설정이 필요합니다.

## 환경별 포트 설정 요약

### 로컬 개발

```bash
Backend API:  http://localhost:8100
Manager Web:  http://localhost:8200
Tenants Web:  http://localhost:8300
```

### 같은 네트워크 내 다른 기기

```bash
Backend API:  http://192.168.x.x:8100
Manager Web:  http://192.168.x.x:8200
Tenants Web:  http://192.168.x.x:8300
```

### 외부 접근 (공유기 포트 포워딩)

```bash
Backend API:  http://your-public-ip:18100
Manager Web:  http://your-public-ip:18200
Tenants Web:  http://your-public-ip:18300
```

### 프로덕션 (도메인 + HTTPS)

```bash
Backend API:  https://api.yourdomain.com
Manager Web:  https://manager.yourdomain.com
Tenants Web:  https://tenant.yourdomain.com
```

## 트러블슈팅

### 1. CORS 오류

프론트엔드와 백엔드 포트가 다를 경우 CORS 설정 확인:

```bash
# backend-api/.env
ALLOWED_ORIGINS=["http://localhost:8200","http://localhost:8300"]
```

### 2. API 연결 실패

프론트엔드 환경 변수 확인:

```bash
# manager-web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1

# tenants-web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1
```

### 3. 포트 권한 오류 (Linux/macOS)

1024 이하 포트는 root 권한 필요. 8000번대 포트 사용 권장:

```bash
# 권한 없이 실행 가능
uvicorn src.main:app --reload --port 8100
```

### 4. 방화벽 차단

방화벽 설정 확인:

```bash
# Linux
sudo ufw status
sudo ufw allow 8100/tcp

# macOS
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/uvicorn
```

## 참고 문서

- [개발 환경 구축](./10-DEVELOPMENT-SETUP.md)
- [프로젝트 구조](./04-PROJECT-STRUCTURE.md)
- [백엔드 가이드](./06-BACKEND-GUIDE.md)
- [프론트엔드 가이드](./07-FRONTEND-GUIDE.md)
