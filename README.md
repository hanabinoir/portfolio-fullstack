# Bilingual Developer Portfolio — Full-Stack Starter

A Dockerized monorepo starter for a bilingual (English/Japanese) portfolio built with **Django REST Framework, PostgreSQL, and Next.js**. The starter is intentionally small: use GitHub Copilot to implement the detailed schema and application features described below.

## Product scope

- Public frontend with three main tabs: **Profile**, **Experiences**, and **Skills**.
- English and Japanese content, with English fallback when a Japanese translation is missing.
- API responses include `content_language`, identifying the language actually returned.
- Employment periods contain projects.
- Organizations can have a website URL.
- Projects can have multiple URLs (product, demo, repository, case study, or other).
- Profile has an optional `profile_picture_url`; profile links are modeled separately.
- Spoken languages are part of the Profile tab and remain separate from technical skills.
- Admin and guest roles initially. HR/recruiter roles may be added later.
- Private personal data (address, phone number, citizenship, visa details) must never be returned by public endpoints.
- OpenAPI schema and Swagger UI for API exploration/testing.

## Stack

- Python 3.12, Django, Django REST Framework
- PostgreSQL 16
- Next.js App Router, React, TypeScript
- Docker Compose
- Planned tests: `pytest`/`pytest-django`, Vitest/React Testing Library, Playwright
- Planned API documentation: `drf-spectacular`

## Repository layout

```text
.
├── .devcontainer/              # Optional VS Code Dev Container
├── .vscode/                    # Recommended extensions and tasks
├── backend/
│   ├── config/settings/        # Base, development, production settings
│   ├── apps/
│   │   ├── accounts/
│   │   ├── profile/
│   │   ├── organizations/
│   │   ├── experiences/
│   │   ├── skills/
│   │   └── private_data/
│   ├── tests/
│   ├── Dockerfile
│   ├── manage.py
│   └── pyproject.toml
├── frontend/
│   ├── src/app/
│   ├── src/components/
│   ├── src/features/
│   ├── src/lib/
│   ├── src/types/
│   └── Dockerfile
├── docs/
├── compose.yaml
└── .env.example
```

## Quick start

Prerequisites: Docker Desktop (or Docker Engine + Compose plugin), Git, and VS Code.

1. Copy `.env.example` to `.env`.
2. Replace the placeholder secret and database password for your local environment.
3. Start the stack:

   ```bash
   docker compose up --build
   ```

4. Open:
   - Frontend: <http://localhost:3000>
   - Django API root: <http://localhost:8000/api/v1/>
   - OpenAPI JSON: <http://localhost:8000/api/v1/openapi/>
   - Swagger UI: <http://localhost:8000/api/v1/docs/>

   OpenAPI/Swagger endpoints are wired in the URL configuration. Their actual schema will expand as API endpoints are implemented.

5. Create a Django admin user:

   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

Django applies migrations automatically when the backend container starts. After adding or changing models, generate migrations explicitly:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

Stop the stack with `Ctrl+C` or `docker compose down`. To remove the local database volume as well, run `docker compose down -v` (destructive: this deletes local database data).

After migrations, load the checked-in portfolio snapshot:

```bash
docker compose exec backend python manage.py loaddata portfolio_seed
```

The original DOCX-based importer is intentionally removed; the repo keeps a stable fixture snapshot instead so the project continues to work even if the source CV files are later deleted.

## Configuration and secrets

- `.env.example` is safe to commit. `.env` is ignored by Git.
- Never commit production secrets.
- `NEXT_PUBLIC_API_BASE_URL` is browser-visible and must contain no secret.
- `API_INTERNAL_URL` is for server-side Next.js calls inside Compose; use `http://backend:8000/api/v1` in the Docker network.
- The frontend is configured to use `http://localhost:8000/api/v1` from the browser.
- Production should use separate production environment variables, managed secrets, HTTPS, secure cookies, and restrictive allowed-host/CORS/CSRF settings.
- Do not use the development Django settings in production.

## Data model decisions for Copilot

Implement normalized Django models and migrations for:

