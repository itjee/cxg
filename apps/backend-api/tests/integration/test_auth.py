"""인증 API 통합 테스트"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestAuthAPI:
    """인증 API 테스트"""

    async def test_register_success(self, client: AsyncClient):
        """회원가입 성공 테스트"""
        response = await client.post(
            "/api/v1/manager/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123",
                "full_name": "테스트 사용자",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["data"]["username"] == "testuser"
        assert data["data"]["email"] == "test@example.com"
        assert "id" in data["data"]

    async def test_register_duplicate_username(self, client: AsyncClient):
        """중복 사용자명 회원가입 실패 테스트"""
        # 첫 번째 사용자 생성
        await client.post(
            "/api/v1/manager/auth/register",
            json={
                "username": "testuser",
                "email": "test1@example.com",
                "password": "password123",
                "full_name": "테스트 사용자1",
            },
        )

        # 같은 사용자명으로 재시도
        response = await client.post(
            "/api/v1/manager/auth/register",
            json={
                "username": "testuser",
                "email": "test2@example.com",
                "password": "password123",
                "full_name": "테스트 사용자2",
            },
        )

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "이미 존재하는 사용자명" in data["error"]["message"]

    async def test_login_success(self, client: AsyncClient):
        """로그인 성공 테스트"""
        # 사용자 등록
        await client.post(
            "/api/v1/manager/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123",
                "full_name": "테스트 사용자",
            },
        )

        # 로그인
        response = await client.post(
            "/api/v1/manager/auth/login",
            json={
                "username": "testuser",
                "password": "password123",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]
        assert data["data"]["token_type"] == "bearer"

    async def test_login_wrong_password(self, client: AsyncClient):
        """잘못된 비밀번호 로그인 실패 테스트"""
        # 사용자 등록
        await client.post(
            "/api/v1/manager/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123",
                "full_name": "테스트 사용자",
            },
        )

        # 잘못된 비밀번호로 로그인
        response = await client.post(
            "/api/v1/manager/auth/login",
            json={
                "username": "testuser",
                "password": "wrongpassword",
            },
        )

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "일치하지 않습니다" in data["error"]["message"]

    async def test_get_current_user(self, client: AsyncClient):
        """현재 사용자 정보 조회 테스트"""
        # 사용자 등록
        await client.post(
            "/api/v1/manager/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123",
                "full_name": "테스트 사용자",
            },
        )

        # 로그인
        login_response = await client.post(
            "/api/v1/manager/auth/login",
            json={
                "username": "testuser",
                "password": "password123",
            },
        )
        token = login_response.json()["data"]["access_token"]

        # 현재 사용자 정보 조회
        response = await client.get(
            "/api/v1/manager/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["username"] == "testuser"
        assert data["data"]["email"] == "test@example.com"

    async def test_change_password(self, client: AsyncClient):
        """비밀번호 변경 테스트"""
        # 사용자 등록
        await client.post(
            "/api/v1/manager/auth/register",
            json={
                "username": "testuser",
                "email": "test@example.com",
                "password": "password123",
                "full_name": "테스트 사용자",
            },
        )

        # 로그인
        login_response = await client.post(
            "/api/v1/manager/auth/login",
            json={
                "username": "testuser",
                "password": "password123",
            },
        )
        token = login_response.json()["data"]["access_token"]

        # 비밀번호 변경
        response = await client.post(
            "/api/v1/manager/auth/change-password",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "current_password": "password123",
                "new_password": "newpassword123",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

        # 새 비밀번호로 로그인 확인
        new_login_response = await client.post(
            "/api/v1/manager/auth/login",
            json={
                "username": "testuser",
                "password": "newpassword123",
            },
        )
        assert new_login_response.status_code == 200
