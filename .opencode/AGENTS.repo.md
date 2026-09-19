# Repository Agent Instructions

Repository-only guidance for `open-projects-hub-web`.

## Scope

- Apply only to this repository.
- Keep this file lean; put durable repo rules in `.opencode/knowledge/repo-standards.md`.
- Do not duplicate global safety, git, testing, or communication rules.

## Working Model

- This is a React + TypeScript + Vite frontend organized by feature slices under `src/features/*`.
- Prefer the existing split of responsibilities:
  - route/page components render UI
  - hooks own page logic and side effects
  - `api/` owns RTK Query endpoints and API-to-domain mapping
  - `shared/` owns cross-feature types, hooks, utilities, and layout pieces
- Follow current naming and file placement before introducing new patterns.

## Design System

- **DESIGN.md** (project root) is the single source of truth for all UI/UX decisions.
- All components and pages must conform to DESIGN.md standards.
- When DESIGN.md and existing code conflict, code should be updated to match DESIGN.md.
- Load the `design-system-guardian` skill after any component/page creation to verify compliance.

## UI/UX Skills

The repository has 9 specialized skills in `.opencode/skills/`:

| Skill                        | When to Use                             |
| ---------------------------- | --------------------------------------- |
| `ui-ux-reviewer`             | Review overall UX and interface quality |
| `design-system-guardian`     | Enforce DESIGN.md compliance            |
| `ant-design-architect`       | Verify Ant Design component usage       |
| `responsive-design-reviewer` | Verify all breakpoints work             |
| `accessibility-reviewer`     | Verify WCAG AA compliance               |
| `landing-page-expert`        | Optimize marketing/conversion pages     |
| `form-ux-expert`             | Optimize form UX                        |
| `dashboard-ux-expert`        | Improve admin panel UX                  |
| `css-modules-reviewer`       | Review SCSS maintainability             |

Load the relevant skill when the task matches its purpose. See `.opencode/workflows/ui-ux-workflows.md` for automation triggers.

## Verification Commands

- Lint: `npm run lint`
- Type-check: `npm run type-check`
- Unit/integration tests: `npm run test:run`
- E2E tests: `npm run test:e2e`
- Full verification: `npm run verify`

## High-Value Local Rules

- Keep generated instruction files (`AGENTS.md`, `.github/copilot-instructions.md`) as generated outputs; edit source files and re-sync.
- Use the `@/` path alias for internal imports where the codebase already does so.
- When backend payloads differ from UI/domain types, keep translation at the API boundary instead of leaking transport shapes into components.
- For repo-specific standards, terminology, and architecture details, see `.opencode/knowledge/repo-standards.md`.
