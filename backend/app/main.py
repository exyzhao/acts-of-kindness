from fastapi import FastAPI

from app.database import create_db_and_tables
from app.internal import admin
from app.routers import kindness_post


app = FastAPI(
    title="Acts of Kindness Backend",
    description="Backend for acts-of-kindness",
    version="1.0.0",
)

app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(
    kindness_post.router, prefix="/kindness_posts", tags=["kindness_posts"]
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "acts of kindness backend"}
