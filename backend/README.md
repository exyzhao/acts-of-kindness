# Backend for acts of kindness

## Running

```bash
docker compose up --build
```

Then you can access the API at `http://0.0.0.0:8000`, for example:

```bash
curl -X GET "http://0.0.0.0:8000/kindness_posts"
```

Or just view the Swagger UI at `http://0.0.0.0:8000/docs`.
