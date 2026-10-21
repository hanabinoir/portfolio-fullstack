# Frontend

Next.js App Router + TypeScript. Run with Docker Compose from the repository root.

The API helper distinguishes server-side (`API_INTERNAL_URL`) from browser-side
(`NEXT_PUBLIC_API_BASE_URL`) requests. `NEXT_PUBLIC_*` variables are public.
Generate TypeScript types from the backend OpenAPI schema once the API schema is
implemented.
