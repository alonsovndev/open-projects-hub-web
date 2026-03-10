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

- page composes `HeroSection`
- page composes `RoleSelection`
- `RoleSelection` renders `RoleCard`
- shared footer lives in `src/shared` when reuse is justified

## Data Separation

1. Define feature interfaces in `src/features/<feature>/types/index.ts`
2. Move non-trivial option arrays to config files
3. Keep config files typed
4. Keep backend-like mock data separate from UI config

## Review Checklist

Ask these questions:

1. Can this component be understood in under a minute?
2. Would another developer know where to add a third option/card?
3. Is the component mostly layout, data config, or reusable UI?
4. Can one concern change without rewriting the whole file?
