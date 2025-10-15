# CXG Platform Backend API

## 설치
```bash
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"
```

## 실행
```bash
uvicorn api.main:app --reload
```

## API 문서

- http://localhost:8100/docs