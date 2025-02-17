from datetime import datetime

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    username: str = Field(primary_key=True)
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)


class KindnessPost(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    description: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    user_id: int


class Vote(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    kindness_post_id: int
    vote: int
    user_id: int
