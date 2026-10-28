# Developer Portfolio — Full-Stack Starter

A Docker Compose starter for a bilingual developer portfolio built with Django REST Framework, PostgreSQL, and Next.js. This root guide covers project links, local configuration, and Docker operations; see the component guides for implementation details.

## Project guides

- [Frontend guide](frontend/README.md) — Next.js application, API usage, and UI guidance.
- [Backend guide](backend/README.md) — Django API, domain apps, endpoints, and backend checks.
- [Architecture notes](docs/architecture.md) — domain boundaries and privacy requirements.
- [README v0.2.0](README_v0.2.0.md) — full product and implementation brief.

## Local configuration

Prerequisites: Docker Desktop (or Docker Engine with the Compose plugin), Git, and a terminal.

1. Copy `.env.example` to `.env`.
2. Set a local Django secret key and PostgreSQL password; do not reuse production credentials.
3. Keep `.env` and all production secrets out of version control. `.env.example` contains placeholders and is safe to commit.
4. `NEXT_PUBLIC_API_BASE_URL` is exposed to the browser and must not contain secrets. `API_INTERNAL_URL` is used by the frontend container to reach the backend on the Compose network; its default is `http://backend:8000/api/v1`.
5. For production, use production settings and managed secrets, HTTPS, secure cookies, and appropriately restrictive host, CORS, and CSRF settings. Do not use the development Django settings in production.

## Docker Compose operations

Start or rebuild the local stack from the repository root:

```bash
docker compose up --build
```

The frontend checks and installs its npm dependencies when the container starts, so dependency changes are applied even when its `node_modules` volume already exists.

To rebuild and start only the frontend service (for example, after changing frontend dependencies), run from the repository root:

```bash
docker compose up --build frontend
```

The local services are available at:

- Frontend: <http://localhost:3000>
- API root: <http://localhost:8000/api/v1/>
- OpenAPI schema: <http://localhost:8000/api/v1/openapi/>
- Swagger UI: <http://localhost:8000/api/v1/docs/>
- Django admin: <http://localhost:8000/admin/>

Useful backend operations:

```bash
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py loaddata portfolio_seed
```

Stop the stack with `Ctrl+C` or run:

```bash
docker compose down
```

Remove the stack and its local database volume only when you intend to delete local database data:

```bash
docker compose down -v
```
