import os
from datetime import datetime
from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, Session, SQLModel, Field


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


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


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    username: str


postgres_url = os.getenv("DATABASE_URL")
engine = create_engine(postgres_url, echo=True)
