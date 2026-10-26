# Frontend

The frontend is the public portfolio experience, built with Next.js App Router, React, and TypeScript. Run it through Docker Compose from the repository root; shared setup and environment guidance is in the [root README](../README.md).

## Responsibilities

- Present the Profile, Experiences, and Skills sections in a responsive, accessible interface.
- Fetch public portfolio data from the backend API. Keep API response types aligned with the backend OpenAPI schema.
- Keep presentation and navigation concerns in the frontend; private profile data must not be requested or exposed here.

## API configuration

The API helper in `src/lib/api.ts` uses `API_INTERNAL_URL` for server-side requests and `NEXT_PUBLIC_API_BASE_URL` for browser-side requests. The browser URL is public, so never put credentials or other secrets in `NEXT_PUBLIC_*` variables.

Localized API requests use the `lang` query parameter (for example, `/profile/?lang=ja`). The frontend supports `en`, `ja`, `zh-Hant-TW`, and `ko`. Locale labels and section translations live in `src/lib/i18n.ts`; when the backend returns English fallback content, the UI identifies it using `content_language`.

## UI guidance

- Keep navigation clear and usable with a keyboard, visible focus styles, and narrow screens.
- Treat all four supported locales as selectable. Allow for longer translated labels and text wrapping.
- Prefer semantic HTML and restrained CSS; respect reduced-motion preferences.
- Do not invent professional claims, skill levels, or experience durations.
- Render distinct empty and API error states so missing data does not look like a completed profile.

## Checks

Run these from `frontend/`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The frontend is still a starter; consult the [full product brief](../README_v0.2.0.md) for broader planned product and design requirements.
