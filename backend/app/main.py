from fastapi import FastAPI

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


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "acts of kindness backend"}
