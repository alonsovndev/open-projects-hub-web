# Repository Standards

## Architecture Boundaries

- Organize work by feature under `src/features/<feature>/`.
- Feature routes are declared in each feature `routes.tsx` and aggregated in `src/app/routing/routes.tsx`.
- Keep pages thin: render composition in page components, move stateful logic and mutations into feature hooks.
- Put cross-feature domain models in `src/shared/types/domain.ts`; avoid redefining shared business types inside features.
- Put cross-feature UI and utilities in `src/shared/`; do not move feature-only code there prematurely.

## API and State Conventions

- Use RTK Query endpoints via `src/app/api/base-api.ts` and feature `api/` modules.
- Keep backend response shapes as `*Response` types and map them to frontend/domain types in `transformResponse` or dedicated transformers.
- Normalize naming mismatches at the API boundary:
  - backend transport fields may be snake_case or backend-oriented
  - frontend domain and component props should stay consistent with existing app naming
- Reuse existing tag names and invalidation patterns before adding new cache tags.
- Auth tokens are read from Redux state by `base-api`; do not introduce alternate auth plumbing casually.

## UI and Component Patterns

- Prefer Ant Design components and existing SCSS module styling patterns over custom primitives.
- Follow current page composition: feature page + feature hooks + focused child components.
- Prefer explicit names aligned with domain language (`ProjectResponse`, `StoryResponse`, `endDate`, `clientName`).
- Keep forms typed, validate at the form layer, and convert date objects to API-safe strings at submit boundaries.
- **DESIGN.md** is the single source of truth for all UI decisions — always reference it before building UI.

## Design System Enforcement

- Every component must use the design token system (`$primary-base`, `$spacing-md`, etc.) — no hardcoded values.
- The 9 skills in `.opencode/skills/` provide automated review for UI/UX quality. Load the relevant skill when:
  - Creating new pages → `responsive-design-reviewer` + `accessibility-reviewer` + `ant-design-architect`
  - Building forms → `form-ux-expert` + `accessibility-reviewer`
  - Editing SCSS → `css-modules-reviewer` + `design-system-guardian`
  - Pre-release → `design-system-guardian` + `accessibility-reviewer`
- See `.opencode/workflows/ui-ux-workflows.md` for detailed trigger mapping.

## Security Constraints

- Treat auth/session changes as security-sensitive.
- Do not persist access tokens or refresh tokens in browser storage without explicit user approval and security review.
- Never log secrets, tokens, credentials, or raw sensitive payloads in production-oriented code.
- Keep error normalization centralized when possible; avoid scattering custom auth or API error handling across components.

## Testing and Verification

- Prefer targeted verification for the touched slice first, then broader repo checks when impact is wider.
- Minimum expected checks for code changes are the relevant subset of:
  - `npm run lint`
  - `npm run type-check`
  - `npm run test:run -- <relevant paths>` or equivalent targeted Vitest runs
  - `npm run build` when routing, bundling, or app-wide types may be affected
- If repo tests are already failing outside the changed scope, report that clearly instead of masking it.
- For UI changes, also run `design-system-guardian` + `accessibility-reviewer` skills.

## Generated AI Instruction Files

- `AGENTS.md` and `.github/copilot-instructions.md` are generated artifacts.
- Edit `.opencode/AGENTS.repo.md` and `.opencode/knowledge/repo-standards.md`, then run `/sync-copilot-instructions` (or the fallback sync script) to regenerate them.
