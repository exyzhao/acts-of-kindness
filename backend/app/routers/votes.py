from typing import Annotated

from fastapi import APIRouter, Query
from sqlmodel import select

from app.database import SessionDep
from app.models import Vote


router = APIRouter()


@router.get("/")
async def get_votes(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> list[Vote]:
    return session.exec(select(Vote).offset(offset).limit(limit)).all()


@router.post("/")
async def send_vote(vote: Vote, session: SessionDep) -> Vote:
    session.add(vote)
    session.commit()
    session.refresh(vote)
    return vote
