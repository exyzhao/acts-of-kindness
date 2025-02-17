from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlmodel import select

from app.database import SessionDep
from app.models import KindnessPost, KindnessPostCreate, User
from app.routers.auth import get_current_user


router = APIRouter()


@router.get("/ping")
async def root():
    return {"message": "pong"}


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
    kindness_post: KindnessPostCreate,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
) -> KindnessPost:
    new_kindness_post = KindnessPost(
        **dict(kindness_post), poster_username=current_user.username
    )

    session.add(new_kindness_post)
    session.commit()
    session.refresh(new_kindness_post)
    return new_kindness_post


@router.delete("/{post_id}")
async def delete_kindness_post(
    post_id: int,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    kindness_post = session.get(KindnessPost, post_id)
    if not kindness_post:
        raise HTTPException(status_code=404, detail="Post not found")
    if kindness_post.poster_username != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized")
    session.delete(kindness_post)
    session.commit()

    return {"ok": True}
