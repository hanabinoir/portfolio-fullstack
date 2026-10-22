Below is the ORM/schema plan based on the EN and JP CVs, the project README, and the decisions you confirmed.

1. Scope and assumptions

- We will implement the schema described in [README.md](README.md) as the primary source of truth.
- The README’s “SkillSourceClaim” policy is the source of truth for conflicting CV facts:
  - keep both claims
  - mark them as review-needed
  - never silently overwrite or merge conflicting entries
- For dates/org names where the JP CV is more complete and consistent with the project chronology, treat the JP CV as canonical for structured fields, while still preserving EN/JP source claims.
- We are not seeding the DB in this phase; this is a schema + ORM plan only.

2. App-level model structure

- `backend/apps/profile`
  - `Profile`
  - `ProfileTranslation`
  - `ProfileLink`
  - `SpokenLanguage`
  - `SpokenLanguageTranslation`
  - `ProfileSpokenLanguage`
- `backend/apps/organizations`
  - `Organization`
  - `OrganizationTranslation` if localized company names are needed
- `backend/apps/experiences`
  - `Employment`
  - `Experience`
  - `ExperienceTranslation`
  - `ExperienceURL`
  - `ExperienceSkill`
  - `ExperiencePhase`
- `backend/apps/skills`
  - `Skill`
  - `SkillTranslation`
  - `SkillSourceClaim`
- `backend/apps/private_data`
  - `PrivateProfile`
- `backend/apps/accounts`
  - no domain models; only group/permission bootstrap migration

3. Core model decisions

Profile
- `Profile`:
  - UUID PK
  - `profile_picture_url` nullable
  - `is_active` boolean
  - timestamps
  - one-to-one relationship to `PrivateProfile`
- `ProfileTranslation`:
  - `profile`
  - `language_code`
  - `display_name`
  - `headline`
  - `summary`
  - unique `(profile, language_code)`
- `ProfileLink`:
  - `profile`
  - `link_type`
  - `label`
  - `url`
  - `order`
- `SpokenLanguage`:
  - canonical language code/name (e.g. English, Japanese, Mandarin, Cantonese)
- `SpokenLanguageTranslation`:
  - localized name labels, optional
- `ProfileSpokenLanguage`:
  - profile + spoken_language
  - `proficiency_level` (e.g. native, business, conversational)
  - maybe `order`
- This matches the CV sections “Languages” and “Profile”.

Organization
- `Organization`:
  - canonical name
  - optional `website_url`
  - optional localized label/name if needed
- `OrganizationTranslation`:
  - localized display names
- `Employment`:
  - `employer` organization
  - `client` organization nullable
  - `start_date`, `end_date` nullable
  - `employment_type`
  - `order`
  - `CheckConstraint(end_date IS NULL OR end_date >= start_date)`

Experience
- `Experience`:
  - `employment`
  - `slug` unique
  - `role`
  - `team_size` nullable
  - `starts_at`, `ends_at`
  - `is_published`
  - `order`
  - `CheckConstraint(end_date IS NULL OR end_date >= start_date)`
- `ExperienceTranslation`:
  - `experience`
  - `language_code`
  - `title`
  - `overview`
  - `responsibilities` required text
  - `contributions` optional text
  - unique `(experience, language_code)`
- `ExperienceURL`:
  - `experience`
  - `link_type`: product/demo/repository/case_study/other
  - `label`
  - `url`
  - `order`
- `ExperiencePhase`:
  - `experience`
  - `phase_name` required
  - `phase_order`
  - This is the table you requested, so the JP CV phases like “仕様確認 / 設計 / 製造 / 試験 / リリース” become rows instead of flattened fields.
  - This is especially useful for multiple-phase workflows across project histories.

Skill
- `Skill`:
  - canonical name
  - slug unique
  - category (language/framework/tool/os/cloud/database/other)
  - duration_months nullable
  - `featured`
  - `order`
- `SkillTranslation`:
  - localized display label and description
- `ExperienceSkill`:
  - `experience`
  - `skill`
  - `order`
  - unique `(experience, skill)`
- `SkillSourceClaim`:
  - `skill`
  - `source_language`
  - `source_document` (EN CV / JP CV / raw text)
  - `original_name`
  - `original_duration_text`
  - `notes`
  - `review_status` (pending/accepted/rejected)
  - This preserves raw CV intelligence without inventing or overwriting.

PrivateProfile
- `PrivateProfile`:
  - one-to-one with `Profile`
  - `address`
  - `phone_number`
  - `citizenship`
  - `visa_type`
  - `visa_expiry_date`
  - admin-only endpoints only
  - never included in public serializers

4. CV conflict handling policy

We will follow the README rule: keep both sources in claim tables and do not silently merge contradictory facts.

Examples to preserve as review items:
- Railway app employer/client confusion:
  - EN CV says client “NTT Data”
  - JP CV says employer = NDS.TS / Adecco dispatch
- Shenzen project date mismatch
- Team size mismatch
- Skill duration conflict / missing skills
- Name differences in EN vs JP CV

Implementation rule:
- Canonical structured fields get the best consistent values from the JP CV when the chronology is clear.
- Every fact that is ambiguous/conflicting is also stored in `SkillSourceClaim` or a `source_claim`-style record for later manual review.
- This matches the README requirement to “keep source-CV claims for later review” and “do not invent skill durations”.

5. TODO first: Education and Certification

You asked:
- “Make Education and Certification TODO first.”

So the plan is:
- First pass: implement the required, high-confidence portfolio schema from the README.
- Second pass, after the main schema is stable: add `Education` and `Certification` as TODO backlog items, not as current schema work.
- Recommended future model shape:
  - `Education`
    - institution
    - degree_or_program
    - start_date
    - end_date
    - location
    - notes
  - `Certification`
    - name
    - issuer
    - issue_date
    - expiry_date nullable
    - credential_id nullable
    - notes
- Reason: the README does not require them for the MVP schema, while the CV facts are present but not central to the portfolio API contract.

6. Implementation order

1. Shared base models and validators
2. `organizations`
3. `skills`
4. `profile`
5. `experiences`
6. `private_data`
7. admin permission bootstrap migration
8. tests
9. serializers/viewsets/routes
10. API translation fallback and `content_language`
11. frontend typing against API schema
12. Education/Certification later

7. Validation rules to include in the schema

- unique slug for `Skill` and `Experience`
- unique `(profile, language_code)` for translations
- unique `(experience, skill)` for through table
- `end_date` null or >= `start_date`
- `duration_months` null rather than 0 when unknown
- public endpoints exclude private fields entirely
- public API only exposes published experiences
- `content_language` returned per response item, with EN fallback when JA missing

8. Data model names and fields to keep in mind

- `ExperiencePhase`: `phase_name`, `phase_order`
- `Responsibilities` is required text in translation
- `Contributions` is optional text in translation
- `SkillSourceClaim.original_duration_text` is retained as text; do not convert to numeric unless later validated
- `Profile.profile_picture_url` should remain a URL, not binary upload storage
- Keep source CV claims separate from canonical data model fields

9. Final plan summary

- Do the core normalized schema first: profile, organizations, experiences, skills, private data.
- Add the review/claim tables as required.
- Do not merge conflicting CV facts silently.
- Insert `ExperiencePhase` table as requested.
- Keep `Education` and `Certification` as deferred TODOs.
- Validate with migrations, model checks, and tests before serializer/viewset work.

If anything remains unclear or if you want me to turn this into a concrete Django model spec next, I can draft the exact model classes and migration order.