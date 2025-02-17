from fastapi import FastAPI
from app.internal import admin

app = FastAPI(
    title="FastAPI App",
    description="A sample FastAPI application with structured routing",
    version="1.0.0",
)


app.include_router(admin.router, prefix="/admin", tags=["admin"])


@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application"}
