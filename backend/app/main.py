from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer

from app.database import create_db_and_tables
from app.routers import kindness_posts, votes


app = FastAPI(
    title="Acts of Kindness Backend",
    description="Backend for acts-of-kindness",
    version="1.0.0",
)

app.include_router(
    kindness_posts.router, prefix="/kindness_posts", tags=["kindness_posts"]
)
app.include_router(votes.router, prefix="/votes", tags=["votes"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "acts of kindness backend"}


@app.get("/secret/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