1. **Profile**: UUID PK, optional `profile_picture_url`, `is_active`, timestamps.
2. **ProfileTranslation**: one row per profile/language (`en`, `ja`), display name, headline, summary.
3. **ProfileLink**: multiple links per profile with `link_type`, label, URL and order.
4. **SpokenLanguage**, `SpokenLanguageTranslation`, and `ProfileSpokenLanguage`: spoken languages are displayed on Profile, not in technical skills.
5. **Organization**: name and optional `website_url`; optional localized display names.
6. **Employment**: employer organization, optional client organization, start/end dates, employment type, order.
7. **Experience**: belongs to an employment period; slug, dates, role, team size, order, published flag.
8. **ExperienceTranslation**: English/Japanese title, overview, responsibilities and achievements.
9. **ExperienceURL**: many URLs per project; typed links such as `product`, `demo`, `repository`, `case_study`, `other`.
10. **Skill**: canonical skill, slug, category, nullable duration, featured flag and order.
11. **SkillTranslation**: localized display name and optional description.
12. **ExperienceSkill**: many-to-many relation between projects and skills, with ordering.
13. **SkillSourceClaim**: preserves each CV's original skill name, source language/document, original duration text, notes and review status. Do not silently merge conflicting claims.
14. **PrivateProfile**: one-to-one with Profile, with address, phone number, citizenship, visa type and visa expiry date. Strictly admin-only.

### Constraints and behavior

- Use UUID primary keys for application-managed records.
- Unique slugs for skills and experiences.
- Unique `(parent, language_code)` for translations.
- Unique `(experience, skill)` for the through table.
- Validate that end dates are null or on/after start dates.
- Unknown skill durations are `NULL`, not zero.
- Use English translation fallback when requested translation is missing and return `content_language` per returned translated item.
- Public APIs must only return published experiences and must never serialize private fields.
- Use Django users, groups and permissions for `admin` and `guest`; enforce permissions server-side.
- Keep source-CV claims for later review. Do not invent skill durations or silently overwrite the source text.
- Use `DecimalField` only if numeric durations are needed; retain original duration text in the source-claim table.
- Use object storage for uploaded media in production; store the profile picture URL in the database rather than image bytes.

## Suggested API contract

- `GET /api/v1/profile/?lang=en|ja`
- `GET /api/v1/experiences/?lang=en|ja`
- `GET /api/v1/experiences/{slug}/?lang=en|ja`
- `GET /api/v1/skills/?lang=en|ja`
- `GET /api/v1/organizations/?lang=en|ja`
- Admin CRUD under `/api/v1/admin/...`
- `GET/PATCH /api/v1/admin/private-profile/` — admin only
- `GET /api/v1/openapi/`
- `GET /api/v1/docs/`

Treat these as intended endpoints; add API tests as each endpoint is implemented.

## Testing and quality gates

Recommended CI checks:

### Backend
- `ruff check .`
- `ruff format --check .`
- `pytest`
- `python manage.py check`
- `python manage.py makemigrations --check --dry-run`
- Validate OpenAPI schema generation.

### Frontend
- `npm run lint`
- `npm run typecheck`
- `npm test`
- Playwright smoke tests for core user journeys.

High-priority tests:
- Japanese translation missing → English fallback and `content_language: "en"`.
- Guest cannot read or modify private data.
- Unpublished projects are hidden from guests.
- Multiple URLs can belong to one project.
- Employment/project date validation works.
- Optional URLs and profile picture URL may be null.
- API errors and empty states do not crash the frontend.

## GitHub Copilot handoff

Suggested first prompt after opening this repository:

> Read `README.md` and inspect the existing repository before changing files. Implement the Django models, constraints, admin registration, serializers, viewsets, permissions, routes and tests for the agreed schema. Keep private profile data isolated and admin-only. Add English/Japanese translation fallback with per-item `content_language`. Implement OpenAPI/Swagger using drf-spectacular. Then implement the Next.js Profile, Experiences and Skills tabs against the API, with generated or schema-aligned TypeScript types. Preserve the existing project structure, update README where behavior changes, and run all available checks. Do not invent skill duration claims.

## Current implementation status

This archive provides Docker, configuration, project structure, a minimal frontend page, Django project settings and app placeholders. The full domain models, CRUD endpoints, authentication/authorization policy, translation fallback, generated API types and comprehensive tests are **not yet implemented**; these are the intended next tasks for GitHub Copilot.
