from datetime import datetime
import uuid

from sqlmodel import Field, Relationship, SQLModel


class BaseUser(SQLModel):
    username: str = Field(primary_key=True)
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)


class UserCreate(BaseUser):
    password: str


class User(BaseUser, table=True):
    hashed_password: str


class KindnessPostCreate(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    message: str
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)


class KindnessPost(KindnessPostCreate, table=True):
    poster_username: str = Field(foreign_key="user.username")
    votes: list["Vote"] = Relationship(back_populates="kindness_post")


class KindnessPostWithVoteAmount(KindnessPostCreate):
    poster_username: str = Field(foreign_key="user.username")
    total_vote_amount: int


class VoteCreate(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    vote_amount: int
    kindness_post_id: uuid.UUID = Field(foreign_key="kindnesspost.id")


class Vote(VoteCreate, table=True):
    voter_username: str = Field(foreign_key="user.username")
    kindness_post: KindnessPost = Relationship(back_populates="votes")
