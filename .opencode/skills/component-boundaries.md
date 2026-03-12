# Component Boundaries

## Goal

Keep components small, understandable, and easy to evolve.

## Split a Component When

1. It handles more than one visual section
2. It renders repeated card or option markup
3. It mixes static configuration data with render logic
4. It starts acting like an entire page instead of a component
5. It contains unrelated responsibilities like header, selection grid, and footer together

## Preferred Structure

Bad:

- one component renders the page shell, header, cards, and footer

Good:

- page in `src/pages/home/index.tsx` composes `HeroSection`
- page composes `RoleSelection`
- `RoleSelection` renders `RoleCard`
- feature-owned UI lives in `src/features/<feature>/components/`
- reusable cross-feature UI lives in `src/components/`

## Data Separation

1. Move non-trivial option arrays to `src/resources/config`
2. Keep config files typed
3. Keep backend-like or sample data in `src/resources/mock-data`
4. Keep render components focused on UI and interaction

## Placement Guidance

Use these defaults:

1. `src/components/` for reusable or page-specific UI
2. `src/features/<feature>/components/` for domain-owned UI
3. `src/hooks/` for reusable React hooks
4. `src/utils/` for framework-agnostic helpers
5. `src/resources/config/` for static configuration
6. `src/resources/mock-data/` for sample and mock data

## Review Checklist

Ask these questions:

1. Can this component be understood in under a minute?
2. Would another developer know where to add a third option/card?
3. Is the component mostly layout, data config, or reusable UI?
4. Can one concern change without rewriting the whole file?
