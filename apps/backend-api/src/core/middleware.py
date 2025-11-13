"""미들웨어"""

import time
import uuid
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class RequestIDMiddleware(BaseHTTPMiddleware):
    """요청 ID 추가 미들웨어"""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id

        return response


class TimingMiddleware(BaseHTTPMiddleware):
    """요청 처리 시간 측정 미들웨어"""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        response = await call_next(request)

        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)

        return response
