from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import kindness_posts, auth, votes


app = FastAPI(
    title="Acts of Kindness Backend",
    description="Backend for acts-of-kindness",
    version="1.0.0",
)

app.include_router(
    kindness_posts.router, prefix="/kindness_posts", tags=["kindness_posts"]
)
app.include_router(votes.router, prefix="/votes", tags=["votes"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

# CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "acts of kindness backend"}
