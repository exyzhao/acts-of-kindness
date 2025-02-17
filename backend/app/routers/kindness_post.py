from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.database import KindnessPost, Vote, SessionDep


router = APIRouter()


@router.get("/")
async def get_kindness_posts(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
) -> list[KindnessPost]:
    return session.exec(
        select(KindnessPost)
        .order_by(KindnessPost.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()


@router.get("/{post_id}")
async def get_kindness_post_by_id(post_id: int, session: SessionDep) -> KindnessPost:
    kindness_post = session.get(KindnessPost, post_id)
    if not kindness_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return kindness_post


@router.post("/")
async def create_kindness_post(
    kindness_post: KindnessPost, session: SessionDep
) -> KindnessPost:
    session.add(kindness_post)
    session.commit()
    session.refresh(kindness_post)
    return kindness_post


@router.delete("/{post_id}")
async def delete_kindness_post(post_id: int, session: SessionDep):
    kindness_post = session.get(KindnessPost, post_id)
    if not kindness_post:
        raise HTTPException(status_code=404, detail="Post not found")
    session.delete(kindness_post)
    session.commit()

    return {"ok": True}


@router.post("/votes")
async def vote_on_kindness_post(vote: Vote, session: SessionDep) -> Vote:
    session.add(vote)
    session.commit()
    session.refresh(vote)
    return vote
