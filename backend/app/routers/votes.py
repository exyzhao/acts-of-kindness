from typing import Annotated

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import select

from app.database import SessionDep
from app.models import Vote, VoteCreate, User
from app.routers.auth import get_current_user


router = APIRouter()


@router.get("/")
async def get_votes(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> list[Vote]:
    return session.exec(select(Vote).offset(offset).limit(limit)).all()


@router.post("/")
async def post_vote(
    vote: VoteCreate,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
) -> Vote:
    if vote.vote_amount < -2 or vote.vote_amount > 2:
        raise HTTPException(
            status_code=400, detail="Vote amount must be between -2 and 2"
        )

    existing_vote = session.exec(
        select(Vote).where(
            Vote.voter_username == current_user.username,
            Vote.kindness_post_id == vote.kindness_post_id,
        )
    ).first()
    if existing_vote:
        raise HTTPException(
            status_code=400, detail="User has already voted on this post"
        )

    new_vote = Vote(
        **dict(vote),
        voter_username=current_user.username,
    )

    session.add(new_vote)
    session.commit()
    session.refresh(new_vote)
    return new_vote
