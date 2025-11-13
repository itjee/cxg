# TypeScript 설치 오류 해결

**문제 발생일**: 2025-01-06  
**오류 타입**: ERR_PNPM_INCLUDED_DEPS_CONFLICT  
**상태**: ✅ 해결됨

---

## ❌ 발생한 오류

```bash
Installing TypeScript as it was not found while loading "next.config.ts".

Installing devDependencies (pnpm):
- typescript

ERR_PNPM_INCLUDED_DEPS_CONFLICT  modules directory (at "/home/itjee/workspace/cxg") 
was installed with optionalDependencies, dependencies. 
Current install wants optionalDependencies, dependencies, devDependencies.

Failed to install TypeScript, please install it manually to continue:
pnpm add --save-exact --save-dev typescript
```

---

## 🔍 원인 분석

### 1. NODE_ENV 설정 문제
```bash
devDependencies: skipped because NODE_ENV is set to production
```
- `NODE_ENV=production`으로 설정되어 있었음
- production 환경에서는 devDependencies가 설치되지 않음
- TypeScript는 devDependency이므로 설치 실패

### 2. pnpm 워크스페이스 충돌
```
modules directory was installed with optionalDependencies, dependencies.
Current install wants optionalDependencies, dependencies, devDependencies.
```
- 이전 설치와 현재 설치의 dependency 타입이 다름
- pnpm은 이런 변경사항을 감지하고 재설치를 요구함

---

## ✅ 해결 방법

### 1단계: 모든 node_modules 정리
```bash
cd /home/itjee/workspace/cxg

# 루트 node_modules 삭제
rm -rf node_modules

# 모든 앱의 node_modules 삭제
rm -rf apps/*/node_modules

# 모든 패키지의 node_modules 삭제
rm -rf packages/*/node_modules

# lock 파일 삭제
rm -f pnpm-lock.yaml
```

### 2단계: NODE_ENV 해제 후 재설치
```bash
# NODE_ENV 해제 (중요!)
unset NODE_ENV

# 전체 재설치
pnpm install
```

### 3단계: 확인
```bash
# pnpm이 확인을 요청하면 Y 입력
? The modules directory at "/home/itjee/workspace/cxg/apps/manager-web/node_modules" 
  will be removed and reinstalled from scratch. Proceed? (Y/n) 
> Y

? The modules directory at "/home/itjee/workspace/cxg/apps/tenants-web/node_modules" 
  will be removed and reinstalled from scratch. Proceed? (Y/n) 
> Y
```

---

## 📊 설치 결과

### Dependencies (Production)
```
+ @radix-ui/react-tabs 1.1.13
+ geist 1.5.1
+ pretendard 1.3.9
+ sonner 2.0.7
```

### DevDependencies (Development)
```
+ turbo 2.6.0
+ typescript 5.9.3  ✅
```

**총 패키지**: 122개  
**설치 시간**: 2분 1초  
**상태**: ✅ 정상

---

## 🎯 핵심 포인트

### ❌ 하지 말아야 할 것
```bash
# NODE_ENV=production 상태에서 개발 작업
NODE_ENV=production pnpm install  # devDependencies 설치 안됨!
```

### ✅ 해야 할 것
```bash
# 개발 환경에서는 NODE_ENV 해제
unset NODE_ENV
pnpm install  # 모든 dependencies 설치됨 ✅
```

---

## 🚀 빠른 해결 스크립트

### 완전 초기화 스크립트
```bash
#!/bin/bash
# reset-deps.sh

cd /home/itjee/workspace/cxg

echo "🧹 Cleaning node_modules..."
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -f pnpm-lock.yaml

echo "📦 Reinstalling dependencies..."
unset NODE_ENV
pnpm install

echo "✅ Done!"
```

### 사용 방법
```bash
chmod +x reset-deps.sh
./reset-deps.sh
```

---

## 📊 Before vs After

### Before (오류 상태)
```
❌ NODE_ENV=production
❌ devDependencies 설치 안됨
❌ TypeScript 없음
❌ next.config.ts 로드 실패
```

### After (해결 상태)
```
✅ NODE_ENV 해제
✅ devDependencies 설치됨
✅ TypeScript 5.9.3 설치
✅ next.config.ts 정상 로드
✅ 총 122개 패키지 설치
```

---

## ✅ 최종 확인 사항

- [x] node_modules 완전 정리
- [x] pnpm-lock.yaml 삭제
- [x] NODE_ENV 해제
- [x] pnpm install 실행
- [x] TypeScript 5.9.3 설치 확인
- [x] Turbo 2.6.0 설치 확인
- [x] 총 122개 패키지 설치
- [x] next.config.ts 로드 가능 확인

---

**해결 완료**: 2025-01-06  
**설치된 TypeScript**: 5.9.3  
**상태**: ✅ 정상 작동  
**다음**: manager-web 개발 서버 실행 및 테스트
