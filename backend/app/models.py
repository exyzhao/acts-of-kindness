from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel


class UserCreate(SQLModel):
    username: str = Field(primary_key=True)
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)


class User(UserCreate, table=True):
    hashed_password: str


class KindnessPost(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    description: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    poster_username: str
    # votes: list["Vote"] = Relationship(back_populates="kindness_post")


class Vote(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # kindness_post: KindnessPost = Relationship(back_populates="votes")
    vote_amount: int
    voter_username: str
    kindness_post_id: int
