"""인증 모듈 - User 테이블 생성

Revision ID: 001_init_auth
Revises: 
Create Date: 2025-10-15 16:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_init_auth'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """업그레이드 작업"""
    # idam 스키마 생성
    op.execute('CREATE SCHEMA IF NOT EXISTS idam')
    
    # users 테이블 생성
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        
        # 사용자 기본 정보
        sa.Column('user_type', sa.String(20), nullable=False, server_default='USER'),
        sa.Column('full_name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        
        # 인증 정보
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('password', sa.String(255), nullable=True),
        sa.Column('salt_key', sa.String(100), nullable=True),
        
        # SSO 정보
        sa.Column('sso_provider', sa.String(50), nullable=True),
        sa.Column('sso_subject', sa.String(255), nullable=True),
        
        # MFA 설정
        sa.Column('mfa_enabled', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('mfa_secret', sa.String(255), nullable=True),
        sa.Column('backup_codes', postgresql.ARRAY(sa.Text), nullable=True),
        
        # 계정 상태
        sa.Column('status', sa.String(20), nullable=False, server_default='ACTIVE'),
        
        # 보안 정보
        sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_login_ip', postgresql.INET, nullable=True),
        sa.Column('failed_login_attempts', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('locked_until', sa.DateTime(timezone=True), nullable=True),
        sa.Column('password_changed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('force_password_change', sa.Boolean(), nullable=False, server_default='false'),
        
        # 추가 메타데이터
        sa.Column('timezone', sa.String(50), server_default='UTC'),
        sa.Column('locale', sa.String(10), server_default='ko-KR'),
        sa.Column('department', sa.String(100), nullable=True),
        sa.Column('position', sa.String(100), nullable=True),
        
        sa.PrimaryKeyConstraint('id', name='pk_users'),
        sa.UniqueConstraint('username', name='uk_users__username'),
        sa.UniqueConstraint('email', name='uk_users__email'),
        sa.CheckConstraint("status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED')", name='ck_users__status'),
        sa.CheckConstraint("user_type IN ('MASTER', 'TENANT', 'SYSTEM')", name='ck_users__user_type'),
        schema='idam'
    )
    
    # 인덱스 생성
    op.create_index('ix_users_email', 'users', ['email'], unique=False, schema='idam')
    op.create_index('ix_users_username', 'users', ['username'], unique=False, schema='idam')
    op.create_index('ix_users_user_type', 'users', ['user_type'], unique=False, schema='idam')
    op.create_index('ix_users_status', 'users', ['status'], unique=False, schema='idam')


def downgrade() -> None:
    """다운그레이드 작업"""
    # 인덱스 삭제
    op.drop_index('ix_users_status', table_name='users', schema='idam')
    op.drop_index('ix_users_user_type', table_name='users', schema='idam')
    op.drop_index('ix_users_username', table_name='users', schema='idam')
    op.drop_index('ix_users_email', table_name='users', schema='idam')
    
    # 테이블 삭제
    op.drop_table('users', schema='idam')
    
    # 스키마 삭제 (다른 테이블이 없는 경우에만)
    op.execute('DROP SCHEMA IF EXISTS idam CASCADE')
