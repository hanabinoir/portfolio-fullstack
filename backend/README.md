# Backend

The backend provides the portfolio API and admin interface. It uses Python 3.12, Django, Django REST Framework, and PostgreSQL. Local setup and Compose operations are documented in the [root README](../README.md).

## API

The API is versioned under `/api/v1/`. Current public routes include:

| Route | Purpose |
|---|---|
| `/api/v1/profile/` | Public profile |
| `/api/v1/organizations/` | Organizations |
| `/api/v1/experiences/` | Published experiences |
| `/api/v1/experiences/{slug}/` | Experience detail |
| `/api/v1/skills/` | Skills |
| `/api/v1/openapi/` | OpenAPI schema |
| `/api/v1/docs/` | Swagger UI |

The private profile route currently resolves to `/api/v1/admin/admin/private-profile/` because both the root and app URL configurations add an `admin/` segment. The intended route in the full product brief is `/api/v1/admin/private-profile/`; align the URL configuration before relying on that intended path. Private profile data must remain protected by server-side permissions and must never appear in public serializers.

Localized public requests use the `lang` query parameter, such as `/api/v1/profile/?lang=ja`. When a translation is missing, use English fallback content and report the actual language returned as `content_language`.

## Domain apps

- `profile`: public profile, translations, profile links, and spoken languages.
- `organizations`: employer and client organizations.
- `experiences`: employment periods, projects, translations, project links, and skills.
- `skills`: canonical skills, translations, and source claims.
- `private_data`: private profile fields behind admin-only access.
- `accounts`: role and permission setup.
- `common`: shared model and translation utilities.

See [architecture notes](../docs/architecture.md) for domain boundaries and privacy requirements, and the [full product brief](../README_v0.2.0.md) for intended schema and API behavior.

## Development checks

Run commands from `backend/`. Install the project with its development dependencies in your local Python environment before running these checks.

```bash
ruff check .
ruff format --check .
pytest
python manage.py check
python manage.py makemigrations --check --dry-run
```

API changes should include tests for authorization, translation fallback, and public/private data boundaries where relevant.
