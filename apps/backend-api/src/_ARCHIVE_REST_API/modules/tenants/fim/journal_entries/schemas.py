"""Journal Entries schemas for request/response validation."""

from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, Field


class JournalEntriesBase(BaseModel):
    """Base schema."""
    pass


class JournalEntriesCreate(BaseModel):
    """Create schema."""
    pass


class JournalEntriesUpdate(BaseModel):
    """Update schema."""
    pass


class JournalEntriesResponse(BaseModel):
    """Response schema."""
    
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class JournalEntriesListResponse(BaseModel):
    """List response schema."""
    
    items: list[JournalEntriesResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
