import os
from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, Session, SQLModel


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def reset_db_and_tables():
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


postgres_url = os.getenv("DATABASE_URL")
engine = create_engine(postgres_url, echo=True)
