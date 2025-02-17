from fastapi import APIRouter, Depends
from app.dependencies import get_token_header

router = APIRouter(dependencies=[Depends(get_token_header)])


@router.get("/")
async def read_admin():
    return {"message": "Read admin"}


@router.post("/")
async def update_admin():
    return {"message": "Update admin"}
